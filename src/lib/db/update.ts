'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { classes, classSessions, students } from '@/db/schema';
import { getCurrentSriLankaTimestamp } from '@/lib/utils/time';

export async function updateStudent(
    studentId: string,
    personalInfo: {
        fullName: string;
        phone: string;
        guardianName: string;
        guardianPhone: string;
        relationship: string;
        school: string;
        dob: string;
        address: string;
        gender: string;
    },
    academicInfo: { grade: string; batch: string },
    _prevState: any,
    formData: FormData
) {
    // Validation
    if (!personalInfo.fullName || !personalInfo.phone) {
        return { success: false, status: 422, error: 'Name and phone are required' };
    }

    if (!personalInfo.guardianName || !personalInfo.guardianPhone) {
        return { success: false, status: 422, error: 'Guardian information is required' };
    }

    if (!academicInfo.grade || !academicInfo.batch) {
        return { success: false, status: 422, error: 'Grade and batch are required' };
    }

    try {
        // Extract batch year from display string
        const batchYearValue = parseInt(academicInfo.batch) || 0;

        await db
            .update(students)
            .set({
                full_name: personalInfo.fullName,
                initials: personalInfo.fullName.split(' ').map((n) => n[0]).join(''),
                phone: personalInfo.phone,
                dob: personalInfo.dob,
                gender: personalInfo.gender as 'male' | 'female',
                address: personalInfo.address,
                school: personalInfo.school,
                guardian_name: personalInfo.guardianName,
                guardian_phone: personalInfo.guardianPhone,
                guardian_relationship: personalInfo.relationship,
                batch_year: batchYearValue,
                current_grade: academicInfo.grade,
            })
            .where(eq(students.id, studentId));

        return { success: true, status: 200, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

export async function updateClass(
    classId: string,
    classData: {
        name: string;
        grade: string;
        medium: string;
        type: string;
        subjectId: string;
        teacherId: string;
        day: string | null;
        startTime: string | null;
        endTime: string | null;
        hallName: string | null;
        monthlyFee: string;
        isActive: boolean;
    },
    _prevState: any,
    formData: FormData
) {
    // Validation
    if (!classData.name || !classData.grade) {
        return {
            success: false,
            status: 422,
            error: 'Class name and grade are required',
        };
    }

    if (!classData.subjectId) {
        return {
            success: false,
            status: 422,
            error: 'Subject is required',
        };
    }

    if (!classData.teacherId) {
        return {
            success: false,
            status: 422,
            error: 'Teacher is required',
        };
    }

    if (!classData.monthlyFee) {
        return {
            success: false,
            status: 422,
            error: 'Monthly fee is required',
        };
    }

    try {
        await db
            .update(classes)
            .set({
                name: classData.name,
                grade: classData.grade,
                medium: classData.medium as any,
                type: classData.type as any,
                subject_id: classData.subjectId,
                teacher_id: classData.teacherId,
                day: classData.day as any,
                start_time: classData.startTime,
                end_time: classData.endTime,
                hall_name: classData.hallName,
                monthly_fee: classData.monthlyFee,
                is_active: classData.isActive,
            })
            .where(eq(classes.id, classId));

        return { success: true, status: 200, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

/**
 * Update a class session (time, status, hall, notes)
 */
export async function updateSession(
    sessionId: string,
    _prevState: any,
    formData: FormData
) {
    const startTime = formData.get('startTime')?.toString();
    const endTime = formData.get('endTime')?.toString();
    const hallName = formData.get('hallName')?.toString();
    const status = formData.get('status')?.toString();
    const notes = formData.get('notes')?.toString();

    // Validation - at least one field should be provided
    if (!startTime && !endTime && !hallName && !status && !notes) {
        return {
            success: false,
            status: 422,
            error: 'At least one field must be provided',
        };
    }

    // If times are provided, both must be present
    if ((startTime && !endTime) || (!startTime && endTime)) {
        return {
            success: false,
            status: 422,
            error: 'Both start and end times are required',
        };
    }

    try {
        const updateData: any = {
            updated_at: getCurrentSriLankaTimestamp(),
        };

        if (startTime) updateData.start_time = startTime;
        if (endTime) updateData.end_time = endTime;
        if (hallName !== undefined) updateData.hall_name = hallName || null;
        if (status) updateData.status = status as 'scheduled' | 'cancelled' | 'extra';
        if (notes !== undefined) updateData.notes = notes || null;

        await db
            .update(classSessions)
            .set(updateData)
            .where(eq(classSessions.id, sessionId));

        return { success: true, status: 200, error: null };
    } catch (error) {
        console.error('Session update failed:', error);
        return { success: false, status: 500, error: error as string };
    }
}

/**
 * Cancel a session (set status to 'cancelled')
 */
export async function cancelSession(
    sessionId: string,
    _prevState: any,
    formData: FormData
) {
    try {
        await db
            .update(classSessions)
            .set({
                status: 'cancelled',
                updated_at: getCurrentSriLankaTimestamp(),
            })
            .where(eq(classSessions.id, sessionId));

        return { success: true, status: 200, error: null };
    } catch (error) {
        console.error('Session cancellation failed:', error);
        return { success: false, status: 500, error: error as string };
    }
}

/**
 * Delete a session (soft delete - set deleted_at)
 * Only for extra sessions, not recurring scheduled sessions
 */
export async function deleteSession(
    sessionId: string,
    _prevState: any,
    formData: FormData
) {
    try {
        await db
            .update(classSessions)
            .set({
                deleted_at: getCurrentSriLankaTimestamp(),
            })
            .where(eq(classSessions.id, sessionId));

        return { success: true, status: 200, error: null };
    } catch (error) {
        console.error('Session deletion failed:', error);
        return { success: false, status: 500, error: error as string };
    }
}
