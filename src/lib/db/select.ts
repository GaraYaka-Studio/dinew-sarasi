'use server';

import { db } from '@/db';
import { classes, enrollments, studentFees, students, subjects, teacherPayments, teachers } from '@/db/schema';
import { Student, Subject, Teacher } from '@/types/schema.types';
import { eq, isNull, and, sql, or, ilike, like, gte, lte } from 'drizzle-orm';

export async function getStudents() {
    return await db.select().from(students).where(isNull(students.deleted_at));
}

export async function getTeachers() {
    return await db.select().from(teachers);
}

export async function getTeacherClasses(teacher: Teacher) {
    return await db
        .select()
        .from(classes)
        .where(eq(classes.teacher_id, teacher.id));
}

export async function getTeacherPayments(teacher: Teacher) {
    return await db
        .select()
        .from(teacherPayments)
        .where(eq(teacherPayments.teacher_id, teacher.id));
}

export async function getClasses() {
    return await db.select().from(classes);
}

export async function getSubjects() {
    return await db.select().from(subjects);
}

export async function getSubjectTeachers(subject: Subject) {
    return await db.query.teachers.findMany({
        where: (teachers, { sql }) =>
            sql`${subject.name} = ANY(${teachers.subjects})`,
    });
}

export async function getClassesWithDetails() {
    const result = await db
        .select({
            // Class fields
            id: classes.id,
            name: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            day: classes.day,
            startTime: classes.start_time,
            endTime: classes.end_time,
            hallName: classes.hall_name,
            monthlyFee: classes.monthly_fee,
            isActive: classes.is_active,
            // Related fields
            subjectId: subjects.id,
            subjectName: subjects.name,
            subjectCategory: subjects.category,
            teacherId: teachers.id,
            teacherName: teachers.name,
            teacherPhone: teachers.phone,
        })
        .from(classes)
        .leftJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(isNull(classes.deleted_at));

    return result;
}

export async function getClassStudentCount(classId: string) {
    const result = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(enrollments)
        .where(
            and(
                eq(enrollments.class_id, classId),
                eq(enrollments.is_active, true),
                isNull(enrollments.deleted_at)
            )
        );
    return result[0]?.count || 0;
}

/**
 * Get active classes for a specific grade
 * Returns classes with subject, teacher, and schedule info
 */
export async function getClassesByGrade(grade: string) {
    const result = await db
        .select({
            id: classes.id,
            name: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            monthlyFee: classes.monthly_fee,
            day: classes.day,
            startTime: classes.start_time,
            endTime: classes.end_time,
            hallName: classes.hall_name,
            // Related data
            subjectId: subjects.id,
            subjectName: subjects.name,
            subjectCategory: subjects.category,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(classes)
        .innerJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                eq(classes.grade, grade),
                eq(classes.is_active, true),
                isNull(classes.deleted_at)
            )
        );

    return result;
}

/**
 * Get classes that a student is enrolled in
 * Returns enrollments with class, subject, and teacher details
 */
export async function getStudentEnrollments(studentId: string) {
    const result = await db
        .select({
            enrollmentId: enrollments.id,
            enrolledAt: enrollments.enrolled_at,
            isActive: enrollments.is_active,
            // Class details
            classId: classes.id,
            className: classes.name,
            grade: classes.grade,
            medium: classes.medium,
            type: classes.type,
            monthlyFee: classes.monthly_fee,
            day: classes.day,
            startTime: classes.start_time,
            endTime: classes.end_time,
            hallName: classes.hall_name,
            // Related data
            subjectId: subjects.id,
            subjectName: subjects.name,
            subjectCategory: subjects.category,
            teacherId: teachers.id,
            teacherName: teachers.name,
        })
        .from(enrollments)
        .innerJoin(classes, eq(enrollments.class_id, classes.id))
        .innerJoin(subjects, eq(classes.subject_id, subjects.id))
        .leftJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                eq(enrollments.student_id, studentId),
                isNull(enrollments.deleted_at),
                isNull(classes.deleted_at)
            )
        );

    return result;
}

/**
 * Search students by name, phone, student_id, or qr_code
 * Returns up to 10 matching results
 */
