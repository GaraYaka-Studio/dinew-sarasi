import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

import {
    academicYears,
    attendanceRecords,
    auditLogs,
    classes,
    enrollments,
    paymentItems,
    payments,
    profiles,
    smsLogs,
    studentFees,
    students,
    subjects,
    teachers,
} from '@/db/schema';

export type Profile = InferSelectModel<typeof profiles>;
export type AcademicYear = InferSelectModel<typeof academicYears>;
export type Subject = InferSelectModel<typeof subjects>;
export type Teacher = InferSelectModel<typeof teachers>;
export type Class = InferSelectModel<typeof classes>;
export type Student = InferSelectModel<typeof students>;
export type Enrollment = InferSelectModel<typeof enrollments>;
export type Fee = InferSelectModel<typeof studentFees>;
export type Payment = InferSelectModel<typeof payments>;
export type PaymentItem = InferSelectModel<typeof paymentItems>; 
export type AttendanceRecord = InferSelectModel <typeof attendanceRecords>;
export type AuditLog = InferSelectModel <typeof auditLogs>;
export type SmsLog = InferSelectModel <typeof smsLogs>;

export type NewProfile = InferInsertModel<typeof profiles>;
export type NewAcademicYear = InferInsertModel<typeof academicYears>;
export type NewSubject = InferInsertModel<typeof subjects>;
export type NewTeacher = InferInsertModel<typeof teachers>;
export type NewClass = InferInsertModel<typeof classes>;
export type NewStudent = InferInsertModel<typeof students>;
export type NewEnrollment = InferInsertModel<typeof enrollments>;
export type NewFee = InferInsertModel<typeof studentFees>;
export type NewPayment = InferInsertModel<typeof payments>;
export type NewPaymentItem = InferInsertModel<typeof paymentItems>; 
export type NewAttendanceRecord = InferInsertModel <typeof attendanceRecords>;
export type NewAuditLog = InferInsertModel <typeof auditLogs>;
export type NewSmsLog = InferInsertModel <typeof smsLogs>;
