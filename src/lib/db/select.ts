'use server';

import { db } from '@/db';
import { classes, students, subjects, teacherPayments, teachers } from '@/db/schema';
import { Student, Subject, Teacher } from '@/types/schema.types';
import { eq, isNull } from 'drizzle-orm';

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
