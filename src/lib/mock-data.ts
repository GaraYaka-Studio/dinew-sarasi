// Mock Data for Executive Operational Dashboard

export interface DashboardStat {
    label: string;
    value: string;
    trend?: string;
    status?: 'neutral' | 'warning' | 'critical' | 'success';
}

export interface ScheduleItem {
    id: string;
    time: string;
    subject: string;
    grade: string;
    teacher: {
        name: string;
        avatar?: string;
        initials: string;
    };
    status: 'active' | 'upcoming' | 'finished';
    enrolled: number;
    present?: number;
}

export interface SystemService {
    name: string;
    status: 'online' | 'offline' | 'degraded';
    details?: string;
}

export interface LiveClass {
    subject: string;
    grade: string;
    enrolled: number;
    present: number;
}

export interface ScheduleSession {
    id: string;
    date: string; // ISO Date "2024-02-12"
    startTime: string; // "08:00 AM"
    endTime: string; // "10:00 AM"
    subject: string;
    grade: string;
    medium: 'Sinhala' | 'English' | 'Tamil';
    type: 'Theory' | 'Revision' | 'Paper';
    teacher: {
        name: string;
        avatar?: string;
    };
    location: string;
    status: 'scheduled' | 'extra' | 'cancelled';
}

// Today's Schedule (Mock)
export const todaySchedule: ScheduleItem[] = [
    {
        id: '1',
        time: '02:30 PM',
        subject: 'Combined Maths',
        grade: '2025 A/L',
        teacher: {
            name: 'Mr. Perera',
            initials: 'KP',
        },
        status: 'active',
        enrolled: 200,
        present: 142,
    },
    {
        id: '2',
        time: '04:00 PM',
        subject: 'Physics',
        grade: '2026 A/L',
        teacher: {
            name: 'Ms. Silva',
            initials: 'NS',
        },
        status: 'upcoming',
        enrolled: 180,
    },
    {
        id: '3',
        time: '05:30 PM',
        subject: 'Chemistry',
        grade: '2025 A/L',
        teacher: {
            name: 'Mr. Fernando',
            initials: 'AF',
        },
        status: 'upcoming',
        enrolled: 165,
    },
    {
        id: '4',
        time: '12:30 PM',
        subject: 'English',
        grade: 'Grade 10',
        teacher: {
            name: 'Mrs. Jayasinghe',
            initials: 'SJ',
        },
        status: 'finished',
        enrolled: 120,
        present: 98,
    },
];

// Live Class (Currently Running)
export const liveClass: LiveClass = {
    subject: 'Combined Maths',
    grade: '2025 A/L',
    enrolled: 200,
    present: 142,
};

// Business Stats
export const dashboardStats: DashboardStat[] = [
    {
        label: 'Total Collection (This Month)',
        value: 'Rs. 1,245,000',
        trend: '+18%',
        status: 'success',
    },
    {
        label: 'Total Pending Arrears',
        value: 'Rs. 185,000',
        status: 'critical',
    },
    {
        label: 'New Students',
        value: '+12',
        trend: 'This Month',
        status: 'neutral',
    },
];

// System Services Status
export const systemServices: SystemService[] = [
    {
        name: 'SMS Gateway',
        status: 'online',
        details: '450 Credits',
    },
    {
        name: 'Vercel',
        status: 'online',
        details: 'All Systems Operational',
    },
    {
        name: 'Supabase DB',
        status: 'online',
        details: 'Healthy',
    },
];

// Student Management Types
export interface Student {
    id: string;
    name: string;
    studentId: string;
    phone: string;
    grade: string;
    batch: string;
    status: 'active' | 'draft' | 'left';
    paymentStatus: 'paid' | 'pending' | 'free' | 'draft';
    avatar?: string;
    initials: string;
    lastActivity: string;
    admissionDate: string;
}

// Extended Student Detail Types
export interface GuardianInfo {
    name: string;
    relationship: 'Father' | 'Mother' | 'Guardian';
    phone: string;
    isEmergencyContact: boolean;
}

export interface PaymentRecord {
    id: string;
    month: string;
    class: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending';
}

