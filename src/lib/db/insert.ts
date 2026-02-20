'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { teacherPayments, teachers } from "@/db/schema";

export async function addTeacher(subjects: string[], _prevState: any, formData: FormData) {
    const fullName = formData.get('fullName')?.toString();
    const displayName = formData.get('displayName')?.toString();
    const nic = formData.get('nic')?.toString();
    const phone = formData.get('phone')?.toString();

    if (!fullName || !displayName || !nic || !phone)
        return { success: false, status: 422, error: 'All fields are required' };

    if (subjects.length === 0)
        return { success: false, status: 422, error: 'At least one subject is needed' };

    try {
        await db.insert(teachers).values({
            name: fullName,
            display_name: displayName,
            nic: nic,
            phone: phone,
            subjects: subjects
        })

        revalidatePath('/dashboard/staff/teachers');
        return { success: true, status: 201, error: null };
    } catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}

export async function recordTeacherPayment(teacher_id: string, _prevState: any, formData: FormData) {
    const amount = formData.get('amount')?.toString();
    const date = formData.get('date')?.toString();
    const notes = formData.get('notes')?.toString();

    if (!amount || !date)
        return { success: false, status: 422, error: 'All fields are required' };

    try {
        await db.insert(teacherPayments)
        .values({
            teacher_id: teacher_id,
            amount: amount,
            date: date,
            notes: notes,
        });

        revalidatePath('/dashboard/staff/teachers');
        return { success: true, status: 201, error: null };
    }
    catch (error) {
        return { success: false, status: 500, error: error as string };
    }
}
