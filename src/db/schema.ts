import { sql } from 'drizzle-orm';
import {
    boolean,
    date,
    decimal,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    serial,
    text,
    time,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

export const gender = pgEnum('gender', [
    'male',
    'female',
]);

export const userRole = pgEnum('user_role', [
    'admin',
    'staff',
    'teacher'
]);

export const studentStatus = pgEnum('student_status', [
    'active',
    'inactive',
    'graduated',
    'suspended',
]);

export const classMedium = pgEnum('class_medium', [
    'sinhala',
    'english',
    'tamil',
]);

export const classType = pgEnum('class_type', [
    'theory',
    'revision',
    'paper',
]);

export const dayOfWeek = pgEnum('day_of_week', [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
]);

export const paymentMethod = pgEnum('payment_method', [
    'cash',
    'card',
    'bank_transfer'
]);

export const feeType = pgEnum('fee_type', [
    'monthly',
    'admission',
    'exam',
    'material',
]);

export const paymentStatus = pgEnum('payment_status', [
    'paid',
    'pending',
    'partial',
    'overdue',
    'free',
]);

export const admissionStatus = pgEnum('admission_status', [
    'pending',
    'paid',
    'free',
]);

export const attendanceStatus = pgEnum('attendance_status', [
    'present',
    'absent',
    'late',
    'excused',
]);

export const sessionStatus = pgEnum('session_status', [
    'scheduled',
    'cancelled',
    'extra',
]);

export const profiles = pgTable('profiles', {
    id: uuid().defaultRandom().primaryKey(),
    email: text().unique().notNull(),
    full_name: text().notNull(),
    role: userRole().default('staff'),
    avatar_url: text(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
});

export const academicYears = pgTable('academic_years', {
    id: serial().primaryKey(),
    name: varchar({ length: 20 }).notNull(),
    is_active: boolean().default(false),
    start_date: date(),
    end_date: date(),
});

export const subjects = pgTable(
    'subjects',
    {
        id: uuid().defaultRandom().primaryKey(),
        name: varchar({ length: 100 }).notNull(),
        grades: text().array().notNull().default([]),
        code: varchar({ length: 20 }).notNull(),
        category: varchar({ length: 50 }),
        is_active: boolean().default(true),
        deleted_at: timestamp(),
    },
    (tb) => [
        uniqueIndex()
            .on(tb.code)
            .where(sql`${tb.is_active} = true`),
    ]
);

export const teachers = pgTable('teachers', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    display_name: varchar({ length: 255 }),
    nic: varchar({ length: 20 }).unique(),
    phone: varchar({ length: 20 }),
    subjects: text().array(),
    total_earned: decimal({ precision: 12, scale: 2 }).default('0'),
    amount_paid: decimal({ precision: 12, scale: 2 }).default('0'),
    status: varchar({ length: 20 }).default('active'),
    deleted_at: timestamp(),
    created_at: timestamp().defaultNow(),
});

export const classes = pgTable('classes', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    grade: varchar({ length: 20 }).notNull(),
    medium: classMedium().default('sinhala'),
    type: classType().default('theory'),
    subject_id: uuid().references(() => subjects.id),
    teacher_id: uuid().references(() => teachers.id),
    academic_year_id: integer().references(() => academicYears.id),
    day: dayOfWeek(),
    start_time: time(),
    end_time: time(),
    hall_name: varchar({ length: 50 }),
    monthly_fee: decimal({ precision: 10, scale: 2 }).notNull().default('0'),
    is_active: boolean().default(true),
    deleted_at: timestamp(),
});

export const classSessions = pgTable('class_sessions', {
    id: uuid().defaultRandom().primaryKey(),
    class_id: uuid().notNull().references(() => classes.id, { onDelete: 'cascade' }),
    date: date().notNull(),
    start_time: time().notNull(),
    end_time: time().notNull(),
    status: sessionStatus().default('scheduled'),
    hall_name: varchar({ length: 50 }),
    notes: text(),
    created_by: uuid().references(() => profiles.id),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
    deleted_at: timestamp(),
}, (tb) => [
    index('idx_session_class_date').on(tb.class_id, tb.date),
    index('idx_session_date').on(tb.date),
    index('idx_session_status').on(tb.status),
]);

