'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { students } from '@/db/schema';

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
                gender: personalInfo.gender,
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
