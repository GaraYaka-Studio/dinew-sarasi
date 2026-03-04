import { pgTable, uniqueIndex, index, foreignKey, uuid, date, time, timestamp, unique, varchar, text, numeric, serial, boolean, jsonb, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const admissionStatus = pgEnum("admission_status", ['pending', 'paid', 'free'])
export const attendanceStatus = pgEnum("attendance_status", ['present', 'absent', 'late', 'excused'])
export const classMedium = pgEnum("class_medium", ['sinhala', 'english', 'tamil'])
export const classType = pgEnum("class_type", ['theory', 'revision', 'paper'])
export const dayOfWeek = pgEnum("day_of_week", ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
export const feeType = pgEnum("fee_type", ['monthly', 'admission', 'exam', 'material'])
export const gender = pgEnum("gender", ['male', 'female'])
export const paymentMethod = pgEnum("payment_method", ['cash', 'card', 'bank_transfer'])
export const paymentStatus = pgEnum("payment_status", ['paid', 'pending', 'partial', 'overdue', 'free'])
export const studentStatus = pgEnum("student_status", ['active', 'inactive', 'graduated', 'suspended'])
export const userRole = pgEnum("user_role", ['admin', 'staff', 'teacher'])
export const sessionStatus = pgEnum("session_status", ['scheduled', 'cancelled', 'extra'])


export const attendanceRecords = pgTable("attendance_records", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: uuid("student_id").notNull(),
	classId: uuid("class_id").notNull(),
	sessionId: uuid("session_id").references(() => classSessions.id, { onDelete: 'restrict' }),
	date: date().notNull(),
	scanTime: time("scan_time").defaultNow(),
	status: attendanceStatus().default('present'),
	markedBy: uuid("marked_by"),
	syncId: uuid("sync_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("attendance_records_student_id_session_id_date_index").using("btree", table.studentId, table.sessionId, table.date),
	index("idx_daily_attendance_report").using("btree", table.date, table.classId),
	index("idx_session_attendance").on(table.sessionId),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "attendance_records_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "attendance_records_class_id_classes_id_fk"
		}),
	foreignKey({
			columns: [table.markedBy],
			foreignColumns: [profiles.id],
			name: "attendance_records_marked_by_profiles_id_fk"
		}),
]);

export const teachers = pgTable("teachers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	displayName: varchar("display_name", { length: 255 }),
	nic: varchar({ length: 20 }),
	phone: varchar({ length: 20 }),
	subjects: text().array(),
	totalEarned: numeric("total_earned", { precision: 12, scale:  2 }).default('0'),
	amountPaid: numeric("amount_paid", { precision: 12, scale:  2 }).default('0'),
	status: varchar({ length: 20 }).default('active'),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("teachers_nic_unique").on(table.nic),
]);

export const academicYears = pgTable("academic_years", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 20 }).notNull(),
	isActive: boolean("is_active").default(false),
	startDate: date("start_date"),
	endDate: date("end_date"),
});

export const subjects = pgTable("subjects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	grades: text().array().default([""]).notNull(),
	code: varchar({ length: 20 }).notNull(),
	category: varchar({ length: 50 }),
	isActive: boolean("is_active").default(true),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	uniqueIndex().using("btree", table.code.asc().nullsLast().op("text_ops")).where(sql`(is_active = true)`),
]);

export const auditLog = pgTable("audit_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	action: text(),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "audit_log_user_id_profiles_id_fk"
		}),
]);

export const smsLogs = pgTable("sms_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	recipientPhone: varchar("recipient_phone", { length: 20 }),
	message: text(),
	status: varchar({ length: 20 }),
	sentAt: timestamp("sent_at", { mode: 'string' }).defaultNow(),
});

export const classes = pgTable("classes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	grade: varchar({ length: 20 }).notNull(),
	medium: classMedium().default('sinhala'),
	type: classType().default('theory'),
	subjectId: uuid("subject_id"),
	teacherId: uuid("teacher_id"),
	academicYearId: integer("academic_year_id"),
	day: dayOfWeek(),
	startTime: time("start_time"),
	endTime: time("end_time"),
	hallName: varchar("hall_name", { length: 50 }),
	monthlyFee: numeric("monthly_fee", { precision: 10, scale:  2 }).default('0').notNull(),
	isActive: boolean("is_active").default(true),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.subjectId],
			foreignColumns: [subjects.id],
			name: "classes_subject_id_subjects_id_fk"
		}),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.id],
			name: "classes_teacher_id_teachers_id_fk"
		}),
	foreignKey({
			columns: [table.academicYearId],
			foreignColumns: [academicYears.id],
			name: "classes_academic_year_id_academic_years_id_fk"
		}),
]);

