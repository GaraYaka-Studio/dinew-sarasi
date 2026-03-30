'use client';

import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceLogHeaderProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export function AttendanceLogHeader({
    currentDate,
    onDateChange,
}: AttendanceLogHeaderProps) {
    // Calculate week range (Monday to Sunday)
    const getWeekRange = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date);
        monday.setDate(diff);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return { start: monday, end: sunday };
    };

    const { start, end } = getWeekRange(currentDate);

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        onDateChange(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        onDateChange(newDate);
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    return (
        <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Attendance Log
                </h1>
                <p className="text-sm text-muted-foreground">
                    View and manage attendance records by date.
                </p>
            </div>

            {/* Center: Week Navigator */}
            <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handlePrevWeek}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex min-w-[180px] items-center justify-center gap-2 px-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {start.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}{' '}
                            -{' '}
                            {end.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleNextWeek}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToday}
                    className="text-xs"
                >
                    Today
                </Button>
            </div>

            {/* Right: Empty (no actions needed) */}
            <div className="w-20 lg:w-auto" />
        </div>
    );
}
