'use server';

import { db } from '@/db';
import {
    payments,
    paymentItems,
    students,
    classes,
    teacherPayments,
    teachers,
    enrollments,
    classSessions,
    attendanceRecords,
    auditLogs,
    profiles,
} from '@/db/schema';
import { eq, and, gte, lte, isNull, sql, desc, asc, or, inArray } from 'drizzle-orm';
import { formatDate } from '@/lib/utils/time';
import type {
    StudentPaymentRecord,
    TeacherPaymentGroup,
    FinancialSummary,
    AttendanceLogSessionWithDate,
    ActivitySession,
    ActivitySummary,
    AuditLogRecord,
    AuditAction,
    AuditModule,
    AuditSummary,
} from '@/types/reports';

// ============================================================================
// FINANCIAL REPORT QUERIES
// ============================================================================

/**
 * Get student payment records for a specific month
 * Includes both monthly fee payments AND admission fees
 */
export async function getStudentPaymentsForMonth(
    year: number,
    month: number
): Promise<StudentPaymentRecord[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const results = await db
        .select({
            date: sql<string>`DATE(${payments.payment_date})`,
            receiptNumber: payments.receipt_number,
            studentName: students.full_name,
            type: paymentItems.type,
            className: classes.name,
            grade: classes.grade,
            amount: paymentItems.amount,
        })
        .from(payments)
        .innerJoin(paymentItems, eq(paymentItems.payment_id, payments.id))
        .innerJoin(students, eq(students.id, payments.student_id))
        .innerJoin(classes, eq(classes.id, paymentItems.class_id))
        .where(
            and(
                sql`${paymentItems.type} IN ('monthly', 'admission')`,
                gte(payments.payment_date, startDate),
                lte(payments.payment_date, endDate),
                isNull(payments.deleted_at)
            )
        )
        .orderBy(desc(payments.payment_date));

    return results.map((r) => ({
        date: r.date,
        receiptNumber: r.receiptNumber ?? 0,
        studentName: r.studentName,
        type: r.type as 'monthly' | 'admission',
        className: r.className,
        grade: r.grade,
        amount: Number(r.amount),
    }));
}

/**
 * Get teacher payment records grouped by teacher for a specific month
 */
