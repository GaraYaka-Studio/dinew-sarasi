import { relations } from "drizzle-orm/relations";
import { students, attendanceRecords, classes, profiles, auditLog, subjects, teachers, academicYears, enrollments, payments, paymentItems, studentFees, teacherPayments, classSessions } from "./schema";

export const classSessionsRelations = relations(classSessions, ({ one, many }) => ({
	class: one(classes, {
		fields: [classSessions.classId],
		references: [classes.id]
	}),
	createdBy: one(profiles, {
		fields: [classSessions.createdBy],
		references: [profiles.id]
	}),
	attendanceRecords: many(attendanceRecords),
}));

export const attendanceRecordsRelations = relations(attendanceRecords, ({one}) => ({
	student: one(students, {
		fields: [attendanceRecords.studentId],
		references: [students.id]
	}),
	class: one(classes, {
		fields: [attendanceRecords.classId],
		references: [classes.id]
	}),
	session: one(classSessions, {
		fields: [attendanceRecords.sessionId],
		references: [classSessions.id]
	}),
	profile: one(profiles, {
		fields: [attendanceRecords.markedBy],
		references: [profiles.id]
	}),
}));

export const studentsRelations = relations(students, ({many}) => ({
	attendanceRecords: many(attendanceRecords),
	enrollments: many(enrollments),
	payments: many(payments),
	studentFees: many(studentFees),
}));

export const classesRelations = relations(classes, ({one, many}) => ({
	attendanceRecords: many(attendanceRecords),
	sessions: many(classSessions),
	subject: one(subjects, {
		fields: [classes.subjectId],
		references: [subjects.id]
	}),
	teacher: one(teachers, {
		fields: [classes.teacherId],
		references: [teachers.id]
	}),
	academicYear: one(academicYears, {
		fields: [classes.academicYearId],
		references: [academicYears.id]
	}),
	enrollments: many(enrollments),
	paymentItems: many(paymentItems),
	studentFees: many(studentFees),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	attendanceRecords: many(attendanceRecords),
	createdSessions: many(classSessions),
	auditLogs: many(auditLog),
	payments: many(payments),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	profile: one(profiles, {
		fields: [auditLog.userId],
		references: [profiles.id]
	}),
}));

export const subjectsRelations = relations(subjects, ({many}) => ({
	classes: many(classes),
}));

export const teachersRelations = relations(teachers, ({many}) => ({
	classes: many(classes),
	teacherPayments: many(teacherPayments),
}));

export const academicYearsRelations = relations(academicYears, ({many}) => ({
	classes: many(classes),
}));

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	student: one(students, {
		fields: [enrollments.studentId],
		references: [students.id]
	}),
	class: one(classes, {
		fields: [enrollments.classId],
		references: [classes.id]
	}),
}));

export const paymentsRelations = relations(payments, ({one, many}) => ({
	student: one(students, {
		fields: [payments.studentId],
		references: [students.id]
	}),
	profile: one(profiles, {
		fields: [payments.recordedBy],
		references: [profiles.id]
	}),
	paymentItems: many(paymentItems),
}));

export const paymentItemsRelations = relations(paymentItems, ({one}) => ({
	payment: one(payments, {
		fields: [paymentItems.paymentId],
		references: [payments.id]
	}),
	class: one(classes, {
		fields: [paymentItems.classId],
		references: [classes.id]
	}),
}));

export const studentFeesRelations = relations(studentFees, ({one}) => ({
	student: one(students, {
		fields: [studentFees.studentId],
		references: [students.id]
	}),
	class: one(classes, {
		fields: [studentFees.classId],
		references: [classes.id]
	}),
}));

export const teacherPaymentsRelations = relations(teacherPayments, ({one}) => ({
	teacher: one(teachers, {
		fields: [teacherPayments.teacherId],
		references: [teachers.id]
	}),
}));