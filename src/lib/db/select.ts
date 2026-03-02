'use server';

import { db } from '@/db';
import { classes, enrollments, students, subjects, teacherPayments, teachers } from '@/db/schema';
import { Student, Subject, Teacher } from '@/types/schema.types';
import { eq, isNull, and, sql } from 'drizzle-orm';

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