export const students = pgTable('students', {
    id: uuid().defaultRandom().primaryKey(),
    student_id: serial(),
    full_name: text().notNull(),
    initials: varchar({ length: 20 }),
    dob: date(),
    gender: gender().notNull(),
    address: text(),
    phone: varchar({ length: 20 }).notNull(),
    school: varchar({ length: 150 }),
    guardian_name: text(),
    guardian_phone: text(),
    guardian_relationship: varchar({ length: 50 }),
    is_emergency_contact: boolean(),
    batch_year: integer(),
    current_grade: varchar({ length: 20 }),
    status: studentStatus().default('active'),
    admission_status: admissionStatus().default('pending'),
    admission_fee: decimal({ precision: 10, scale: 2 }),
    qr_code: text(),
    photo_url: text(),
    sync_id: uuid(),
    deleted_at: timestamp(),
    last_modified_at: timestamp().defaultNow(),
    created_at: timestamp().defaultNow(),
}, (tb) => [
    index('idx_students_qr').on(tb.qr_code),
    index('idx_students_phone').on(tb.phone),
]);

export const enrollments = pgTable('enrollments', {
    id: uuid().defaultRandom().primaryKey(),
    student_id: uuid().references(() => students.id),
    class_id: uuid().references(() => classes.id),
    enrolled_at: date().defaultNow(),
    is_active: boolean().default(true),
    deleted_at: timestamp(),
}, (tb) => [
    uniqueIndex('idx_unique_enrollment').on(tb.student_id, tb.class_id),
]);

export const teacherPayments = pgTable('teacher_payments', {
    id: uuid().defaultRandom().primaryKey(),
    teacher_id: uuid().references(() => teachers.id),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    date: date().defaultNow(),
    notes: text(),
});

export const studentFees = pgTable('student_fees', {
    id: uuid().defaultRandom().primaryKey(),
    student_id: uuid().references(() => students.id),
    class_id: uuid().references(() => classes.id),
    year: integer().notNull(),
    month_index: integer().notNull(),
    fee_amount: decimal({ precision: 10, scale: 2 }).notNull(),
    paid_amount: decimal({ precision: 10, scale: 2 }).default('0'),
    status: paymentStatus().default('pending'),
    due_date: date(),
    sync_id: uuid(),
    updated_at: timestamp().defaultNow(),
    deleted_at: timestamp(),
}, (tb) => [
    uniqueIndex().on(tb.student_id, tb.class_id, tb.year, tb.month_index),
    index('idx_fee_status_lookup').on(tb.class_id, tb.year, tb.month_index, tb.status),
]);

export const payments = pgTable('payments', {
    id: uuid().defaultRandom().primaryKey(),
    receipt_number: serial(),
    student_id: uuid().references(() => students.id),
    total_amount: decimal({ precision: 12, scale: 2 }).notNull(),
    method: paymentMethod().default('cash'),
    recorded_by: uuid().references(() => profiles.id),
    payment_date: timestamp().defaultNow(),
    sync_id: uuid(),
    deleted_at: timestamp(),
    created_at: timestamp().defaultNow(),
});

export const paymentItems = pgTable('payment_items', {
    id: uuid().defaultRandom().primaryKey(),
    payment_id: uuid().references(() => payments.id),
    type: feeType().notNull(),
    class_id: uuid().references(() => classes.id),
    month_index: integer(),
    year: integer(),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
});

export const attendanceRecords = pgTable('attendance_records', {
    id: uuid().defaultRandom().primaryKey(),
    student_id: uuid().notNull().references(() => students.id),
    class_id: uuid().notNull().references(() => classes.id),
    session_id: uuid().references(() => classSessions.id, { onDelete: 'restrict' }),
    date: date().notNull(),
    scan_time: time().defaultNow(),
    status: attendanceStatus().default('present'),
    marked_by: uuid().references(() => profiles.id),
    sync_id: uuid(),
    created_at: timestamp().defaultNow(),
}, (tb) => [
    uniqueIndex('attendance_records_class_date_unique').on(tb.student_id, tb.class_id, tb.date),
    index('idx_daily_attendance_report').on(tb.date, tb.class_id),
    index('idx_session_attendance').on(tb.session_id),
]);

export const auditLogs = pgTable('audit_log', {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid().references(() => profiles.id),
    action: text(),
    details: jsonb(),
    created_at: timestamp().defaultNow(),
});

export const smsLogs = pgTable('sms_logs', {
    id: uuid().defaultRandom().primaryKey(),
    recipient_phone: varchar({ length: 20 }),
    message: text(),
    status: varchar({ length: 20 }),
    sent_at: timestamp().defaultNow(),
})
