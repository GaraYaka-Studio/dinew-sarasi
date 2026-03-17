// Report Types
export type ReportType = 'financial' | 'attendance' | 'activity';
export type TabType = 'income' | 'expenses';

// ============================================================================
// FINANCIAL STATEMENT TYPES
// ============================================================================

export interface StudentPaymentRecord {
    date: string; // YYYY-MM-DD
    receiptNumber: number;
    studentName: string;
    type: 'monthly' | 'admission'; // Payment type
    className: string;
    grade: string;
    amount: number; // in rupees
}

export interface TeacherPaymentRecord {
    date: string;
    teacherName: string;
    teacherId: string;
    className: string | null;
    grade: string | null;
    studentCount: number;
    amount: number;
    notes: string | null;
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
}

export interface TeacherPaymentGroup {
    teacherId: string;
    teacherName: string;
    totalPaid: number;
    classes: {
        className: string;
        grade: string;
        studentCount: number;
        amount: number;
    }[];
}

// ============================================================================
// ATTENDANCE LOG TYPES (reuses existing patterns)
// ============================================================================

export interface AttendanceLogStudent {
    id: string;
    name: string;
    studentId: number;
    scanTime: string;
    avatarUrl: string | null;
}

export interface AttendanceLogSessionWithDate {
    id: string;
    className: string;
    date: string; // Added for monthly view
    time: string;
    totalPresent: number;
    students: AttendanceLogStudent[];
}

export interface AttendanceSummary {
    classesHeld: number;
    totalEnrollments: number;
    avgAttendance: number;
}

// ============================================================================
// ACTIVITY LOG TYPES
// ============================================================================

export interface ActivitySession {
    id: string;
    className: string;
    grade: string;
    teacherName: string | null;
    date: string;
    time: string;
    status: 'scheduled' | 'cancelled' | 'extra';
    attendanceCount: number;
    totalEnrolled: number;
}

export interface ActivitySummary {
    totalScheduled: number;
    completed: number;
    cancelled: number;
    extra: number;
}
