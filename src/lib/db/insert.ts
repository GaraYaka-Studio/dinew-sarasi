'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db';
import { classes, paymentItems, payments, studentFees, students, subjects, teacherPayments, teachers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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
            gender: personalInfo.gender as 'male' | 'female',
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

/**
 * Payment item for recording a payment
 */
export interface PaymentCartItem {
    type: 'monthly' | 'admission';
    classId?: string;
    monthIndex?: number;
    year?: number;
    amount: number;
}

/**
 * Record a payment with items and update fee records
 * Creates payment record, payment items, and updates student_fees table
 */
export async function recordPayment(
    studentId: string,
    cartItems: PaymentCartItem[],
    totalAmount: number,
    method: 'cash' | 'card' | 'bank_transfer',
    recordedBy: string | null,
    _prevState: any,
    formData: FormData
) {
    // Validation
    if (!studentId) {
        return { success: false, status: 422, error: 'Student is required' };
    }
    if (cartItems.length === 0) {
        return { success: false, status: 422, error: 'Cart is empty' };
    }
    if (totalAmount <= 0) {
        return { success: false, status: 422, error: 'Invalid amount' };
    }

    try {
        // 1. Create payment record (auto-generates receipt_number via serial)
        const paymentResult = await db
            .insert(payments)
            .values({
                student_id: studentId,
                total_amount: totalAmount.toString(),
                method: method,
                recorded_by: recordedBy,
            })
            .returning({ id: payments.id, receiptNumber: payments.receipt_number });

        const payment = paymentResult[0];

        // 2. Create payment items and update fee records
        for (const item of cartItems) {
            // Insert payment item
            await db.insert(paymentItems).values({
                payment_id: payment.id,
                type: item.type === 'admission' ? 'admission' : 'monthly',
                class_id: item.classId || null,
                month_index: item.monthIndex,
                year: item.year,
                amount: item.amount.toString(),
            });

            // Update or create fee record for monthly fees
            if (item.type === 'monthly' && item.classId && item.monthIndex !== undefined) {
                const currentYear = item.year || new Date().getFullYear();

                const existingFee = await db
                    .select()
                    .from(studentFees)
                    .where(
                        and(
                            eq(studentFees.student_id, studentId),
                            eq(studentFees.class_id, item.classId),
                            eq(studentFees.year, currentYear),
                            eq(studentFees.month_index, item.monthIndex)
                        )
                    );

                const currentPaid = existingFee[0]
                    ? Number(existingFee[0].paid_amount)
                    : 0;
                const newPaidAmount = currentPaid + item.amount;
                const feeAmount = existingFee[0]
                    ? Number(existingFee[0].fee_amount)
                    : item.amount;

                const newStatus = newPaidAmount >= feeAmount ? 'paid' :
                                  newPaidAmount > 0 ? 'partial' : 'pending';

                if (existingFee[0]) {
                    // Update existing fee record
                    await db
                        .update(studentFees)
                        .set({
                            paid_amount: newPaidAmount.toString(),
                            status: newStatus,
                            updated_at: new Date(),
                        })
                        .where(eq(studentFees.id, existingFee[0].id));
                } else {
                    // Insert new fee record
                    await db.insert(studentFees).values({
                        student_id: studentId,
                        class_id: item.classId,
                        year: currentYear,
                        month_index: item.monthIndex,
                        fee_amount: item.amount.toString(),
                        paid_amount: item.amount.toString(),
                        status: newStatus,
                    });
                }
            }

            // Update admission status if admission fee paid
            if (item.type === 'admission') {
                await db
                    .update(students)
                    .set({ admission_status: 'paid' })
                    .where(eq(students.id, studentId));
            }
        }

        return {
            success: true,
            status: 201,
            error: null,
            receiptNumber: payment.receiptNumber,
        };
    } catch (error) {
        console.error('Payment recording failed:', error);
        return { success: false, status: 500, error: error as string };
    }
}
