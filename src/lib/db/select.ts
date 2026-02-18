'use server';

import { db } from "@/db";
import { classes, teachers } from "@/db/schema";

export async function getTeachers() {
    return await db.select().from(teachers);
}

export async function getClasses() {
    return await db.select().from(classes);
}