export async function searchStudents(query: string) {
    if (!query || query.length < 2) return [];

    const searchTerm = `${query}%`;

    const result = await db
        .select({
            id: students.id,
            studentId: students.student_id,
            fullName: students.full_name,
            initials: students.initials,
            phone: students.phone,
            grade: students.current_grade,
            batchYear: students.batch_year,
            status: students.status,
            admissionStatus: students.admission_status,
            admissionFee: students.admission_fee,
            dob: students.dob,
            gender: students.gender,
            address: students.address,
            school: students.school,
            guardianName: students.guardian_name,
            guardianPhone: students.guardian_phone,
            guardianRelationship: students.guardian_relationship,
            qrCode: students.qr_code,
            lastModifiedAt: students.last_modified_at,
            createdAt: students.created_at,
        })
        .from(students)
        .where(
            and(
                isNull(students.deleted_at),
                or(
                    ilike(students.full_name, searchTerm),
                    ilike(students.phone, searchTerm),
                    // Use sql template to cast student_id to text for like comparison
                    sql`${students.student_id}::text LIKE ${searchTerm}`,
                    eq(students.qr_code, query)
                )
            )
        )
        .limit(10);

    return result;
}

/**
 * Get fee structure for a student including all enrolled classes
 * and their payment status for each month
 */
export async function getStudentFeeStructure(studentId: string) {
    // Get current year and determine month range (last 3 months + next 6 months)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const startMonth = Math.max(0, currentMonth - 3);
    const endMonth = Math.min(11, currentMonth + 6);

    // Get student's enrolled classes with details
    const enrolledClasses = await db
        .select({
            classId: classes.id,
            className: classes.name,
            grade: classes.grade,
            monthlyFee: classes.monthly_fee,
            subjectName: subjects.name,
            teacherName: teachers.name,
            enrolledAt: enrollments.enrolled_at,
        })
        .from(enrollments)
        .innerJoin(classes, eq(enrollments.class_id, classes.id))
        .innerJoin(subjects, eq(classes.subject_id, subjects.id))
        .innerJoin(teachers, eq(classes.teacher_id, teachers.id))
        .where(
            and(
                eq(enrollments.student_id, studentId),
                eq(enrollments.is_active, true),
                isNull(enrollments.deleted_at),
                isNull(classes.deleted_at)
            )
        );

    // Get existing fee records for these classes
    const classIds = enrolledClasses.map((c) => c.classId);

    const existingFees = classIds.length > 0 ? await db
        .select({
            classId: studentFees.class_id,
            year: studentFees.year,
            monthIndex: studentFees.month_index,
            feeAmount: studentFees.fee_amount,
            paidAmount: studentFees.paid_amount,
            status: studentFees.status,
        })
        .from(studentFees)
        .where(
            and(
                eq(studentFees.student_id, studentId),
                // Only fetch fees for current year within our range
                eq(studentFees.year, currentYear),
                gte(studentFees.month_index, startMonth),
                lte(studentFees.month_index, endMonth),
                isNull(studentFees.deleted_at)
            )
        ) : [];

    // Month labels
    const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                          'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    // Transform into fee structure format
    return enrolledClasses.map((cls) => {
        const classFees = existingFees.filter(
            (f) => f.classId === cls.classId
        );

        const months = [];
        for (let i = startMonth; i <= endMonth; i++) {
            const existingFee = classFees.find((f) => f.monthIndex === i);
            const feeAmount = Number(cls.monthlyFee);

            const status = existingFee
                ? (existingFee.status === 'paid' ? 'paid' as const :
                   existingFee.status === 'partial' ? 'partial' as const : 'unpaid' as const)
                : 'unpaid' as const;

            months.push({
                month: MONTH_LABELS[i],
                year: currentYear,
                monthIndex: i,
                status,
                amount: feeAmount,
                paidAmount: existingFee ? Number(existingFee.paidAmount) : 0,
            });
        }

        return {
            classId: cls.classId,
            className: cls.className,
            monthlyFee: Number(cls.monthlyFee),
            months,
        };
    });
}