export interface AttendanceRecord {
    id: string;
    date: string;
    time: string;
    status: 'present' | 'late' | 'absent';
    class: string;
}

export interface EnrolledClass {
    id: string;
    name: string;
    grade: string;
    teacher: string;
    schedule: string;
}

export interface StudentDetail extends Student {
    // Personal
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    address: string;
    school: string;

    // Guardian
    guardian: GuardianInfo;

    // Academic
    olYear?: number;
    alYear?: number;

    // Financial
    admissionStatus: 'PENDING' | 'PAID';
    admissionFee: number;
    paymentHistory: PaymentRecord[];
    arrears: number;

    // Attendance
    attendanceRate: number;
    attendanceHistory: AttendanceRecord[];

    // Classes
    enrolledClasses: EnrolledClass[];
}

// Student Stats for Mini Grid
export const studentStats: DashboardStat[] = [
    {
        label: 'Total Students',
        value: '842',
        status: 'neutral',
    },
    {
        label: 'Active Students',
        value: '798',
        trend: '95%',
        status: 'success',
    },
    {
        label: 'New This Month',
        value: '+12',
        status: 'neutral',
    },
    {
        label: 'Payment Pending',
        value: '34',
        status: 'warning',
    },
];

// Mock Student Data (20+ records)
export const studentData: Student[] = [
    {
        id: '1',
        name: 'Kavindu Perera',
        studentId: 'SRS-2024-001',
        phone: '0712345678',
        grade: 'Grade 12',
        batch: '2025 A/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'KP',
        lastActivity: '2 days ago',
        admissionDate: '2024-01-15',
    },
    {
        id: '2',
        name: 'Nethmi Silva',
        studentId: 'SRS-2024-002',
        phone: '0776543210',
        grade: 'Grade 11',
        batch: '2026 A/L',
        status: 'active',
        paymentStatus: 'pending',
        initials: 'NS',
        lastActivity: '5 hours ago',
        admissionDate: '2024-01-18',
    },
    {
        id: '3',
        name: 'Ashan Fernando',
        studentId: 'SRS-2024-003',
        phone: '0701234567',
        grade: 'Grade 10',
        batch: '2027 O/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'AF',
        lastActivity: '1 day ago',
        admissionDate: '2024-02-01',
    },
    {
        id: '4',
        name: 'Sanduni Jayasinghe',
        studentId: 'SRS-2024-004',
        phone: '0789876543',
        grade: 'Grade 9',
        batch: 'General',
        status: 'active',
        paymentStatus: 'free',
        initials: 'SJ',
        lastActivity: '3 days ago',
        admissionDate: '2024-02-10',
    },
    {
        id: '5',
        name: 'Dineth Rajapaksha',
        studentId: 'SRS-2024-005',
        phone: '0712223344',
        grade: 'Grade 12',
        batch: '2025 A/L',
        status: 'active',
        paymentStatus: 'pending',
        initials: 'DR',
        lastActivity: '1 hour ago',
        admissionDate: '2024-01-20',
    },
    {
        id: '6',
        name: 'Tharindu Wickramasinghe',
        studentId: 'SRS-2024-006',
        phone: '0765556677',
        grade: 'Grade 11',
        batch: '2026 A/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'TW',
        lastActivity: '4 days ago',
        admissionDate: '2024-02-05',
    },
    {
        id: '7',
        name: 'Imesha Gunasekara',
        studentId: 'SRS-2024-007',
        phone: '0723334455',
        grade: 'Grade 10',
        batch: '2027 O/L',
        status: 'draft',
        paymentStatus: 'draft',
        initials: 'IG',
        lastActivity: '10 days ago',
        admissionDate: '2024-03-01',
    },
    {
        id: '8',
        name: 'Chamara Bandara',
        studentId: 'SRS-2024-008',
        phone: '0777778888',
        grade: 'Grade 9',
        batch: 'General',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'CB',
        lastActivity: '6 hours ago',
        admissionDate: '2024-02-15',
    },
    {
        id: '9',
        name: 'Nimesha De Silva',
        studentId: 'SRS-2024-009',
        phone: '0701112233',
        grade: 'Grade 12',
        batch: '2025 A/L',
        status: 'active',
        paymentStatus: 'pending',
        initials: 'ND',
        lastActivity: '2 days ago',
        admissionDate: '2024-01-25',
    },
    {
        id: '10',
        name: 'Dasun Pathirana',
        studentId: 'SRS-2024-010',
        phone: '0789990000',
        grade: 'Grade 11',
        batch: '2026 A/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'DP',
        lastActivity: '5 days ago',
        admissionDate: '2024-02-20',
    },
    {
        id: '11',
        name: 'Kavindi Herath',
        studentId: 'SRS-2024-011',
        phone: '0712223333',
        grade: 'Grade 10',
        batch: '2027 O/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'KH',
        lastActivity: '1 day ago',
        admissionDate: '2024-02-22',
    },
    {
        id: '12',
        name: 'Sahan Wijesinghe',
        studentId: 'SRS-2024-012',
        phone: '0765554444',
        grade: 'Grade 9',
        batch: 'General',
        status: 'active',
        paymentStatus: 'free',
        initials: 'SW',
        lastActivity: '3 hours ago',
        admissionDate: '2024-03-05',
    },
    {
        id: '13',
        name: 'Thilini Amarasinghe',
        studentId: 'SRS-2024-013',
        phone: '0723336666',
        grade: 'Grade 12',
        batch: '2025 A/L',
        status: 'left',
        paymentStatus: 'paid',
        initials: 'TA',
        lastActivity: '30 days ago',
        admissionDate: '2024-01-10',
    },
    {
        id: '14',
        name: 'Lakshan Kumara',
        studentId: 'SRS-2024-014',
        phone: '0777775555',
        grade: 'Grade 11',
        batch: '2026 A/L',
        status: 'active',
        paymentStatus: 'pending',
        initials: 'LK',
        lastActivity: '2 days ago',
        admissionDate: '2024-02-12',
    },
    {
        id: '15',
        name: 'Ravindi Samaraweera',
        studentId: 'SRS-2024-015',
        phone: '0701117777',
        grade: 'Grade 10',
        batch: '2027 O/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'RS',
        lastActivity: '4 hours ago',
        admissionDate: '2024-02-28',
    },
    {
        id: '16',
        name: 'Ishara Dissanayake',
        studentId: 'SRS-2024-016',
        phone: '0789998888',
        grade: 'Grade 9',
        batch: 'General',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'ID',
        lastActivity: '1 day ago',
        admissionDate: '2024-03-10',
    },
    {
        id: '17',
        name: 'Prasad Gamage',
        studentId: 'SRS-2024-017',
        phone: '0712229999',
        grade: 'Grade 12',
        batch: '2025 A/L',
        status: 'draft',
        paymentStatus: 'draft',
        initials: 'PG',
        lastActivity: '15 days ago',
        admissionDate: '2024-03-15',
    },
    {
        id: '18',
        name: 'Malsha Liyanage',
        studentId: 'SRS-2024-018',
        phone: '0765551111',
        grade: 'Grade 11',
        batch: '2026 A/L',
        status: 'active',
        paymentStatus: 'pending',
        initials: 'ML',
        lastActivity: '6 hours ago',
        admissionDate: '2024-03-01',
    },
    {
        id: '19',
        name: 'Dilshan Perera',
        studentId: 'SRS-2024-019',
        phone: '0723332222',
        grade: 'Grade 10',
        batch: '2027 O/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'DP',
        lastActivity: '2 days ago',
        admissionDate: '2024-02-08',
    },
    {
        id: '20',
        name: 'Hiruni Karunaratne',
        studentId: 'SRS-2024-020',
        phone: '0777773333',
        grade: 'Grade 9',
        batch: 'General',
        status: 'active',
        paymentStatus: 'free',
        initials: 'HK',
        lastActivity: '5 days ago',
        admissionDate: '2024-02-25',
    },
    {
        id: '21',
        name: 'Chamod Wijeratne',
        studentId: 'SRS-2024-021',
        phone: '0701114444',
        grade: 'Grade 12',
        batch: '2025 A/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'CW',
        lastActivity: '3 hours ago',
        admissionDate: '2024-01-30',
    },
    {
        id: '22',
        name: 'Sachini Ranawaka',
        studentId: 'SRS-2024-022',
        phone: '0789995555',
        grade: 'Grade 11',
        batch: '2026 A/L',
        status: 'active',
        paymentStatus: 'paid',
        initials: 'SR',
        lastActivity: '1 day ago',
        admissionDate: '2024-02-18',
    },
];

