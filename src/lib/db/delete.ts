'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';

import { subjects, students, teachers } from '@/db/schema';
import { Student, Subject, Teacher } from '@/types/schema.types';

export async function deleteTeacher(teacher: Teacher) {
    await db.delete(teachers).where(eq(teachers.id, teacher.id));
}

export async function deleteSubject(subject: Subject) {
    await db.delete(subjects).where(eq(subjects.id, subject.id));
}

export async function deleteStudent(student: Student) {
    await db.update(students)
        .set({ deleted_at: new Date() })
        .where(eq(students.id, student.id));
}
