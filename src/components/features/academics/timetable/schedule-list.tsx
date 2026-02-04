'use client';

import { ScheduleSession } from '@/lib/mock-data';
import { ScheduleCard } from './schedule-card';

interface ScheduleListProps {
    sessions: ScheduleSession[];
    onView: (session: ScheduleSession) => void;
}

export function ScheduleList({ sessions, onView }: ScheduleListProps) {
    // Group sessions by startTime
    const groupedSessions = sessions.reduce(
        (acc, session) => {
            const time = session.startTime;
            if (!acc[time]) {
                acc[time] = [];
            }
            acc[time].push(session);
            return acc;
        },
        {} as Record<string, ScheduleSession[]>
    );

    // Sort by time (string comparison works for simplistic "08:00 AM" if format is consistent,
    // but better to parse. For mock, keys are consistent.
    // 08:00 AM < 10:30 AM < 02:30 PM (Wait, PM comes after AM alphabetically? No. 08 < 10)
    // Actually alphabetical "02:30 PM" < "08:00 AM". So we need time sorting logic.
    // But for now, object iteration order is not guaranteed. We should sort keys.

    const sortedTimes = Object.keys(groupedSessions).sort((a, b) => {
        // Parse time to compare
        // "08:00 AM" -> Date
        // Quick parse for sort
        const parseTime = (t: string) => {
            const [time, period] = t.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let h = hours;
            if (period === 'PM' && h !== 12) h += 12;
            if (period === 'AM' && h === 12) h = 0;
            return h * 60 + minutes;
        };
        return parseTime(a) - parseTime(b);
    });

    if (sessions.length === 0) {
        return (
            <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <p className="text-lg font-medium text-muted-foreground">
                    No classes scheduled
                </p>
                <p className="text-sm text-muted-foreground">
                    Add a session to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {sortedTimes.map((time) => (
                <div
                    key={time}
                    className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr]"
                >
                    {/* Time Header (Desktop: Left Column, Mobile: Top Header) */}
                    <div className="flex items-start pt-2 md:justify-end">
                        <div className="sticky top-4 rounded-md bg-muted px-2 py-1 text-xs font-bold tracking-wider text-muted-foreground uppercase md:bg-transparent md:text-sm md:font-semibold">
                            {time}
                        </div>
                    </div>

                    {/* Cards Stack */}
                    <div className="space-y-3">
                        {groupedSessions[time].map((session) => (
                            <ScheduleCard
                                key={session.id}
                                session={session}
                                onView={onView}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
