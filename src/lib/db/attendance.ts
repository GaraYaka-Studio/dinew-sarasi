'use server';

import { db } from '@/db';
import {
    attendanceRecords,
    students,
    studentFees,
    enrollments,
    classSessions,
    classes,
} from '@/db/schema';
import { eq, and, isNull, gte, lte, sql, desc, asc } from 'drizzle-orm';
import {
    timeToMinutes,
    getCurrentDate,
    getCurrentMinutes,
    getDateOffset,
    formatDate as formatDateUtil,
    getCurrentScanTime,
    SESSION_BUFFER_MINUTES,
} from '@/lib/utils/time';

// Types
export interface PaymentStatus {
    hasPaid: boolean;
    arrears: number;
    feeAmount: number;
    paidAmount: number;
    status: string;
}
export interface ClassWithSession {
    id: string;
    name: string;
    grade: string;
    medium: string | null;
    type: string | null;
    sessionId: string | null;
    sessionDate: string | null;
    sessionStartTime: string | null;
    sessionEndTime: string | null;
    sessionStatus: string | null;
}

// Attendance Log Types
export interface AttendanceLogStudent {
    id: string;
    name: string;
    studentId: number;
    scanTime: string;
    avatarUrl: string | null;
}

export interface AttendanceLogSession {
    id: string;
    className: string;
    time: string;
    totalPresent: number;
    students: AttendanceLogStudent[];
}

export interface StudentAttendanceData {
    id: string;
    studentId: number;
    fullName: string;
    initials: string | null;
    phone: string;
    photoUrl: string | null;
    qrCode: string | null;
    currentGrade: string | null;
    gender: 'male' | 'female';
    isEnrolled: boolean;
    attendanceHistory: boolean[];
    paymentStatus?: {
        hasPaid: boolean;
        arrears: number;
    };
}

// Session types for internal use
interface SessionData {
    sessionId: string;
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string | null;
}

interface ClassData {
    id: string;
    name: string;
    grade: string;
    medium: string | null;
    type: string | null;
}

interface AttendanceResult {
    success: boolean;
    status: number;
    error: string | null;
    alreadyMarked?: boolean;
}

type AttendanceInsertValues = {
    student_id: string;
    class_id: string;
    session_id: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    marked_by?: string;
};

// ============================================================================
// Student Search & Lookup
// ============================================================================

/**
 * Search students enrolled in a specific class
 * Searches by: student_id, full_name, phone, qr_code
 */
export async function searchStudentsForAttendance(
    query: string,
    classId: string
) {
    if (!query || query.length < 2 || !classId) return [];

    const searchTerm = `${query}%`;

    return await db
        .select({
            id: students.id,
            studentId: students.student_id,
            fullName: students.full_name,
            initials: students.initials,
            phone: students.phone,
            photoUrl: students.photo_url,
            qrCode: students.qr_code,
            currentGrade: students.current_grade,
        })
        .from(students)
        .innerJoin(enrollments, eq(enrollments.student_id, students.id))
        .where(
            and(
                eq(enrollments.class_id, classId),
                eq(enrollments.is_active, true),
                isNull(students.deleted_at),
                isNull(enrollments.deleted_at),
                sql`(
                    ${students.full_name} ILIKE ${searchTerm}
                    OR ${students.phone} ILIKE ${searchTerm}
                    OR ${students.student_id}::text LIKE ${searchTerm}
                    OR ${students.qr_code} = ${query}
                )`
            )
        )
        .limit(10);
}

/**
 * Get student details with attendance history and payment status
 */
export async function getStudentForAttendance(
    studentId: string,
    classId: string
) {
    const student = await db
        .select({
            id: students.id,
            studentId: students.student_id,
            fullName: students.full_name,
            initials: students.initials,
            phone: students.phone,
            photoUrl: students.photo_url,
            currentGrade: students.current_grade,
            gender: students.gender,
        })
        .from(students)
        .where(eq(students.id, studentId))
        .limit(1);

    if (student.length === 0) return null;

    const isEnrolled = await db
        .select()
        .from(enrollments)
        .where(
            and(
                eq(enrollments.student_id, studentId),
                eq(enrollments.class_id, classId),
                eq(enrollments.is_active, true),
                isNull(enrollments.deleted_at)
            )
        )
        .limit(1);

    if (isEnrolled.length === 0) {
        return {
            ...student[0],
            isEnrolled: false,
            attendanceHistory: [],
            paymentStatus: null,
        };
    }

    const [attendanceHistory, paymentStatus] = await Promise.all([
        getAttendanceHistory(studentId, classId),
        getPaymentStatus(studentId, classId),
    ]);

    return {
        ...student[0],
        isEnrolled: true,
        attendanceHistory,
        paymentStatus,
    };
}