// Mock Selected Student for Detail Sheet
export const MOCK_SELECTED_STUDENT: StudentDetail = {
    // Base Info
    id: '2',
    name: 'Nethmi Silva',
    studentId: 'SRS-2024-002',
    phone: '0776543210',
    grade: 'Grade 11',
    batch: '2026 A/L',
    status: 'active',
    paymentStatus: 'pending',
    initials: 'NS',
    lastActivity: '5 hours ago',
    admissionDate: '2024-01-18',

    // Personal Details
    dateOfBirth: '2008-05-12',
    gender: 'Female',
    address: '125/3, Galle Road, Colombo 03',
    school: 'Visakha Vidyalaya',

    // Guardian
    guardian: {
        name: 'Mr. Kamal Perera',
        relationship: 'Father',
        phone: '0771234567',
        isEmergencyContact: true,
    },

    // Academic
    olYear: 2027,
    alYear: 2029,

    // Financial
    admissionStatus: 'PENDING',
    admissionFee: 1000,
    arrears: 2500,
    paymentHistory: [
        {
            id: 'p1',
            month: 'JAN',
            class: 'Combined Maths',
            amount: 2500,
            date: '2024-01-05',
            status: 'paid',
        },
        {
            id: 'p2',
            month: 'FEB',
            class: 'Combined Maths',
            amount: 2500,
            date: '2024-02-08',
            status: 'pending',
        },
        {
            id: 'p3',
            month: 'JAN',
            class: 'Physics',
            amount: 2000,
            date: '2024-01-12',
            status: 'paid',
        },
        {
            id: 'p4',
            month: 'FEB',
            class: 'Physics',
            amount: 2000,
            date: '2024-02-15',
            status: 'pending',
        },
    ],

    // Attendance
    attendanceRate: 85,
    attendanceHistory: [
        {
            id: 'a1',
            date: '2024-01-25',
            time: '08:05 AM',
            status: 'present',
            class: 'Combined Maths',
        },
        {
            id: 'a2',
            date: '2024-01-24',
            time: '08:12 AM',
            status: 'late',
            class: 'Physics',
        },
        {
            id: 'a3',
            date: '2024-01-23',
            time: '08:03 AM',
            status: 'present',
            class: 'Combined Maths',
        },
        {
            id: 'a4',
            date: '2024-01-22',
            time: '--',
            status: 'absent',
            class: 'Physics',
        },
        {
            id: 'a5',
            date: '2024-01-21',
            time: '08:07 AM',
            status: 'present',
            class: 'Combined Maths',
        },
    ],

    // Enrolled Classes
    enrolledClasses: [
        {
            id: 'c1',
            name: 'Combined Maths',
            grade: '2026 A/L',
            teacher: 'Mr. Perera',
            schedule: 'Mon, Wed, Fri - 2:30 PM',
        },
        {
            id: 'c2',
            name: 'Physics',
            grade: '2026 A/L',
            teacher: 'Ms. Silva',
            schedule: 'Tue, Thu - 4:00 PM',
        },
    ],
};