export const classSessions = pgTable("class_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	classId: uuid("class_id").notNull().references(() => classes.id, { onDelete: 'cascade' }),
	date: date().notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	status: sessionStatus().default('scheduled'),
	hallName: varchar("hall_name", { length: 50 }),
	notes: text(),
	createdBy: uuid("created_by").references(() => profiles.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index("idx_session_class_date").on(table.classId, table.date),
	index("idx_session_date").on(table.date),
	index("idx_session_status").on(table.status),
]);

export const enrollments = pgTable("enrollments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: uuid("student_id"),
	classId: uuid("class_id"),
	enrolledAt: date("enrolled_at").defaultNow(),
	isActive: boolean("is_active").default(true),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	uniqueIndex("idx_unique_enrollment").using("btree", table.studentId.asc().nullsLast().op("uuid_ops"), table.classId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "enrollments_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "enrollments_class_id_classes_id_fk"
		}),
]);

export const students = pgTable("students", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: serial("student_id").notNull(),
	fullName: text("full_name").notNull(),
	initials: varchar({ length: 20 }),
	dob: date(),
	gender: gender().notNull(),
	address: text(),
	phone: varchar({ length: 20 }).notNull(),
	school: varchar({ length: 150 }),
	guardianName: text("guardian_name"),
	guardianPhone: text("guardian_phone"),
	guardianRelationship: varchar("guardian_relationship", { length: 50 }),
	isEmergencyContact: boolean("is_emergency_contact"),
	batchYear: integer("batch_year"),
	currentGrade: varchar("current_grade", { length: 20 }),
	status: studentStatus().default('active'),
	admissionStatus: admissionStatus("admission_status").default('pending'),
	admissionFee: numeric("admission_fee", { precision: 10, scale:  2 }),
	qrCode: text("qr_code"),
	photoUrl: text("photo_url"),
	syncId: uuid("sync_id"),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_students_phone").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	index("idx_students_qr").using("btree", table.qrCode.asc().nullsLast().op("text_ops")),
]);

export const profiles = pgTable("profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	fullName: text("full_name").notNull(),
	role: userRole().default('staff'),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("profiles_email_unique").on(table.email),
]);

export const payments = pgTable("payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	receiptNumber: serial("receipt_number").notNull(),
	studentId: uuid("student_id"),
	totalAmount: numeric("total_amount", { precision: 12, scale:  2 }).notNull(),
	method: paymentMethod().default('cash'),
	recordedBy: uuid("recorded_by"),
	paymentDate: timestamp("payment_date", { mode: 'string' }).defaultNow(),
	syncId: uuid("sync_id"),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "payments_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.recordedBy],
			foreignColumns: [profiles.id],
			name: "payments_recorded_by_profiles_id_fk"
		}),
]);

export const paymentItems = pgTable("payment_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	paymentId: uuid("payment_id"),
	type: feeType().notNull(),
	classId: uuid("class_id"),
	monthIndex: integer("month_index"),
	year: integer(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.paymentId],
			foreignColumns: [payments.id],
			name: "payment_items_payment_id_payments_id_fk"
		}),
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "payment_items_class_id_classes_id_fk"
		}),
]);

export const studentFees = pgTable("student_fees", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: uuid("student_id"),
	classId: uuid("class_id"),
	year: integer().notNull(),
	monthIndex: integer("month_index").notNull(),
	feeAmount: numeric("fee_amount", { precision: 10, scale:  2 }).notNull(),
	paidAmount: numeric("paid_amount", { precision: 10, scale:  2 }).default('0'),
	status: paymentStatus().default('pending'),
	dueDate: date("due_date"),
	syncId: uuid("sync_id"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index("idx_fee_status_lookup").using("btree", table.classId.asc().nullsLast().op("int4_ops"), table.year.asc().nullsLast().op("enum_ops"), table.monthIndex.asc().nullsLast().op("int4_ops"), table.status.asc().nullsLast().op("enum_ops")),
	uniqueIndex().using("btree", table.studentId.asc().nullsLast().op("int4_ops"), table.classId.asc().nullsLast().op("uuid_ops"), table.year.asc().nullsLast().op("uuid_ops"), table.monthIndex.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "student_fees_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "student_fees_class_id_classes_id_fk"
		}),
]);

export const teacherPayments = pgTable("teacher_payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	teacherId: uuid("teacher_id"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	date: date().defaultNow(),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.id],
			name: "teacher_payments_teacher_id_teachers_id_fk"
		}),
]);
