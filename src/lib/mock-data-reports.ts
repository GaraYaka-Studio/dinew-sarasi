// Report Types
export type ReportType = 'financial' | 'attendance' | 'activity';

// ============================================================================
// FINANCIAL STATEMENT
// ============================================================================

export interface FinancialRecord {
    id: string;
    date: string;
    description: string;
    category: 'Class Fee' | 'Teacher Payment' | 'Admission Fee' | 'Other';
    amount: number;
    type: 'income' | 'expense';
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
}

export const FINANCIAL_DATA: FinancialRecord[] = [
    {
        id: 'fin-1',
        date: '2025-02-01',
        description: 'Kamal Perera - Grade 10 Math',
        category: 'Class Fee',
        amount: 2500,
        type: 'income',
    },
    {
        id: 'fin-2',
        date: '2025-02-01',
        description: 'Nimal Silva - Grade 11 Science',
        category: 'Class Fee',
        amount: 3000,
        type: 'income',
    },
    {
        id: 'fin-3',
        date: '2025-02-02',
        description: 'Mr. Wijesinghe - Teacher Salary',
        category: 'Teacher Payment',
        amount: -15000,
        type: 'expense',
    },
    {
        id: 'fin-4',
        date: '2025-02-02',
        description: 'Sunil Fernando - Admission Fee',
        category: 'Admission Fee',
        amount: 5000,
        type: 'income',
    },
    {
        id: 'fin-5',
        date: '2025-02-03',
        description: 'Priya Jayawardena - Grade 10 Math',
        category: 'Class Fee',
        amount: 2500,
        type: 'income',
    },
    {
        id: 'fin-6',
        date: '2025-02-03',
        description: 'Mrs. Rathnayake - Teacher Salary',
        category: 'Teacher Payment',
        amount: -12000,
        type: 'expense',
    },
    {
        id: 'fin-7',
        date: '2025-02-04',
        description: 'Amaya Wickramasinghe - Grade 12 Physics',
        category: 'Class Fee',
        amount: 3500,
        type: 'income',
    },
    {
        id: 'fin-8',
        date: '2025-02-04',
        description: 'Ruwan Mendis - Grade 10 Math',
        category: 'Class Fee',
        amount: 2500,
        type: 'income',
    },
    {
        id: 'fin-9',
        date: '2025-02-05',
        description: 'Office Supplies - Stationery',
        category: 'Other',
        amount: -2500,
        type: 'expense',
    },
    {
        id: 'fin-10',
        date: '2025-02-05',
        description: 'Dilani Rathnayake - Grade 11 Science',
        category: 'Class Fee',
        amount: 3000,
        type: 'income',
    },
    {
        id: 'fin-11',
        date: '2025-02-06',
        description: 'Chaminda Kumara - Admission Fee',
        category: 'Admission Fee',
        amount: 5000,
        type: 'income',
    },
    {
        id: 'fin-12',
        date: '2025-02-06',
        description: 'Mr. Perera - Teacher Salary',
        category: 'Teacher Payment',
        amount: -18000,
        type: 'expense',
    },
    {
        id: 'fin-13',
        date: '2025-02-07',
        description: 'Sanduni Perera - Grade 12 Physics',
        category: 'Class Fee',
        amount: 3500,
        type: 'income',
    },
    {
        id: 'fin-14',
        date: '2025-02-07',
        description: 'Ashen Fernando - Grade 10 Math',
        category: 'Class Fee',
        amount: 2500,
        type: 'income',
    },
    {
        id: 'fin-15',
        date: '2025-02-08',
        description: 'Electricity Bill - February',
        category: 'Other',
        amount: -8000,
        type: 'expense',
    },
];

export const FINANCIAL_SUMMARY: FinancialSummary = {
    totalIncome: 32500,
    totalExpenses: 37500,
    netProfit: -5000,
};

// ============================================================================
// ATTENDANCE LOG
// ============================================================================

export interface AttendanceRecord {
    id: string;
    date: string;
    className: string;
    teacher: string;
    enrolled: number;
    present: number;
}

