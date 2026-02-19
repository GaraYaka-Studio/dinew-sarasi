'use server';

import { db } from "@/db";
import { classes, teacherPayments, teachers } from "@/db/schema";
import { Teacher } from "@/types/schema.types";
import { eq } from "drizzle-orm";

export async function getTeachers() {
    return await db.select().from(teachers);
}

export async function getTeacherClasses(teacher: Teacher) {
    return await db.select()
        .from(classes)
        .where(eq(classes.teacher_id, teacher.id));
}

export async function getTeacherPayments(teacher: Teacher) {
    return await db.select()
        .from(teacherPayments)
        .where(eq(teacherPayments.teacher_id, teacher.id));
}

export async function getClasses() {
    return await db.select().from(classes);
}
