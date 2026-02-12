'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { StudentDetail } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface TabAttendanceProps {
    student: StudentDetail;
}

export function TabAttendance({ student }: TabAttendanceProps) {
    const getStatusIcon = (status: string) => {
        if (status === 'present') return CheckCircle2;
        if (status === 'late') return Clock;
        return XCircle;
    };

    const getStatusColor = (status: string) => {
        if (status === 'present') return 'text-green-600';
        if (status === 'late') return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-4">
            {/* Stats Overview */}
            <Card className="bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Attendance Rate
                        </p>
                        <p className="text-2xl font-bold">
                            {student.attendanceRate}%
                        </p>
                    </div>
                    <div className="h-16 w-16">
                        <svg
                            className="h-full w-full -rotate-90"
                            viewBox="0 0 36 36"
                        >
                            <path
                                className="stroke-muted"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className={cn(
                                    'stroke-primary',
                                    student.attendanceRate >= 85 &&
                                        'stroke-green-600',
                                    student.attendanceRate < 75 &&
                                        'stroke-destructive'
                                )}
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={`${student.attendanceRate}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                    </div>
                </div>
            </Card>

            {/* History Log */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Recent Activity
                </h3>
                <div className="space-y-2">
                    {student.attendanceHistory.map((record) => {
                        const StatusIcon = getStatusIcon(record.status);
                        return (
                            <div
                                key={record.id}
                                className="flex items-center gap-3 rounded-lg border p-3"
                            >
                                <StatusIcon
                                    className={cn(
                                        'h-5 w-5',
                                        getStatusColor(record.status)
                                    )}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {record.class}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {record.date} • {record.time}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        record.status === 'present'
                                            ? 'success'
                                            : record.status === 'late'
                                              ? 'warning'
                                              : 'secondary'
                                    }
                                >
                                    {record.status}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