// Fee Collection Page Mocks
export interface FeeMonth {
    month: string;
    status: 'paid' | 'unpaid' | 'partial' | 'selected';
    amount: number;
    paidAmount?: number;
    year: number;
}

export interface ClassFeeStructure {
    classId: string;
    className: string;
    monthlyFee: number;
    months: FeeMonth[];
}

export const MOCK_FEE_STRUCTURE: {
    student: StudentDetail;
    feeClasses: ClassFeeStructure[];
} = {
    // Re-using the student with Pending Admission
    student: {
        ...MOCK_SELECTED_STUDENT,
        admissionStatus: 'PENDING',
    },
    feeClasses: [
        {
            classId: 'c1',
            className: 'Combined Maths - 2026 A/L',
            monthlyFee: 2500,
            months: [
                {
                    month: 'JAN',
                    year: 2026,
                    status: 'paid',
                    amount: 2500,
                    paidAmount: 2500,
                },
                { month: 'FEB', year: 2026, status: 'unpaid', amount: 2500 },
                { month: 'MAR', year: 2026, status: 'unpaid', amount: 2500 },
                { month: 'APR', year: 2026, status: 'unpaid', amount: 2500 },
                { month: 'MAY', year: 2026, status: 'unpaid', amount: 2500 },
                { month: 'JUN', year: 2026, status: 'unpaid', amount: 2500 },
            ],
        },
        {
            classId: 'c2',
            className: 'Physics - 2026 A/L',
            monthlyFee: 2000,
            months: [
                {
                    month: 'JAN',
                    year: 2026,
                    status: 'paid',
                    amount: 2000,
                    paidAmount: 2000,
                },
                {
                    month: 'FEB',
                    year: 2026,
                    status: 'partial',
                    amount: 2000,
                    paidAmount: 1000,
                },
                { month: 'MAR', year: 2026, status: 'unpaid', amount: 2000 },
                { month: 'APR', year: 2026, status: 'unpaid', amount: 2000 },
                { month: 'MAY', year: 2026, status: 'unpaid', amount: 2000 },
                { month: 'JUN', year: 2026, status: 'unpaid', amount: 2000 },
            ],
        },
    ],
};

