'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavItem[];
}

// Navigation Configuration (Same as Sidebar)
const NAV_ITEMS = {
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
                        title: 'Rapid Scan',
                        href: '/dashboard/attendance/scan',
                        icon: Scan,
                    },
                    {
                        title: 'Manual Entry',
                        href: '/dashboard/attendance/manual',
                        icon: UserPlus,
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
        ] as NavGroup[],
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
        ] as NavGroup[],
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

export function MobileNav() {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="flex flex-col space-y-1">
            {/* Primary Entry: Dashboard */}
            <Link
                href={NAV_ITEMS.primary.href}
                className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(NAV_ITEMS.primary.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
            >
                <NAV_ITEMS.primary.icon className="h-5 w-5" />
                {NAV_ITEMS.primary.title}
            </Link>

            {/* Operations Section */}
            <div className="pt-4">
                <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {NAV_ITEMS.operations.title}
                </p>
                <Accordion type="single" collapsible className="space-y-1">
                    {NAV_ITEMS.operations.groups.map((group) => (
                        <AccordionItem
                            key={group.title}
                            value={group.title}
                            className="border-none"
                        >
                            <AccordionTrigger
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline',
                                    'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <group.icon className="h-5 w-5" />
                                    {group.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-1">
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-md py-2 pr-3 pl-11 text-sm transition-colors',
                                                isActive(item.href)
                                                    ? 'bg-accent font-medium text-accent-foreground'
                                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Academics & Management Section */}
            <div className="pt-4">
                <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {NAV_ITEMS.academics.title}
                </p>
                <Accordion type="single" collapsible className="space-y-1">
                    {NAV_ITEMS.academics.groups.map((group) => (
                        <AccordionItem
                            key={group.title}
                            value={group.title}
                            className="border-none"
                        >
                            <AccordionTrigger
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline',
                                    'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <group.icon className="h-5 w-5" />
                                    {group.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-1">
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-md py-2 pr-3 pl-11 text-sm transition-colors',
                                                isActive(item.href)
                                                    ? 'bg-accent font-medium text-accent-foreground'
                                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* System Section */}
            <div className="pt-4">
                <Accordion type="single" collapsible>
                    <AccordionItem value="settings" className="border-none">
                        <AccordionTrigger
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline',
                                'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <NAV_ITEMS.system.icon className="h-5 w-5" />
                                {NAV_ITEMS.system.title}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-1">
                            <div className="space-y-1">
                                {NAV_ITEMS.system.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-md py-2 pr-3 pl-11 text-sm transition-colors',
                                            isActive(item.href)
                                                ? 'bg-accent font-medium text-accent-foreground'
                                                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </nav>
    );
}