export async function getTeacherPaymentsForMonth(
    year: number,
    month: number
): Promise<TeacherPaymentGroup[]> {
    const startDate = formatDate(new Date(year, month, 1));
    const endDate = formatDate(new Date(year, month + 1, 0));

    // Get all teacher payments for the month with teacher details
    const paymentsData = await db
        .select({
            paymentId: teacherPayments.id,
            date: teacherPayments.date,
            amount: teacherPayments.amount,
            notes: teacherPayments.notes,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(teacherPayments)
        .innerJoin(teachers, eq(teachers.id, teacherPayments.teacher_id))
        .where(
            and(
                gte(teacherPayments.date, startDate),
                lte(teacherPayments.date, endDate)
            )
        )
        .orderBy(desc(teacherPayments.date), teachers.name);

    // Get all classes for teachers involved
    const teacherIds = [...new Set(paymentsData.map((p) => p.teacherId))];
    const classesData = teacherIds.length > 0
        ? await db
            .select({
                teacherId: classes.teacher_id,
                classId: classes.id,
                className: classes.name,
                grade: classes.grade,
            })
            .from(classes)
            .where(inArray(classes.teacher_id, teacherIds))
        : [];

    // Map teacher to their classes
    const teacherClassesMap = new Map<string, Array<{
        classId: string;
        className: string;
        grade: string;
    }>>();
    for (const c of classesData) {
        const tid = c.teacherId ?? '';
        if (!tid) continue;
        if (!teacherClassesMap.has(tid)) {
            teacherClassesMap.set(tid, []);
        }
        teacherClassesMap.get(tid)!.push({
            classId: c.classId,
            className: c.className ?? 'Unassigned',
            grade: c.grade ?? '',
        });
    }

    // Get student counts for each class
    const allClassIds = [...new Set(classesData.map((c) => c.classId))];
    const enrollmentCounts = allClassIds.length > 0
        ? await db
            .select({
                classId: enrollments.class_id,
                count: sql<number>`COUNT(*)`,
            })
            .from(enrollments)
            .where(
                and(
                    inArray(enrollments.class_id, allClassIds),
                    eq(enrollments.is_active, true),
                    isNull(enrollments.deleted_at)
                )
            )
            .groupBy(enrollments.class_id)
        : [];

    const countMap = new Map(enrollmentCounts.map((e) => [e.classId, e.count]));

    // Group by teacher and create payment records with class details
    const teacherMap = new Map<string, TeacherPaymentGroup>();

    for (const payment of paymentsData) {
        if (!teacherMap.has(payment.teacherId)) {
            teacherMap.set(payment.teacherId, {
                teacherId: payment.teacherId,
                teacherName: payment.teacherName,
                totalPaid: 0,
                classes: [],
            });
        }

        const group = teacherMap.get(payment.teacherId)!;
        group.totalPaid += Number(payment.amount);

        // Get classes for this teacher
        const teacherClasses = teacherClassesMap.get(payment.teacherId) || [];

        // Add class details for this payment
        for (const classInfo of teacherClasses) {
            const studentCount = countMap.get(classInfo.classId) ?? 0;

            group.classes.push({
                className: classInfo.className,
                grade: classInfo.grade,
                studentCount,
                amount: Number(payment.amount) / Math.max(teacherClasses.length, 1),
            });
        }
    }

    return Array.from(teacherMap.values());
}

/**
 * Get financial summary for a specific month
 */
export async function getFinancialSummary(
    year: number,
    month: number
): Promise<FinancialSummary> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const [incomeResult, expensesResult] = await Promise.all([
        // Total income from student monthly payments + admission fees
        db
            .select({
                total: sql<number>`COALESCE(SUM(${paymentItems.amount}), 0)`,
            })
            .from(paymentItems)
            .innerJoin(payments, eq(payments.id, paymentItems.payment_id))
            .where(
                and(
                    sql`${paymentItems.type} IN ('monthly', 'admission')`,
                    gte(payments.payment_date, startDate),
                    lte(payments.payment_date, endDate),
                    isNull(payments.deleted_at)
                )
            ),
        // Total expenses from teacher payments
        db
            .select({
                total: sql<number>`COALESCE(SUM(${teacherPayments.amount}), 0)`,
            })
            .from(teacherPayments)
            .where(
                and(
                    gte(teacherPayments.date, startDateStr),
                    lte(teacherPayments.date, endDateStr)
                )
            ),
    ]);

    const totalIncome = Number(incomeResult[0]?.total ?? 0);
    const totalExpenses = Number(expensesResult[0]?.total ?? 0);

    return {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
    };
}

// ============================================================================
// ATTENDANCE REPORT QUERIES
// ============================================================================

/**
 * Get attendance log for a specific month (by year/month)
 * Wrapper that converts year/month to date range
 */
export async function getAttendanceLogByMonth(
    year: number,
    month: number
): Promise<AttendanceLogSessionWithDate[]> {
    const startDate = formatDate(new Date(year, month, 1));
    const endDate = formatDate(new Date(year, month + 1, 0));
    return getAttendanceLogForMonth(startDate, endDate);
}

/**
 * Get attendance log grouped by session for a month
 * Reuses existing getAttendanceLogByDate logic for date range
 */
export async function getAttendanceLogForMonth(
    startDate: string,
    endDate: string
): Promise<AttendanceLogSessionWithDate[]> {
    const sessions = await db
        .select({
            sessionId: classSessions.id,
            classId: classSessions.class_id,
            className: classes.name,
            date: classSessions.date,
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
        .innerJoin(attendanceRecords, and(
            eq(attendanceRecords.session_id, classSessions.id),
            gte(attendanceRecords.date, startDate),
            lte(attendanceRecords.date, endDate)
        ))
        .innerJoin(students, eq(attendanceRecords.student_id, students.id))
        .where(
            and(
                gte(classSessions.date, startDate),
                lte(classSessions.date, endDate),
                sql`${attendanceRecords.status} IN ('present', 'late')`,
                isNull(classSessions.deleted_at)
            )
        )
        .orderBy(
            asc(classSessions.date),
            asc(classSessions.start_time),
            asc(attendanceRecords.scan_time)
        );

    // Group by session (same as existing logic in attendance.ts)
    const sessionMap = new Map<string, AttendanceLogSessionWithDate>();

    for (const record of sessions) {
        const key = record.sessionId;

        if (!sessionMap.has(key)) {
            // Format time (e.g., "08:00:00" -> "08:00 AM")
            const timeParts = record.startTime.split(':');
            const hour = parseInt(timeParts[0]);
            const minute = timeParts[1];
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const formattedTime =
                `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;

            sessionMap.set(key, {
                id: record.sessionId,
                className: record.className,
                date: record.date,
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
        const formattedScanTime =
            `${displayScanHour.toString().padStart(2, '0')}:${scanMinute} ${scanPeriod}`;

        session.students.push({
            id: record.attendanceId,
            name: record.studentName,
            studentId: record.studentNumericId,
            scanTime: formattedScanTime,
            avatarUrl: record.photoUrl,
        });
        session.totalPresent = session.students.length;
    }

    return Array.from(sessionMap.values());
}

/**
 * Get attendance summary for a specific month
 */
export async function getAttendanceSummary(
    year: number,
    month: number
): Promise<{
    classesHeld: number;
    totalEnrollments: number;
    avgAttendance: number;
}> {
    const startDate = formatDate(new Date(year, month, 1));
    const endDate = formatDate(new Date(year, month + 1, 0));

    // Get all sessions for the month
    const sessions = await db
        .select({
            sessionId: classSessions.id,
            attendanceCount: sql<number>`COUNT(DISTINCT ${attendanceRecords.id})`,
        })
        .from(classSessions)
        .leftJoin(attendanceRecords, and(
            eq(attendanceRecords.session_id, classSessions.id),
            sql`${attendanceRecords.status} IN ('present', 'late')`
        ))
        .where(
            and(
                gte(classSessions.date, startDate),
                lte(classSessions.date, endDate),
                isNull(classSessions.deleted_at)
            )
        )
        .groupBy(classSessions.id);

    // Count unique classes that had sessions
    const classesData = await db
        .select({
            classId: classSessions.class_id,
        })
        .from(classSessions)
        .where(
            and(
                gte(classSessions.date, startDate),
                lte(classSessions.date, endDate),
                isNull(classSessions.deleted_at)
            )
        )
        .groupBy(classSessions.class_id);

    const classesHeld = classesData.length;

    // Get total active enrollments across these classes
    const classIds = classesData.map((c) => c.classId);
    let totalEnrollments = 0;
    if (classIds.length > 0) {
        const enrollmentResult = await db
            .select({
                count: sql<number>`COUNT(*)`,
            })
            .from(enrollments)
            .where(
                and(
                    inArray(enrollments.class_id, classIds),
                    eq(enrollments.is_active, true),
                    isNull(enrollments.deleted_at)
                )
            );
        totalEnrollments = enrollmentResult[0]?.count ?? 0;
    }

    // Calculate average attendance percentage
    let totalAttendance = 0;
    let totalPossible = 0;
    for (const session of sessions) {
        totalAttendance += session.attendanceCount;
        // We can't easily get max possible per session without querying each class's enrollment
        // So we'll use the total attendance count divided by sessions held
    }
    totalPossible = sessions.length * totalEnrollments / Math.max(classesHeld, 1);

    const avgAttendance = totalPossible > 0
        ? Math.round((totalAttendance / totalPossible) * 100)
        : 0;

    return {
        classesHeld,
        totalEnrollments,
        avgAttendance,
    };
}

// ============================================================================
// ACTIVITY REPORT QUERIES
// ============================================================================

/**
 * Get activity log for a specific month (by year/month)
 * Wrapper that converts year/month to date range
 */
export async function getActivityLogByMonth(
    year: number,
    month: number
): Promise<ActivitySession[]> {
    const startDate = formatDate(new Date(year, month, 1));
    const endDate = formatDate(new Date(year, month + 1, 0));
    return getActivityLogForMonth(startDate, endDate);
}

/**
 * Get activity summary for a specific month (by year/month)
 * Wrapper that converts year/month to date range
 */
export async function getActivitySummaryByMonth(
    year: number,
    month: number
): Promise<ActivitySummary> {
    const startDate = formatDate(new Date(year, month, 1));
    const endDate = formatDate(new Date(year, month + 1, 0));
    return getActivitySummary(startDate, endDate);
}

/**
 * Get activity log (class sessions with attendance) for a month
 */
export async function getActivityLogForMonth(
    startDate: string,
    endDate: string
): Promise<ActivitySession[]> {
    const sessions = await db
        .select({
            sessionId: classSessions.id,
            className: classes.name,
            grade: classes.grade,
            teacherName: teachers.name,
            date: classSessions.date,
            startTime: classSessions.start_time,
            status: classSessions.status,
            attendanceCount: sql<number>`COUNT(DISTINCT ${attendanceRecords.id})`,
            totalEnrolled: sql<number>`(
                SELECT COUNT(*)
                FROM ${enrollments}
                WHERE ${enrollments.class_id} = ${classSessions.class_id}
                  AND ${enrollments.is_active} = true
                  AND ${enrollments.deleted_at} IS NULL
            )`,
        })
        .from(classSessions)
        .innerJoin(classes, eq(classSessions.class_id, classes.id))
        .leftJoin(teachers, eq(teachers.id, classes.teacher_id))
        .leftJoin(attendanceRecords, and(
            eq(attendanceRecords.session_id, classSessions.id),
            sql`${attendanceRecords.status} IN ('present', 'late')`
        ))
        .where(
            and(
                gte(classSessions.date, startDate),
                lte(classSessions.date, endDate),
                isNull(classSessions.deleted_at)
            )
        )
        .groupBy(classSessions.id, classes.id, teachers.id)
        .orderBy(
            asc(classes.grade),
            asc(classes.name),
            asc(classSessions.date),
            asc(classSessions.start_time)
        );

    // Format time helper
    const formatTime = (timeStr: string | null) => {
        if (!timeStr) return '--:--';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return sessions.map((s) => ({
        id: s.sessionId,
        className: s.className,
        grade: s.grade,
        teacherName: s.teacherName,
        date: s.date,
        time: formatTime(s.startTime),
        status: s.status as 'scheduled' | 'cancelled' | 'extra',
        attendanceCount: s.attendanceCount,
        totalEnrolled: s.totalEnrolled,
    }));
}

/**
 * Get activity summary for a month
 */
export async function getActivitySummary(
    startDate: string,
    endDate: string
): Promise<ActivitySummary> {
    const result = await db
        .select({
            totalScheduled: sql<number>`COUNT(*)`,
            completed: sql<number>`COUNT(*) FILTER (WHERE ${classSessions.status} = 'scheduled')`,
            cancelled: sql<number>`COUNT(*) FILTER (WHERE ${classSessions.status} = 'cancelled')`,
            extra: sql<number>`COUNT(*) FILTER (WHERE ${classSessions.status} = 'extra')`,
        })
        .from(classSessions)
        .where(
            and(
                gte(classSessions.date, startDate),
                lte(classSessions.date, endDate),
                isNull(classSessions.deleted_at)
            )
        );

    return {
        totalScheduled: result[0]?.totalScheduled ?? 0,
        completed: result[0]?.completed ?? 0,
        cancelled: result[0]?.cancelled ?? 0,
        extra: result[0]?.extra ?? 0,
    };
}

// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

/**
 * Get audit logs with filters
 * Follows same pattern as getStudentPaymentsForMonth
 */
export async function getAuditLogs(filters: {
    action?: AuditAction | 'ALL';
    module?: AuditModule | 'ALL';
    limit?: number;
    offset?: number;
}): Promise<AuditLogRecord[]> {
    const { action, limit = 100, offset = 0 } = filters;

    const conditions = [];
    if (action && action !== 'ALL') {
        conditions.push(eq(auditLogs.action, action));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
        .select({
            id: auditLogs.id,
            action: auditLogs.action,
            details: auditLogs.details,
            createdAt: auditLogs.created_at,
            userId: auditLogs.user_id,
            userName: profiles.full_name,
            userRole: profiles.role,
            userAvatar: profiles.avatar_url,
        })
        .from(auditLogs)
        .innerJoin(profiles, eq(profiles.id, auditLogs.user_id))
        .where(whereClause)
        .orderBy(desc(auditLogs.created_at))
        .limit(limit)
        .offset(offset);

    return results.map((r) => {
        const details = r.details as {
            module?: string;
            context?: string;
            details?: string;
            ipAddress?: string;
        } | null;

        return {
            id: r.id,
            timestamp: (r.createdAt ?? new Date()).toISOString(),
            user: {
                id: r.userId ?? '',
                name: r.userName ?? 'Unknown User',
                role: r.userRole ?? 'staff',
                avatar: r.userAvatar,
            },
            action: (r.action ?? 'UPDATE') as AuditAction,
            module: (details?.module ?? 'System') as AuditModule,
            context: details?.context ?? '',
            details: details?.details ?? '',
            ipAddress: details?.ipAddress,
        };
    });
}

/**
 * Get audit logs for a specific month
 * Follows same pattern as getAttendanceLogByMonth
 */
export async function getAuditLogsByMonth(
    year: number,
    month: number
): Promise<AuditLogRecord[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const results = await db
        .select({
            id: auditLogs.id,
            action: auditLogs.action,
            details: auditLogs.details,
            createdAt: auditLogs.created_at,
            userId: auditLogs.user_id,
            userName: profiles.full_name,
            userRole: profiles.role,
            userAvatar: profiles.avatar_url,
        })
        .from(auditLogs)
        .innerJoin(profiles, eq(profiles.id, auditLogs.user_id))
        .where(
            and(
                gte(auditLogs.created_at, startDate),
                lte(auditLogs.created_at, endDate)
            )
        )
        .orderBy(desc(auditLogs.created_at));

    return results.map((r) => {
        const details = r.details as {
            module?: string;
            context?: string;
            details?: string;
            ipAddress?: string;
        } | null;

        return {
            id: r.id,
            timestamp: (r.createdAt ?? new Date()).toISOString(),
            user: {
                id: r.userId ?? '',
                name: r.userName ?? 'Unknown User',
                role: r.userRole ?? 'staff',
                avatar: r.userAvatar,
            },
            action: (r.action ?? 'UPDATE') as AuditAction,
            module: (details?.module ?? 'System') as AuditModule,
            context: details?.context ?? '',
            details: details?.details ?? '',
            ipAddress: details?.ipAddress,
        };
    });
}

/**
 * Get audit log summary
 * Follows same pattern as getFinancialSummary
 */
export async function getAuditSummary(): Promise<AuditSummary> {
    const results = await db
        .select({
            action: auditLogs.action,
            count: sql<number>`COUNT(*)`,
        })
        .from(auditLogs)
        .groupBy(auditLogs.action);

    const byAction = {
        CREATE: 0,
        UPDATE: 0,
        DELETE: 0,
        LOGIN: 0,
        EXPORT: 0,
    };

    results.forEach((r) => {
        const action = (r.action ?? 'UPDATE') as AuditAction;
        if (action in byAction) {
            byAction[action] = r.count;
        }
    });

    return {
        totalLogs: results.reduce((sum, r) => sum + r.count, 0),
        byAction,
        byModule: {
            Students: 0,
            Finance: 0,
            Classes: 0,
            Staff: 0,
            Settings: 0,
            System: 0,
        },
    };
}