// Mock Timetable Data for a specific week (Feb 12 - Feb 18, 2026)
export const MOCK_TIMETABLE: ScheduleSession[] = [
    // Monday Feb 12
    {
        id: 's1',
        date: '2026-02-12',
        startTime: '08:00 AM',
        endTime: '10:00 AM',
        subject: 'Combined Maths',
        grade: 'Grade 12',
        medium: 'Sinhala',
        type: 'Theory',
        teacher: { name: 'Mr. Perera' },
        location: 'Hall A',
        status: 'scheduled',
    },
    {
        id: 's2',
        date: '2026-02-12',
        startTime: '08:00 AM',
        endTime: '10:00 AM',
        subject: 'Physics',
        grade: 'Grade 13',
        medium: 'English',
        type: 'Revision',
        teacher: { name: 'Ms. Silva' },
        location: 'Hall B',
        status: 'scheduled',
    },
    {
        id: 's3',
        date: '2026-02-12',
        startTime: '10:30 AM',
        endTime: '12:30 PM',
        subject: 'Chemistry',
        grade: 'Grade 12',
        medium: 'Sinhala',
        type: 'Theory',
        teacher: { name: 'Mr. Fernando' },
        location: 'Hall A',
        status: 'extra',
    },
    // Tuesday Feb 13
    {
        id: 's4',
        date: '2026-02-13',
        startTime: '02:30 PM',
        endTime: '04:30 PM',
        subject: 'Biology',
        grade: 'Grade 11',
        medium: 'Sinhala',
        type: 'Theory',
        teacher: { name: 'Dr. Gunawardena' },
        location: 'Hall C',
        status: 'scheduled',
    },
    // Wednesday Feb 14
    {
        id: 's5',
        date: '2026-02-14',
        startTime: '08:00 AM',
        endTime: '10:00 AM',
        subject: 'Combined Maths',
        grade: 'Grade 13',
        medium: 'English',
        type: 'Paper',
        teacher: { name: 'Mr. Perera' },
        location: 'Hall A',
        status: 'cancelled',
    },
    // Thursday Feb 15
    {
        id: 's6',
        date: '2026-02-15',
        startTime: '03:30 PM',
        endTime: '05:30 PM',
        subject: 'Physics',
        grade: 'Grade 11',
        medium: 'Sinhala',
        type: 'Theory',
        teacher: { name: 'Ms. Silva' },
        location: 'Hall B',
        status: 'scheduled',
    },
    // Friday Feb 16
    {
        id: 's7',
        date: '2026-02-16',
        startTime: '08:00 AM',
        endTime: '10:00 AM',
        subject: 'Combined Maths',
        grade: 'Grade 12',
        medium: 'English',
        type: 'Revision',
        teacher: { name: 'Mr. Perera' },
        location: 'Hall A',
        status: 'scheduled',
    },
];