export interface AttendanceSummary {
    classesHeld: number;
    totalEnrollments: number;
    avgAttendance: number;
}

export const ATTENDANCE_DATA: AttendanceRecord[] = [
    {
        id: 'att-1',
        date: '2025-02-03',
        className: 'Grade 10 Mathematics',
        teacher: 'Mr. Wijesinghe',
        enrolled: 30,
        present: 28,
    },
    {
        id: 'att-2',
        date: '2025-02-03',
        className: 'Grade 11 Science',
        teacher: 'Mrs. Rathnayake',
        enrolled: 25,
        present: 22,
    },
    {
        id: 'att-3',
        date: '2025-02-03',
        className: 'Grade 12 Physics',
        teacher: 'Mr. Perera',
        enrolled: 20,
        present: 18,
    },
    {
        id: 'att-4',
        date: '2025-02-04',
        className: 'Grade 10 Mathematics',
        teacher: 'Mr. Wijesinghe',
        enrolled: 30,
        present: 25,
    },
    {
        id: 'att-5',
        date: '2025-02-04',
        className: 'Grade 11 Science',
        teacher: 'Mrs. Rathnayake',
        enrolled: 25,
        present: 24,
    },
    {
        id: 'att-6',
        date: '2025-02-05',
        className: 'Grade 12 Physics',
        teacher: 'Mr. Perera',
        enrolled: 20,
        present: 19,
    },
    {
        id: 'att-7',
        date: '2025-02-05',
        className: 'Grade 10 Mathematics',
        teacher: 'Mr. Wijesinghe',
        enrolled: 30,
        present: 27,
    },
    {
        id: 'att-8',
        date: '2025-02-06',
        className: 'Grade 11 Science',
        teacher: 'Mrs. Rathnayake',
        enrolled: 25,
        present: 23,
    },
    {
        id: 'att-9',
        date: '2025-02-06',
        className: 'Grade 12 Physics',
        teacher: 'Mr. Perera',
        enrolled: 20,
        present: 17,
    },
    {
        id: 'att-10',
        date: '2025-02-07',
        className: 'Grade 10 Mathematics',
        teacher: 'Mr. Wijesinghe',
        enrolled: 30,
        present: 29,
    },
];

export const ATTENDANCE_SUMMARY: AttendanceSummary = {
    classesHeld: 10,
    totalEnrollments: 255,
    avgAttendance: 87,
};

// ============================================================================
// ACTIVITY LOG (Class Schedule)
// ============================================================================

export type ActivityStatus = 'held' | 'cancelled' | 'extra';

export interface ActivityRecord {
    id: string;
    date: string;
    time: string;
    subject: string;
    grade: string;
    teacher: string;
    status: ActivityStatus;
}

export interface ActivitySummary {
    totalScheduled: number;
    completed: number;
    cancelled: number;
}

