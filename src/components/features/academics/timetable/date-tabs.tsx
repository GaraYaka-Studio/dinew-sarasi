'use client';

import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';

interface DateTabsProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export function DateTabs({ currentDate, onDateChange }: DateTabsProps) {
    // Helper to get the week dates
    const getWeekDates = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
        const monday = new Date(date);
        monday.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            days.push(nextDay);
        }
        return days;
    };

    const weekDates = getWeekDates(currentDate);

    // Mock holidays for demonstration
    const isHoliday = (date: Date) => {
        return false;
    };

    return (
        <div className="w-full overflow-hidden">
            <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2">
                {weekDates.map((date) => {
                    const isActive = isSameDay(date, currentDate);
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateChange(date)}
                            className={cn(
                                'flex min-w-[100px] flex-col items-center justify-center rounded-lg border px-4 py-3 transition-all hover:bg-muted/50',
                                isActive
                                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm'
                                    : 'bg-background hover:border-sidebar-accent border-transparent text-muted-foreground',
                                isToday && !isActive && 'border-muted-foreground/30 bg-muted/20'
                            )}
                        >
                            <span className={cn("text-xs font-medium uppercase tracking-wider", isActive ? "text-primary-foreground/80" : "")}>
                                {format(date, 'EEE')}
                            </span>
                            <span className={cn("text-xl font-bold", isActive ? "text-primary-foreground" : "text-foreground")}>
                                {format(date, 'd')}
                            </span>
                            {isHoliday(date) && (
                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
