'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { AttendanceLogSessionWithDate } from '@/types/reports';

interface AttendanceLogTableProps {
    data: AttendanceLogSessionWithDate[];
}

export function AttendanceLogTable({ data }: AttendanceLogTableProps) {
    if (data.length === 0) {
        return (
            <EmptyState message="No attendance records found for the selected month." />
        );
    }

    // Group sessions by date
    const groupedByDate = data.reduce(
        (acc, session) => {
            if (!acc[session.date]) {
                acc[session.date] = [];
            }
            acc[session.date].push(session);
            return acc;
        },
        {} as Record<string, AttendanceLogSessionWithDate[]>
    );

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
        b.localeCompare(a)
    );

    return (
        <div className="space-y-6">
            {sortedDates.map((date) => (
                <DateGroup
                    key={date}
                    date={date}
                    sessions={groupedByDate[date]}
                />
            ))}
        </div>
    );
}

function DateGroup({
    date,
    sessions,
}: {
    date: string;
    sessions: AttendanceLogSessionWithDate[];
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Format date for display (e.g., "Mon, Feb 3, 2026")
    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const totalStudents = sessions.reduce((sum, s) => sum + s.totalPresent, 0);

    return (
        <div className="space-y-3">
            {/* Date Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
            >
                <div className="flex items-center gap-3">
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                        {formatDateDisplay(date)}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                        {sessions.length} session
                        {sessions.length !== 1 ? 's' : ''}
                    </Badge>
                    <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-700 dark:text-green-400"
                    >
                        <Users className="mr-1 h-3 w-3" />
                        {totalStudents} present
                    </Badge>
                </div>
            </button>

            {/* Sessions List */}
            {isExpanded && (
                <div className="ml-4 space-y-2">
                    {sessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SessionCard({ session }: { session: AttendanceLogSessionWithDate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
            >
                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-semibold">
                        {session.className}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {session.time}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="default"
                        className="bg-green-500/10 text-xs text-green-700 dark:text-green-400"
                    >
                        {session.totalPresent} present
                    </Badge>
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className="border-t bg-muted/20 p-3">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                        Students ({session.totalPresent})
                    </p>
                    <div className="space-y-2">
                        {session.students.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage
                                            src={student.avatarUrl ?? undefined}
                                        />
                                        <AvatarFallback className="text-xs">
                                            {getInitials(student.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {student.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            ID: {student.studentId}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {student.scanTime}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
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