export const ACTIVITY_DATA: ActivityRecord[] = [
    {
        id: 'act-1',
        date: '2025-02-03',
        time: '08:00 AM',
        subject: 'Mathematics',
        grade: 'Grade 10',
        teacher: 'Mr. Wijesinghe',
        status: 'held',
    },
    {
        id: 'act-2',
        date: '2025-02-03',
        time: '10:00 AM',
        subject: 'Science',
        grade: 'Grade 11',
        teacher: 'Mrs. Rathnayake',
        status: 'held',
    },
    {
        id: 'act-3',
        date: '2025-02-03',
        time: '02:00 PM',
        subject: 'Physics',
        grade: 'Grade 12',
        teacher: 'Mr. Perera',
        status: 'cancelled',
    },
    {
        id: 'act-4',
        date: '2025-02-04',
        time: '08:00 AM',
        subject: 'Mathematics',
        grade: 'Grade 10',
        teacher: 'Mr. Wijesinghe',
        status: 'held',
    },
    {
        id: 'act-5',
        date: '2025-02-04',
        time: '10:00 AM',
        subject: 'Science',
        grade: 'Grade 11',
        teacher: 'Mrs. Rathnayake',
        status: 'held',
    },
    {
        id: 'act-6',
        date: '2025-02-04',
        time: '03:00 PM',
        subject: 'Physics',
        grade: 'Grade 12',
        teacher: 'Mr. Perera',
        status: 'extra',
    },
    {
        id: 'act-7',
        date: '2025-02-05',
        time: '08:00 AM',
        subject: 'Mathematics',
        grade: 'Grade 10',
        teacher: 'Mr. Wijesinghe',
        status: 'held',
    },
    {
        id: 'act-8',
        date: '2025-02-05',
        time: '10:00 AM',
        subject: 'Science',
        grade: 'Grade 11',
        teacher: 'Mrs. Rathnayake',
        status: 'held',
    },
    {
        id: 'act-9',
        date: '2025-02-06',
        time: '02:00 PM',
        subject: 'Physics',
        grade: 'Grade 12',
        teacher: 'Mr. Perera',
        status: 'cancelled',
    },
    {
        id: 'act-10',
        date: '2025-02-06',
        time: '04:00 PM',
        subject: 'Mathematics',
        grade: 'Grade 10',
        teacher: 'Mr. Wijesinghe',
        status: 'extra',
    },
    {
        id: 'act-11',
        date: '2025-02-07',
        time: '08:00 AM',
        subject: 'Science',
        grade: 'Grade 11',
        teacher: 'Mrs. Rathnayake',
        status: 'held',
    },
    {
        id: 'act-12',
        date: '2025-02-07',
        time: '10:00 AM',
        subject: 'Physics',
        grade: 'Grade 12',
        teacher: 'Mr. Perera',
        status: 'held',
    },
];

export const ACTIVITY_SUMMARY: ActivitySummary = {
    totalScheduled: 12,
    completed: 9,
    cancelled: 2,
};

// ============================================================================
// SUMMARY CARD TYPES
// ============================================================================

export interface SummaryCard {
    label: string;
    value: string;
    className: string;
}

export const getSummaryCards = (type: ReportType): SummaryCard[] => {
    switch (type) {
        case 'financial':
            return [
                {
                    label: 'Total Income',
                    value: `+ LKR ${FINANCIAL_SUMMARY.totalIncome.toLocaleString()}`,
                    className: 'border-green-200 bg-green-50/50',
                },
                {
                    label: 'Expenses',
                    value: `- LKR ${Math.abs(FINANCIAL_SUMMARY.totalExpenses).toLocaleString()}`,
                    className: 'border-red-200 bg-red-50/50',
                },
                {
                    label: 'Net Profit',
                    value: `LKR ${FINANCIAL_SUMMARY.netProfit.toLocaleString()}`,
                    className:
                        FINANCIAL_SUMMARY.netProfit >= 0
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-red-200 bg-red-50/50',
                },
            ];

        case 'attendance':
            return [
                {
                    label: 'Classes Held',
                    value: ATTENDANCE_SUMMARY.classesHeld.toString(),
                    className: 'border-gray-200 bg-gray-50/50',
                },
                {
                    label: 'Total Enrollments',
                    value: ATTENDANCE_SUMMARY.totalEnrollments.toString(),
                    className: 'border-gray-200 bg-gray-50/50',
                },
                {
                    label: 'Avg. Attendance',
                    value: `${ATTENDANCE_SUMMARY.avgAttendance}%`,
                    className:
                        ATTENDANCE_SUMMARY.avgAttendance >= 80
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-orange-200 bg-orange-50/50',
                },
            ];

        case 'activity':
            return [
                {
                    label: 'Total Scheduled',
                    value: ACTIVITY_SUMMARY.totalScheduled.toString(),
                    className: 'border-gray-200 bg-gray-50/50',
                },
                {
                    label: 'Completed',
                    value: ACTIVITY_SUMMARY.completed.toString(),
                    className: 'border-green-200 bg-green-50/50',
                },
                {
                    label: 'Cancelled',
                    value: ACTIVITY_SUMMARY.cancelled.toString(),
                    className: 'border-red-200 bg-red-50/50',
                },
            ];

        default:
            return [];
    }
};
