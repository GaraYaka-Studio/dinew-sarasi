'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db';
import { classes, students, subjects, teacherPayments, teachers } from '@/db/schema';

export async function addTeacher(
    subjects: string[],
    _prevState: any,
    formData: FormData
) {
    const fullName = formData.get('fullName')?.toString();
    const displayName = formData.get('displayName')?.toString();
    const nic = formData.get('nic')?.toString();
    const phone = formData.get('phone')?.toString();

    if (!fullName || !displayName || !nic || !phone)
        return {
            success: false,
            status: 422,
            error: 'All fields are required',
        };

    if (subjects.length === 0)
        return {
            success: false,
            status: 422,
            error: 'At least one subject is needed',
        };

    try {
        await db.insert(teachers).values({
            name: fullName,
            display_name: displayName,
            nic: nic,
            phone: phone,
            subjects: subjects,
        });

        return { success: true, status: 201, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

export async function recordTeacherPayment(
    teacher_id: string,
    _prevState: any,
    formData: FormData
) {
    const amount = formData.get('amount')?.toString();
    const date = formData.get('date')?.toString();
    const notes = formData.get('notes')?.toString();

    if (!amount || !date)
        return {
            success: false,
            status: 422,
            error: 'All fields are required',
        };

    try {
        await db.insert(teacherPayments).values({
            teacher_id: teacher_id,
            amount: amount,
            date: date,
            notes: notes,
        });

        return { success: true, status: 201, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

export async function addSubject(
    grades: string[],
    code: string,
    _prevState: any,
    formData: FormData
) {
    const subjectName = formData.get('subjectName')?.toString();
    const section = formData.get('section')?.toString();

    if (!subjectName || !section || !code || grades.length === 0)
        return {
            success: false,
            status: 422,
            error: 'All fields are required',
        };

    try {
        await db.insert(subjects).values({
            name: subjectName,
            grades: grades,
            code: code,
            category: section,
        });

        return { success: true, status: 201, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

export async function addStudent(
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
        // Generate student ID and QR code
        const year = new Date().getFullYear();
        const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
        const qrCode = `QR-SRS-${year}-${randomNum}`;

        // Extract batch year from display string (e.g., "2026 O/L" → 2026, "Scholarship" → 0)
        const batchYearValue = parseInt(academicInfo.batch) || 0;

        await db.insert(students).values({
            full_name: personalInfo.fullName,
            initials: personalInfo.fullName.split(' ').map(n => n[0]).join(''),
            phone: personalInfo.phone,
            dob: personalInfo.dob,
            gender: personalInfo.gender,
            address: personalInfo.address,
            school: personalInfo.school,
            guardian_name: personalInfo.guardianName,
            guardian_phone: personalInfo.guardianPhone,
            guardian_relationship: personalInfo.relationship,
            is_emergency_contact: true,
            batch_year: batchYearValue,
            current_grade: academicInfo.grade,
            admission_status: 'pending',
            qr_code: qrCode,
            status: 'active',
        });

        return { success: true, status: 201, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

export async function addClass(
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
        await db.insert(classes).values({
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
            is_active: true,
        });

        return { success: true, status: 201, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}
