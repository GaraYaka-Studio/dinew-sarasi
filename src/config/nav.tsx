import {
    LayoutDashboard,
    QrCode,
    UserSquare2,
    Wallet,
    BookOpen,
    UserCog,
    BarChart3,
    Settings,
    Scan,
    UserPlus,
    Users,
    CreditCard,
    TrendingUp,
    Receipt,
    GraduationCap,
    BookMarked,
    Calendar,
    DollarSign,
    FileText,
    Shield,
    Building2,
    CalendarDays,
    UsersRound,
} from 'lucide-react';

export interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
    icon?: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
    title: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
    groups?: NavGroup[];
    items?: NavItem[];
}

export const NAV_ITEMS = {
    primary: {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    operations: {
        title: 'Operations',
        groups: [
            {
                title: 'Attendance',
                icon: QrCode,
                items: [
                    {
                        title: 'Mark Attendance',
                        href: '/dashboard/attendance/scan',
                        icon: Scan,
                    },

                    {
                        title: 'Attendance Log',
                        href: '/dashboard/attendance/log',
                        icon: FileText,
                    },
                ],
            },
            {
                title: 'Students',
                icon: UserSquare2,
                items: [
                    {
                        title: 'Admissions',
                        href: '/dashboard/students/admissions',
                        icon: UserPlus,
                    },
                    {
                        title: 'All Students',
                        href: '/dashboard/students',
                        icon: Users,
                    },
                    {
                        title: 'ID Cards',
                        href: '/dashboard/students/ids',
                        icon: CreditCard,
                    },
                    {
                        title: 'Promotions',
                        href: '/dashboard/students/promotions',
                        icon: TrendingUp,
                    },
                ],
            },
            {
                title: 'Finance',
                icon: Wallet,
                items: [
                    {
                        title: 'Collect Fees',
                        href: '/dashboard/payments/collect',
                        icon: DollarSign,
                    },
                    {
                        title: 'Expenses',
                        href: '/dashboard/payments/expenses',
                        icon: Receipt,
                    },
                    {
                        title: 'Transactions',
                        href: '/dashboard/payments/transactions',
                        icon: FileText,
                    },
                ],
            },
        ],
    },
    academics: {
        title: 'Academics & Management',
        groups: [
            {
                title: 'Academics',
                icon: BookOpen,
                items: [
                    {
                        title: 'Classes',
                        href: '/dashboard/academics/classes',
                        icon: GraduationCap,
                    },
                    {
                        title: 'Subjects',
                        href: '/dashboard/academics/subjects',
                        icon: BookMarked,
                    },
                    {
                        title: 'Timetable',
                        href: '/dashboard/academics/timetable',
                        icon: Calendar,
                    },
                ],
            },
            {
                title: 'Staff',
                icon: UserCog,
                items: [
                    {
                        title: 'Teachers',
                        href: '/dashboard/staff/teachers',
                        icon: Users,
                    },
                    {
                        title: 'Teacher Payments',
                        href: '/dashboard/staff/payments',
                        icon: DollarSign,
                    },
                ],
            },
            {
                title: 'Reports',
                icon: BarChart3,
                items: [
                    {
                        title: 'Financial Reports',
                        href: '/dashboard/reports/financial',
                        icon: DollarSign,
                    },
                    {
                        title: 'Attendance Reports',
                        href: '/dashboard/reports/attendance',
                        icon: Calendar,
                    },
                    {
                        title: 'Audit Logs',
                        href: '/dashboard/reports/audit',
                        icon: Shield,
                    },
                ],
            },
        ],
    },
    system: {
        title: 'Settings',
        icon: Settings,
        items: [
            {
                title: 'General Settings',
                href: '/dashboard/settings/general',
                icon: Building2,
            },
            {
                title: 'Academic Years',
                href: '/dashboard/settings/academic-years',
                icon: CalendarDays,
            },
            {
                title: 'User Management',
                href: '/dashboard/settings/users',
                icon: UsersRound,
            },
        ],
    },
};