async function getAttendanceHistory(
    studentId: string,
    classId: string
): Promise<boolean[]> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const records = await db
        .select({
            status: attendanceRecords.status,
        })
        .from(attendanceRecords)
        .where(
            and(
                eq(attendanceRecords.student_id, studentId),
                eq(attendanceRecords.class_id, classId),
                gte(attendanceRecords.date, formatDateUtil(monthStart)),
                lte(attendanceRecords.date, formatDateUtil(monthEnd))
            )
        )
        .orderBy(desc(attendanceRecords.date));

    return records
        .reverse()
        .map((r) => r.status === 'present' || r.status === 'late');
}

async function getPaymentStatus(
    studentId: string,
    classId: string
): Promise<PaymentStatus | null> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const result = await db
        .select({
            feeAmount: studentFees.fee_amount,
            paidAmount: studentFees.paid_amount,
            status: studentFees.status,
        })
        .from(studentFees)
        .where(
            and(
                eq(studentFees.student_id, studentId),
                eq(studentFees.class_id, classId),
                eq(studentFees.year, currentYear),
                eq(studentFees.month_index, currentMonth),
                isNull(studentFees.deleted_at)
            )
        )
        .limit(1);

    const payment = result[0];
    if (!payment) return null;

    const arrears = Number(payment.feeAmount) - Number(payment.paidAmount || 0);

    return {
        hasPaid: payment.status === 'paid',
        arrears: arrears > 0 ? arrears : 0,
        feeAmount: Number(payment.feeAmount),
        paidAmount: Number(payment.paidAmount || 0),
        status: payment.status ?? 'unknown',
    };
}

// ============================================================================
// Attendance Marking
// ============================================================================

/**
 * Mark attendance for a student
 * Validates enrollment and checks for duplicates
 */
export async function markAttendance(data: {
    studentId: string;
    classId: string;
    sessionId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    markedBy?: string;
}): Promise<AttendanceResult> {
    const { studentId, classId, sessionId, date, status, markedBy } = data;

    const [enrollmentCheck, existingRecord, sessionCheck] = await Promise.all([
        validateEnrollment(studentId, classId),
        findExistingAttendance(studentId, sessionId, date),
        validateSession(sessionId, classId),
    ]);

    if (!enrollmentCheck) {
        return {
            success: false,
            status: 403,
            error: 'Student is not enrolled in this class',
        };
    }

    if (existingRecord) {
        return {
            success: false,
            status: 409,
            error: `Already marked ${existingRecord.status} for this session.`,
            alreadyMarked: true,
        };
    }

    if (!sessionCheck) {
        return {
            success: false,
            status: 404,
            error: 'Session not found for this class.',
        };
    }

    return await insertAttendanceRecord(
        studentId,
        classId,
        sessionId,
        date,
        status,
        markedBy
    );
}

async function validateEnrollment(
    studentId: string,
    classId: string
): Promise<boolean> {
    const result = await db
        .select()
        .from(enrollments)
        .where(
            and(
                eq(enrollments.student_id, studentId),
                eq(enrollments.class_id, classId),
                eq(enrollments.is_active, true),
                isNull(enrollments.deleted_at)
            )
        )
        .limit(1);
    return result.length > 0;
}

async function findExistingAttendance(
    studentId: string,
    sessionId: string,
    date: string
) {
    const result = await db
        .select()
        .from(attendanceRecords)
        .where(
            and(
                eq(attendanceRecords.student_id, studentId),
                eq(attendanceRecords.session_id, sessionId),
                eq(attendanceRecords.date, date)
            )
        )
        .limit(1);
    return result[0];
}

async function validateSession(
    sessionId: string,
    classId: string
): Promise<boolean> {
    const result = await db
        .select()
        .from(classSessions)
        .where(
            and(
                eq(classSessions.id, sessionId),
                eq(classSessions.class_id, classId),
                isNull(classSessions.deleted_at)
            )
        )
        .limit(1);
    return result.length > 0;
}

async function insertAttendanceRecord(
    studentId: string,
    classId: string,
    sessionId: string,
    date: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    markedBy?: string
): Promise<AttendanceResult> {
    try {
        const values: AttendanceInsertValues = {
            student_id: studentId,
            class_id: classId,
            session_id: sessionId,
            date,
            status,
        };

        if (markedBy && markedBy.length > 0) {
            values.marked_by = markedBy;
        }

        await db.insert(attendanceRecords).values({
            ...values,
            scan_time: getCurrentScanTime(),
        });

        return {
            success: true,
            status: 201,
            error: null,
            alreadyMarked: false,
        };
    } catch (error: unknown) {
        return handleAttendanceError(error);
    }
}

