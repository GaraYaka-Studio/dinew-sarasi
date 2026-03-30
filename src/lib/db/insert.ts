'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db';
import {
    classes,
    classSessions,
    enrollments,
    paymentItems,
    payments,
    studentFees,
    students,
    subjects,
    teacherPayments,
    teachers,
} from '@/db/schema';
import { NewClass } from '@/types/schema.types';
import { eq, and, isNull, or } from 'drizzle-orm';
import { getCurrentSriLankaTimestamp } from '@/lib/utils/time';
import { revalidatePath } from 'next/cache';

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

/**
 * Payment data interface for student registration
 */
interface PaymentData {
    paymentMode: 'later' | 'now' | 'free';
    selectedMonths: Map<string, number[]>; // classId -> array of month indices
}

/**
 * Add a new student with optional class enrollments and payments
 * - Checks for duplicate by name + phone combination
 * - Creates enrollments for selected classes
 * - Processes admission fee if payment mode is 'now'
 * - Processes monthly fee payments if selected
 * - Returns the created student's data for success screen
 */
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
    enrollmentData: { classIds: string[] } | null,
    paymentData: PaymentData | null,
    _prevState: any,
    formData: FormData
) {
    // Validation: Required fields
    if (!personalInfo.fullName || !personalInfo.phone) {
        return {
            success: false,
            status: 422,
            error: 'Name and phone are required',
        };
    }

    if (!personalInfo.guardianName || !personalInfo.guardianPhone) {
        return {
            success: false,
            status: 422,
            error: 'Guardian information is required',
        };
    }

    if (!academicInfo.grade || !academicInfo.batch) {
        return {
            success: false,
            status: 422,
            error: 'Grade and batch are required',
        };
    }

    // Server-side validation: Phone format
    const phoneRegex = /^07[0-9]{8}$/;
    const cleanPhone = personalInfo.phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        return {
            success: false,
            status: 422,
            error: 'Invalid phone number format. Please use format: 07X-XXXXXXX',
        };
    }

    // Server-side validation: Guardian phone format
    const cleanGuardianPhone = personalInfo.guardianPhone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanGuardianPhone)) {
        return {
            success: false,
            status: 422,
            error: 'Invalid guardian phone number format. Please use format: 07X-XXXXXXX',
        };
    }

    // Check for duplicate student (same name + phone combination)
    try {
        const existingStudents = await db
            .select()
            .from(students)
            .where(
                and(
                    eq(students.full_name, personalInfo.fullName.trim()),
                    eq(students.phone, cleanPhone),
                    isNull(students.deleted_at)
                )
            );

        if (existingStudents.length > 0) {
            return {
                success: false,
                status: 409,
                error: `A student named "${personalInfo.fullName}" with phone number ${cleanPhone} already exists in the system.`,
            };
        }
    } catch (error) {
        console.error('Duplicate check failed:', error);
        // Continue anyway - let the database handle it
    }

    try {
        // Extract batch year from display string (e.g., "2026 O/L" → 2026, "Scholarship" → 0)
        const batchYearValue = parseInt(academicInfo.batch) || 0;

        // Generate QR code
        const year = new Date().getFullYear();
        const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(
            3,
            '0'
        );
        const qrCode = `QR-SRS-${year}-${randomNum}`;

        // Determine admission status based on payment mode
        let admissionStatus: 'pending' | 'paid' | 'free' = 'pending';
        if (paymentData?.paymentMode === 'now') {
            admissionStatus = 'paid';
        } else if (paymentData?.paymentMode === 'free') {
            admissionStatus = 'free';
        }

        // Insert student and return the created record
        const [newStudent] = await db
            .insert(students)
            .values({
                full_name: personalInfo.fullName.trim(),
                initials: personalInfo.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join(''),
                phone: cleanPhone,
                dob: personalInfo.dob,
                gender: personalInfo.gender as 'male' | 'female',
                address: personalInfo.address?.trim(),
                school: personalInfo.school?.trim(),
                guardian_name: personalInfo.guardianName.trim(),
                guardian_phone: cleanGuardianPhone,
                guardian_relationship: personalInfo.relationship,
                is_emergency_contact: true,
                batch_year: batchYearValue,
                current_grade: academicInfo.grade,
                admission_status: admissionStatus,
                admission_fee:
                    paymentData?.paymentMode === 'now' ? '1000' : null,
                qr_code: qrCode,
                status: 'active',
            })
            .returning();

        // Create enrollments if classes were selected
        if (enrollmentData?.classIds && enrollmentData.classIds.length > 0) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            const enrollmentValues = enrollmentData.classIds.map((classId) => ({
                student_id: newStudent.id,
                class_id: classId,
                enrolled_at: today,
                is_active: true,
            }));

            await db.insert(enrollments).values(enrollmentValues);

            // Process admission fee payment if payment mode is 'now'
            if (paymentData?.paymentMode === 'now') {
                const admissionFeeAmount = 1000;

                // Create payment record for admission fee
                const [admissionPayment] = await db
                    .insert(payments)
                    .values({
                        student_id: newStudent.id,
                        total_amount: admissionFeeAmount.toString(),
                        method: 'cash',
                        payment_date: getCurrentSriLankaTimestamp(),
                    })
                    .returning({
                        id: payments.id,
                        receiptNumber: payments.receipt_number,
                    });

                // Create payment item for admission fee
                await db.insert(paymentItems).values({
                    payment_id: admissionPayment.id,
                    type: 'admission',
                    class_id: null,
                    month_index: null,
                    year: null,
                    amount: admissionFeeAmount.toString(),
                });
            }

            // Process monthly fee payments if any were selected
            if (
                paymentData?.selectedMonths &&
                paymentData.selectedMonths.size > 0
            ) {
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth();

                // Collect all monthly payments
                const monthlyPaymentItems: Array<{
                    classId: string;
                    monthIndex: number;
                    amount: number;
                }> = [];

                for (const [
                    classId,
                    months,
                ] of paymentData.selectedMonths.entries()) {
                    // Get the class fee
                    const classData = await db
                        .select({ monthlyFee: classes.monthly_fee })
                        .from(classes)
                        .where(eq(classes.id, classId))
                        .limit(1);

                    if (classData.length > 0) {
                        const feeAmount = Number(classData[0].monthlyFee);

                        for (const monthIndex of months) {
                            if (monthIndex <= currentMonth) {
                                monthlyPaymentItems.push({
                                    classId,
                                    monthIndex,
                                    amount: feeAmount,
                                });

                                // Create or update fee record
                                const existingFee = await db
                                    .select()
                                    .from(studentFees)
                                    .where(
                                        and(
                                            eq(
                                                studentFees.student_id,
                                                newStudent.id
                                            ),
                                            eq(studentFees.class_id, classId),
                                            eq(studentFees.year, currentYear),
                                            eq(
                                                studentFees.month_index,
                                                monthIndex
                                            )
                                        )
                                    );

                                if (existingFee.length > 0) {
                                    // Update existing
                                    const newPaidAmount =
                                        Number(existingFee[0].paid_amount) +
                                        feeAmount;
                                    await db
                                        .update(studentFees)
                                        .set({
                                            paid_amount:
                                                newPaidAmount.toString(),
                                            status: 'paid',
                                            updated_at:
                                                getCurrentSriLankaTimestamp(),
                                        })
                                        .where(
                                            eq(
                                                studentFees.id,
                                                existingFee[0].id
                                            )
                                        );
                                } else {
                                    // Insert new
                                    await db.insert(studentFees).values({
                                        student_id: newStudent.id,
                                        class_id: classId,
                                        year: currentYear,
                                        month_index: monthIndex,
                                        fee_amount: feeAmount.toString(),
                                        paid_amount: feeAmount.toString(),
                                        status: 'paid',
                                    });
                                }
                            }
                        }
                    }
                }

                // If there are monthly payments, create a payment record
                if (monthlyPaymentItems.length > 0) {
                    const totalMonthlyAmount = monthlyPaymentItems.reduce(
                        (sum, item) => sum + item.amount,
                        0
                    );

                    const [payment] = await db
                        .insert(payments)
                        .values({
                            student_id: newStudent.id,
                            total_amount: totalMonthlyAmount.toString(),
                            method: 'cash', // Default to cash for registration
                            payment_date: getCurrentSriLankaTimestamp(),
                        })
                        .returning({
                            id: payments.id,
                            receiptNumber: payments.receipt_number,
                        });

                    // Create payment items
                    for (const item of monthlyPaymentItems) {
                        await db.insert(paymentItems).values({
                            payment_id: payment.id,
                            type: 'monthly',
                            class_id: item.classId,
                            month_index: item.monthIndex,
                            year: currentYear,
                            amount: item.amount.toString(),
                        });
                    }
                }
            }
        }

        // Revalidate the students page to refresh cache
        revalidatePath('/dashboard/students');

        return {
            success: true,
            status: 201,
            error: null,
            data: {
                studentId: newStudent.id,
                serialId: newStudent.student_id,
                qrCode: newStudent.qr_code,
            },
        };
    } catch (error) {
        console.error('Student creation failed:', error);
        return {
            success: false,
            status: 500,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to create student. Please try again.',
        };
    }
}

