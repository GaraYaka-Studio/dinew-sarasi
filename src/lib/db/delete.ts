'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';

import { teachers } from '@/db/schema';
import { Teacher } from '@/types/schema.types';

export async function deleteTeacher(teacher: Teacher) {
    await db.delete(teachers).where(eq(teachers.id, teacher.id));
}
