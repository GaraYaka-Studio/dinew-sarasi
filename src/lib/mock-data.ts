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