function handleAttendanceError(error: unknown): AttendanceResult {
    const err = error as {
        code?: string;
        constraint?: string;
        detail?: string;
        message?: string;
    };

    // Duplicate key error
    const isDuplicate =
        err.code === '23505' ||
        err.constraint ===
            'attendance_records_student_id_session_id_date_index' ||
        err.detail?.includes('already exists');

    if (isDuplicate) {
        return {
            success: false,
            status: 409,
            error: 'Already marked for this session. Each student can only have one attendance record per session.',
            alreadyMarked: true,
        };
    }

    // Foreign key error
    if (err.code === '23503') {
        const messages: Record<string, string> = {
            attendance_records_student_id_students_id_fk: 'Student not found.',
            attendance_records_class_id_classes_id_fk: 'Class not found.',
            attendance_records_marked_by_profiles_id_fk:
                'User account not found.',
        };
        return {
            success: false,
            status: 400,
            error:
                messages[err.constraint || ''] ||
                'Session or related record not found.',
        };
    }

    return {
        success: false,
        status: 500,
        error: `Failed (${err.code || 'UNKNOWN'}): ${err.message || 'Unknown error'}`,
    };
}

/**
 * Get attendance count for a specific session/date
 * Returns count of students marked as present or late
 */
export async function getSessionAttendanceCount(
    sessionId: string,
    date: string
): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(attendanceRecords)
        .where(
            and(
                eq(attendanceRecords.session_id, sessionId),
                eq(attendanceRecords.date, date),
                sql`${attendanceRecords.status} IN ('present', 'late')`
            )
        );
    return result[0]?.count || 0;
}

// ============================================================================
// Class & Session Lookup
// ============================================================================

/**
 * Get classes with their active sessions
 * Returns the current/next session for each class (today only)
 */
export async function getClassesWithSessionInfo(): Promise<ClassWithSession[]> {
    const todayDate = getCurrentDate();
    const currentMinutes = getCurrentMinutes();
    const timeBufferMinutes = currentMinutes - SESSION_BUFFER_MINUTES;

    const [allClasses, allSessions] = await Promise.all([
        fetchActiveClasses(),
        fetchSessionsForDate(todayDate),
    ]);

    const classesWithSessions = allClasses.map((cls) =>
        selectBestSessionForClass(
            cls,
            allSessions,
            todayDate,
            currentMinutes,
            timeBufferMinutes
        )
    );

    // Only return classes that have sessions today
    return classesWithSessions.filter((cls) => cls.sessionId !== null);
}

async function fetchActiveClasses() {
    return await db
        .select({
            id: classes.id,
            name: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
        })
        .from(classes)
        .where(and(eq(classes.is_active, true), isNull(classes.deleted_at)))
        .orderBy(classes.grade, classes.name);
}

async function fetchSessionsForDate(date: string) {
    return await db
        .select({
            classId: classSessions.class_id,
            sessionId: classSessions.id,
            date: classSessions.date,
            startTime: classSessions.start_time,
            endTime: classSessions.end_time,
            status: classSessions.status,
        })
        .from(classSessions)
        .where(
            and(
                eq(classSessions.date, date),
                sql`${classSessions.status} != 'cancelled'`,
                isNull(classSessions.deleted_at)
            )
        );
}

function selectBestSessionForClass(
    cls: ClassData,
    allSessions: SessionData[],
    todayDate: string,
    currentMinutes: number,
    timeBufferMinutes: number
): ClassWithSession {
    const sessionsForClass = allSessions.filter((s) => s.classId === cls.id);

    if (sessionsForClass.length === 0) {
        return createClassWithSession(cls, null);
    }

    const selectedSession =
        findBestSession(sessionsForClass, currentMinutes, timeBufferMinutes) ||
        sessionsForClass[0];

    return createClassWithSession(cls, selectedSession);
}