/**
 * Enroll an existing student in a class
 * Creates an enrollment record linking student to class
 */
export async function enrollStudent(
    studentId: string,
    _prevState: any,
    formData: FormData
) {
    const classId = formData.get('classId')?.toString();

    // Validation
    if (!studentId) {
        return { success: false, status: 422, error: 'Student ID is required' };
    }

    if (!classId) {
        return { success: false, status: 422, error: 'Class is required' };
    }

    try {
        // Check if enrollment already exists
        const existing = await db
            .select()
            .from(enrollments)
            .where(
                and(
                    eq(enrollments.student_id, studentId),
                    eq(enrollments.class_id, classId),
                    isNull(enrollments.deleted_at)
                )
            );

        if (existing.length > 0) {
            return {
                success: false,
                status: 409,
                error: 'Student is already enrolled in this class',
            };
        }

        // Create enrollment
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        await db.insert(enrollments).values({
            student_id: studentId,
            class_id: classId,
            enrolled_at: today,
            is_active: true,
        });

        // Revalidate cache
        revalidatePath('/dashboard/students');

        return { success: true, status: 201, error: null };
    } catch (error) {
        console.error('Enrollment failed:', error);
        return { success: false, status: 500, error: error as string };
    }
}

export async function addClass(_prevState: any, formData: FormData) {
    const name = formData.get('name')?.toString();
    const grade = formData.get('grade')?.toString();
    const medium = formData.get('medium') as any;
    const type = formData.get('type') as any;
    const subject_id = formData.get('subject')?.toString();
    const teacher_id = formData.get('teacher')?.toString();
    const monthly_fee = formData.get('fee')?.toString();
    const day = formData.get('day') as any;
    const start_time = formData.get('startTime')?.toString();
    const end_time = formData.get('endTime')?.toString();
    const hall_name = formData.get('hallName')?.toString();

    // Validation
    if (!name || !grade) {
        return {
            success: false,
            status: 422,
            error: 'Class name and grade are required',
        };
    }

    if (!subject_id) {
        return {
            success: false,
            status: 422,
            error: 'Subject is required',
        };
    }

    if (!teacher_id) {
        return {
            success: false,
            status: 422,
            error: 'Teacher is required',
        };
    }

    if (!monthly_fee) {
        return {
            success: false,
            status: 422,
            error: 'Monthly fee is required',
        };
    }

    const newClass: NewClass = {
        name,
        grade,
        medium,
        type,
        subject_id,
        teacher_id,
        monthly_fee,
        day,
        start_time,
        end_time,
        hall_name,
    };

    try {
        await db.insert(classes).values(newClass);

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

// Month labels for error messages
const MONTH_LABELS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
];

/**
 * Record a payment with items and update fee records
 * Creates payment record, payment items, and updates student_fees table
 * Validates that future months cannot be paid for
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

    // Validate: Cannot pay for future months
    const currentMonth = new Date().getMonth();
    for (const item of cartItems) {
        if (item.type === 'monthly' && item.monthIndex !== undefined) {
            if (item.monthIndex > currentMonth) {
                return {
                    success: false,
                    status: 400,
                    error: `Cannot pay for future months. ${MONTH_LABELS[item.monthIndex]} ${item.year || new Date().getFullYear()} is in the future. You can only pay up to the current month.`,
                };
            }
        }
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
                payment_date: getCurrentSriLankaTimestamp(),
            })
            .returning({
                id: payments.id,
                receiptNumber: payments.receipt_number,
            });

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
            if (
                item.type === 'monthly' &&
                item.classId &&
                item.monthIndex !== undefined
            ) {
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

                const newStatus =
                    newPaidAmount >= feeAmount
                        ? 'paid'
                        : newPaidAmount > 0
                          ? 'partial'
                          : 'pending';

                if (existingFee[0]) {
                    // Update existing fee record
                    await db
                        .update(studentFees)
                        .set({
                            paid_amount: newPaidAmount.toString(),
                            status: newStatus,
                            updated_at: getCurrentSriLankaTimestamp(),
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

        // Revalidate cache
        revalidatePath('/dashboard/students');

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

/**
 * Create an extra class session (one-time class)
 * Used for adding special revision classes, makeup classes, etc.
 */
export async function createSession(
    createdBy: string | null,
    _prevState: any,
    formData: FormData
) {
    const classId = formData.get('classId')?.toString();
    const date = formData.get('date')?.toString();
    const startTime = formData.get('startTime')?.toString();
    const endTime = formData.get('endTime')?.toString();
    const hallName = formData.get('hallName')?.toString();
    const notes = formData.get('notes')?.toString();

    // Validation
    if (!classId) {
        return { success: false, status: 422, error: 'Class is required' };
    }

    if (!date) {
        return { success: false, status: 422, error: 'Date is required' };
    }

    if (!startTime || !endTime) {
        return {
            success: false,
            status: 422,
            error: 'Start and end times are required',
        };
    }

    try {
        await db.insert(classSessions).values({
            class_id: classId,
            date: date,
            start_time: startTime,
            end_time: endTime,
            status: 'extra',
            hall_name: hallName || null,
            notes: notes || null,
            created_by: createdBy || null,
            created_at: getCurrentSriLankaTimestamp(),
        });

        return { success: true, status: 201, error: null };
    } catch (error) {
        console.error('Session creation failed:', error);
        return { success: false, status: 500, error: error as string };
    }
}
