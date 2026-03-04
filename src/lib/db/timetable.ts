'use server';

import { db } from '@/db';
import { classes, classSessions, subjects, teachers } from '@/db/schema';
import { eq, and, isNull, inArray, gte, lte, sql, ne } from 'drizzle-orm';

/**
 * Get session details with class, subject, and teacher information
 */
export async function getSessionById(sessionId: string) {
    const result = await db
        .select({
            // Session fields
            id: classSessions.id,
            date: classSessions.date,
            startTime: classSessions.start_time,
            endTime: classSessions.end_time,
            status: classSessions.status,
            hallName: classSessions.hall_name,
            notes: classSessions.notes,
            // Class fields
            classId: classes.id,
            className: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            // Related fields
            subjectId: subjects.id,
            subjectName: subjects.name,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(classSessions)
        .innerJoin(classes, eq(classSessions.class_id, classes.id))
        .leftJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                eq(classSessions.id, sessionId),
                isNull(classSessions.deleted_at)
            )
        )
        .limit(1);

    return result[0] || null;
}

/**
 * Get all sessions for a specific week
 * Automatically creates missing sessions from active class schedules
 */
export async function getSessionsForWeek(startDate: Date) {
    // Calculate week dates (Monday to Sunday)
    const weekDates = getWeekDates(startDate);

    // 1. Fetch existing sessions for the week
    const existingSessions = await db
        .select({
            // Session fields
            id: classSessions.id,
            classId: classSessions.class_id,
            date: classSessions.date,
            startTime: classSessions.start_time,
            endTime: classSessions.end_time,
            status: classSessions.status,
            hallName: classSessions.hall_name,
            notes: classSessions.notes,
            // Class fields
            className: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            // Related fields
            subjectId: subjects.id,
            subjectName: subjects.name,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(classSessions)
        .innerJoin(classes, eq(classSessions.class_id, classes.id))
        .leftJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                inArray(classSessions.date, weekDates.map(d => formatDate(d))),
                isNull(classSessions.deleted_at)
            )
        );

    // 2. Build a set of existing (classId, date) combinations
    const existingKeys = new Set(
        existingSessions.map(s => `${s.classId}-${s.date}`)
    );

    // 3. Get active classes with schedules
    const activeClasses = await db
        .select({
            id: classes.id,
            day: classes.day,
            startTime: classes.start_time,
            endTime: classes.end_time,
            hallName: classes.hall_name,
        })
        .from(classes)
        .where(
            and(
                eq(classes.is_active, true),
                isNull(classes.deleted_at),
                sql`${classes.day} IS NOT NULL`
            )
        );

    // 4. Create missing sessions
    const sessionsToCreate: Array<{
        id: string;
        class_id: string;
        date: string;
        start_time: string;
        end_time: string;
        status: 'scheduled';
        hall_name: string | null;
    }> = [];

    for (const cls of activeClasses) {
        for (const date of weekDates) {
            // Check if this class is scheduled for this day of week
            const dayOfWeek = getDayOfWeek(date);
            if (cls.day !== dayOfWeek) continue;

            const dateStr = formatDate(date);
            const key = `${cls.id}-${dateStr}`;

            // Skip if already exists
            if (existingKeys.has(key)) continue;

            // Add to create list
            sessionsToCreate.push({
                id: crypto.randomUUID(),
                class_id: cls.id,
                date: dateStr,
                start_time: cls.startTime || '08:00',
                end_time: cls.endTime || '10:00',
                status: 'scheduled',
                hall_name: cls.hallName || null,
            });
        }
    }

    // 5. Bulk insert missing sessions (if any)
    if (sessionsToCreate.length > 0) {
        try {
            await db.insert(classSessions).values(sessionsToCreate);
        } catch (error) {
            // Log error but continue - may be due to concurrent requests
            console.error('Error creating sessions:', error);
        }
    }

    // 6. Fetch all sessions again (including newly created) with full details
    const allSessions = await db
        .select({
            // Session fields
            id: classSessions.id,
            classId: classSessions.class_id,
            date: classSessions.date,
            startTime: classSessions.start_time,
            endTime: classSessions.end_time,
            status: classSessions.status,
            hallName: classSessions.hall_name,
            notes: classSessions.notes,
            // Class fields
            className: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            // Related fields
            subjectId: subjects.id,
            subjectName: subjects.name,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(classSessions)
        .innerJoin(classes, eq(classSessions.class_id, classes.id))
        .leftJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                inArray(classSessions.date, weekDates.map(d => formatDate(d))),
                isNull(classSessions.deleted_at)
            )
        )
        .orderBy(classSessions.date, classSessions.start_time);

    return allSessions;
}

/**
 * Get active classes for creating extra sessions
 */
export async function getActiveClassesForSession() {
    const result = await db
        .select({
            id: classes.id,
            name: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            // Related fields
            subjectId: subjects.id,
            subjectName: subjects.name,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(classes)
        .innerJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                eq(classes.is_active, true),
                isNull(classes.deleted_at)
            )
        )
        .orderBy(classes.grade, subjects.name);

    return result;
}

/**
 * Check for scheduling conflicts
 * Returns conflicting sessions for the given date/time
 */
export async function checkConflicts(data: {
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    hallName?: string;
    excludeSessionId?: string;
}) {
    const { classId, date, startTime, endTime, hallName, excludeSessionId } = data;

    // Get class details to check grade conflicts
    const classInfo = await db
        .select({
            grade: classes.grade,
        })
        .from(classes)
        .where(eq(classes.id, classId))
        .limit(1);

    const grade = classInfo[0]?.grade;

    // Find overlapping sessions on the same date
    const conflicts = await db
        .select({
            id: classSessions.id,
            startTime: classSessions.start_time,
            endTime: classSessions.end_time,
            hallName: classSessions.hall_name,
            className: classes.name,
            grade: classes.grade,
        })
        .from(classSessions)
        .innerJoin(classes, eq(classSessions.class_id, classes.id))
        .where(
            and(
                eq(classSessions.date, date),
                isNull(classSessions.deleted_at),
                excludeSessionId ? ne(classSessions.id, excludeSessionId) : sql`1=1`,
                ne(classSessions.status, 'cancelled')
            )
        );

    // Check for time overlaps and conflicts
    const conflictingSessions = conflicts.filter(session => {
        // Parse times for comparison
        const startMins = parseTimeToMinutes(startTime);
        const endMins = parseTimeToMinutes(endTime);
        const sessionStartMins = parseTimeToMinutes(session.startTime);
        const sessionEndMins = parseTimeToMinutes(session.endTime);

        // Check for time overlap
        const isTimeOverlap = startMins < sessionEndMins && endMins > sessionStartMins;

        if (!isTimeOverlap) return false;

        // Check for conflicts (same grade or same hall)
        const isGradeConflict = grade === session.grade;
        const isHallConflict = hallName && hallName === session.hallName;

        return isGradeConflict || isHallConflict;
    });

    return conflictingSessions;
}

// Helper functions

function getWeekDates(startDate: Date): Date[] {
    const date = new Date(startDate);
    const day = date.getDay();

    // Calculate Monday of the week
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        dates.push(nextDay);
    }

    return dates;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
}

function parseTimeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}