function findBestSession(
    sessions: SessionData[],
    currentMinutes: number,
    timeBufferMinutes: number
): SessionData | null {
    // Priority 1: Current session (happening now)
    const currentSession = sessions.find((s) => {
        const start = timeToMinutes(s.startTime);
        const end = timeToMinutes(s.endTime, start);
        return start <= currentMinutes && end >= timeBufferMinutes;
    });
    if (currentSession) return currentSession;

    // Priority 2: Next upcoming session
    const nextSession = sessions
        .filter((s) => timeToMinutes(s.startTime) > currentMinutes)
        .sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        )[0];
    if (nextSession) return nextSession;

    // Priority 3: Most recent past session
    const pastSession = sessions
        .filter(
            (s) =>
                timeToMinutes(s.endTime, timeToMinutes(s.startTime)) <
                currentMinutes
        )
        .sort(
            (a, b) => timeToMinutes(b.startTime) - timeToMinutes(a.startTime)
        )[0];
    if (pastSession) return pastSession;

    return null;
}

function createClassWithSession(
    cls: ClassData,
    session: SessionData | null
): ClassWithSession {
    return session
        ? {
              ...cls,
              sessionId: session.sessionId,
              sessionDate: session.date,
              sessionStartTime: session.startTime,
              sessionEndTime: session.endTime,
              sessionStatus: session.status,
          }
        : {
              ...cls,
              sessionId: null,
              sessionDate: null,
              sessionStartTime: null,
              sessionEndTime: null,
              sessionStatus: null,
          };
}

// ============================================================================
// Attendance Log
// ============================================================================

/**
 * Get attendance log grouped by session for a specific date
 * Returns sessions with their attendance records and student details
 */
export async function getAttendanceLogByDate(
    date: string
): Promise<AttendanceLogSession[]> {
    // Get all sessions for the date with attendance records
    const sessions = await db
        .select({
            sessionId: classSessions.id,
            classId: classSessions.class_id,
            className: classes.name,
            startTime: classSessions.start_time,
            attendanceId: attendanceRecords.id,
            studentId: attendanceRecords.student_id,
            studentName: students.full_name,
            studentNumericId: students.student_id,
            scanTime: attendanceRecords.scan_time,
            photoUrl: students.photo_url,
            status: attendanceRecords.status,
        })
        .from(classSessions)
        .innerJoin(classes, eq(classSessions.class_id, classes.id))
        .innerJoin(
            attendanceRecords,
            and(
                eq(attendanceRecords.session_id, classSessions.id),
                eq(attendanceRecords.date, date)
            )
        )
        .innerJoin(students, eq(attendanceRecords.student_id, students.id))
        .where(
            and(
                eq(classSessions.date, date),
                sql`${attendanceRecords.status} IN ('present', 'late')`,
                isNull(classSessions.deleted_at)
            )
        )
        .orderBy(
            asc(classSessions.start_time),
            asc(attendanceRecords.scan_time)
        );

    // Group by session
    const sessionMap = new Map<string, AttendanceLogSession>();

    for (const record of sessions) {
        const key = record.sessionId;

        if (!sessionMap.has(key)) {
            // Format time (e.g., "08:00:00" -> "08:00 AM")
            const timeParts = record.startTime.split(':');
            const hour = parseInt(timeParts[0]);
            const minute = timeParts[1];
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const formattedTime = `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;

            sessionMap.set(key, {
                id: record.sessionId,
                className: record.className,
                time: formattedTime,
                totalPresent: 0,
                students: [],
            });
        }

        const session = sessionMap.get(key)!;

        // Format scan time (e.g., "08:05:30" -> "08:05 AM")
        const scanTimeStr = record.scanTime ?? '00:00:00';
        const scanTimeParts = scanTimeStr.split(':');
        const scanHour = parseInt(scanTimeParts[0]);
        const scanMinute = scanTimeParts[1];
        const scanPeriod = scanHour >= 12 ? 'PM' : 'AM';
        const displayScanHour =
            scanHour === 0 ? 12 : scanHour > 12 ? scanHour - 12 : scanHour;
        const formattedScanTime = `${displayScanHour.toString().padStart(2, '0')}:${scanMinute} ${scanPeriod}`;

        session.students.push({
            id: record.attendanceId,
            name: record.studentName,
            studentId: record.studentNumericId,
            scanTime: formattedScanTime,
            avatarUrl: record.photoUrl,
        });
        session.totalPresent = session.students.length;
    }

    // Convert map to array
    return Array.from(sessionMap.values());
}

/**
 * Delete an attendance record by ID
 */
export async function deleteAttendanceRecord(
    attendanceId: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        await db
            .delete(attendanceRecords)
            .where(eq(attendanceRecords.id, attendanceId));

        return { success: true, error: null };
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        console.error('Failed to delete attendance record:', error);

        if (err.code === '23503') {
            return {
                success: false,
                error: 'Cannot delete record due to existing references.',
            };
        }

        return {
            success: false,
            error: err.message || 'Failed to delete attendance record.',
        };
    }
}
