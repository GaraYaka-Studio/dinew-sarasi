'use client';

import { Calendar, Clock, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { ActivitySession } from '@/types/reports';

interface ActivityLogTableProps {
    data: ActivitySession[];
}

export function ActivityLogTable({ data }: ActivityLogTableProps) {
    if (data.length === 0) {
        return (
            <EmptyState message="No activity records found for the selected month." />
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Attendance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell className="text-sm">
                                    {formatDateDisplay(session.date)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {session.time}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {session.className}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {session.grade}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {session.teacherName || 'Unassigned'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={session.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <AttendanceBadge
                                        attendanceCount={session.attendanceCount}
                                        totalEnrolled={session.totalEnrolled}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
                {data.map((session) => (
                    <ActivityCard key={session.id} session={session} />
                ))}
            </div>
        </>
    );
}

function ActivityCard({ session }: { session: ActivitySession }) {
    return (
        <Card className="p-4">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{session.className}</span>
                        <StatusBadge status={session.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {session.grade}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateDisplay(session.date)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time}
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {session.teacherName || 'Unassigned'}
                        </div>
                    </div>
                </div>
                <div className="ml-4">
                    <AttendanceBadge
                        attendanceCount={session.attendanceCount}
                        totalEnrolled={session.totalEnrolled}
                    />
                </div>
            </div>
        </Card>
    );
}

function StatusBadge({ status }: { status: ActivitySession['status'] }) {
    const variants = {
        scheduled: {
            label: 'Held',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        cancelled: {
            label: 'Cancelled',
            className: 'bg-red-100 text-red-800 border-red-200',
        },
        extra: {
            label: 'Extra',
            className: 'bg-blue-100 text-blue-800 border-blue-200',
        },
    };

    const variant = variants[status];

    return (
        <Badge variant="outline" className={cn('text-xs', variant.className)}>
            {variant.label}
        </Badge>
    );
}

function AttendanceBadge({
    attendanceCount,
    totalEnrolled,
}: {
    attendanceCount: number;
    totalEnrolled: number;
}) {
    const percentage = totalEnrolled > 0
        ? Math.round((attendanceCount / totalEnrolled) * 100)
        : 0;

    const getBadgeVariant = () => {
        if (percentage >= 80) {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        if (percentage >= 50) {
            return 'bg-orange-100 text-orange-800 border-orange-200';
        }
        return 'bg-red-100 text-red-800 border-red-200';
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <Badge
                variant="outline"
                className={cn('text-xs', getBadgeVariant())}
            >
                <Users className="mr-1 h-3 w-3" />
                {attendanceCount}/{totalEnrolled}
            </Badge>
            <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
    );
}

function formatDateDisplay(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/20">
            <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}
