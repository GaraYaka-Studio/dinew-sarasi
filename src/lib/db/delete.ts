'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';

import { subjects, teachers } from '@/db/schema';
import { Subject, Teacher } from '@/types/schema.types';

export async function deleteTeacher(teacher: Teacher) {
    await db.delete(teachers).where(eq(teachers.id, teacher.id));
}

export async function deleteSubject(subject: Subject) {
    await db.delete(subjects).where(eq(subjects.id, subject.id));
}
