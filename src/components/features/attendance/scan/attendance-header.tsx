'use client';

import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import {
    getClassesWithSessionInfo,
    type ClassWithSession,
} from '@/lib/db/attendance';
import {
    timeToMinutes,
    formatTime,
    getCurrentDate,
    getCurrentMinutes,
    getDateOffset,
    SESSION_BUFFER_MINUTES,
} from '@/lib/utils/time';

interface AttendanceHeaderProps {
    className?: string;
    activeClass: string;
    activeSession: string | null;
    onClassChange: (value: string) => void;
    onSessionChange: (value: string | null) => void;
}

// ============================================================================
// Sorting & Selection Helpers
// ============================================================================

type SessionPriority = 1 | 2 | 3 | 4 | 5 | 6;

function getSessionPriority(
    isToday: boolean,
    isTomorrow: boolean,
    isYesterday: boolean,
    startMinutes: number,
    endMinutes: number,
    currentMinutes: number,
    timeBufferMinutes: number
): SessionPriority {
    if (isToday) {
        const isCurrent =
            startMinutes <= currentMinutes && endMinutes >= timeBufferMinutes;
        const isNext = startMinutes > currentMinutes;
        if (isCurrent) return 1; // Today current - highest
        if (isNext) return 2; // Today next
        return 4; // Today past
    }
    if (isTomorrow) return 3; // Tomorrow
    if (isYesterday) return 5; // Yesterday
    return 6; // Other dates
}

function sortClassesByPriority(
    classes: ClassWithSession[],
    currentMinutes: number,
    timeBufferMinutes: number
): ClassWithSession[] {
    const todayDate = getCurrentDate();
    const yesterdayDate = getDateOffset(-1);
    const tomorrowDate = getDateOffset(1);

    return [...classes].sort((a, b) => {
        if (!a.sessionId && !b.sessionId) return 0;
        if (!a.sessionId) return 1;
        if (!b.sessionId) return -1;

        const aStartMinutes = timeToMinutes(a.sessionStartTime);
        const aEndMinutes = timeToMinutes(a.sessionEndTime, aStartMinutes);
        const bStartMinutes = timeToMinutes(b.sessionStartTime);
        const bEndMinutes = timeToMinutes(b.sessionEndTime, bStartMinutes);

        const aPriority = getSessionPriority(
            a.sessionDate === todayDate,
            a.sessionDate === tomorrowDate,
            a.sessionDate === yesterdayDate,
            aStartMinutes,
            aEndMinutes,
            currentMinutes,
            timeBufferMinutes
        );

        const bPriority = getSessionPriority(
            b.sessionDate === todayDate,
            b.sessionDate === tomorrowDate,
            b.sessionDate === yesterdayDate,
            bStartMinutes,
            bEndMinutes,
            currentMinutes,
            timeBufferMinutes
        );

        if (aPriority !== bPriority) return aPriority - bPriority;

        // Same priority - sort by time
        if (aPriority === 1) {
            // Current: most recent first, then by grade/name
            if (bStartMinutes !== aStartMinutes)
                return bStartMinutes - aStartMinutes;
            return (
                (a.grade || '').localeCompare(b.grade || '') ||
                (a.name || '').localeCompare(b.name || '')
            );
        }
        if (aPriority === 2 || aPriority === 3) {
            // Upcoming: earlier first, then by grade/name
            if (aStartMinutes !== bStartMinutes)
                return aStartMinutes - bStartMinutes;
            return (
                (a.grade || '').localeCompare(b.grade || '') ||
                (a.name || '').localeCompare(b.name || '')
            );
        }
        if (aPriority === 4 || aPriority === 5) {
            // Past: more recent first, then by grade/name
            if (bStartMinutes !== aStartMinutes)
                return bStartMinutes - aStartMinutes;
            return (
                (a.grade || '').localeCompare(b.grade || '') ||
                (a.name || '').localeCompare(b.name || '')
            );
        }

        return 0;
    });
}

function sortClassesByTime(classes: ClassWithSession[]): ClassWithSession[] {
    return [...classes].sort((a, b) => {
        if (!a.sessionId && !b.sessionId) {
            return (
                (a.grade || '').localeCompare(b.grade || '') ||
                (a.name || '').localeCompare(b.name || '')
            );
        }
        if (!a.sessionId) return 1;
        if (!b.sessionId) return -1;

        // Sort by start time, then by grade/name for ties
        const aStartMinutes = timeToMinutes(a.sessionStartTime);
        const bStartMinutes = timeToMinutes(b.sessionStartTime);
        if (aStartMinutes !== bStartMinutes)
            return aStartMinutes - bStartMinutes;
        return (
            (a.grade || '').localeCompare(b.grade || '') ||
            (a.name || '').localeCompare(b.name || '')
        );
    });
}

function selectDefaultClass(
    classes: ClassWithSession[]
): { classId: string; sessionId: string | null } | null {
    if (classes.length === 0) return null;

    const currentMinutes = getCurrentMinutes();
    const timeBufferMinutes = currentMinutes - SESSION_BUFFER_MINUTES;
    const sorted = sortClassesByPriority(
        classes,
        currentMinutes,
        timeBufferMinutes
    );

    return {
        classId: sorted[0].id,
        sessionId: sorted[0].sessionId,
    };
}

// ============================================================================
// Component
// ============================================================================

export function AttendanceHeader({
    className,
    activeClass,
    activeSession,
    onClassChange,
    onSessionChange,
}: AttendanceHeaderProps) {
    const [classes, setClasses] = useState<ClassWithSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const data = await getClassesWithSessionInfo();
            const sorted = sortClassesByTime(data);
            setClasses(sorted);

            const selection = selectDefaultClass(sorted);
            if (selection) {
                onClassChange(selection.classId);
                onSessionChange(selection.sessionId);
            }
        } catch (error) {
            console.error('Failed to load classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (classId: string) => {
        onClassChange(classId);
        const classData = classes.find((c) => c.id === classId);
        onSessionChange(classData?.sessionId || null);
    };

    const selectedClass = classes.find((c) => c.id === activeClass);
    const hasActiveSession = selectedClass?.sessionId;
    const sessionTime =
        hasActiveSession &&
        selectedClass.sessionStartTime &&
        selectedClass.sessionEndTime
            ? `${formatTime(selectedClass.sessionStartTime)} - ${formatTime(selectedClass.sessionEndTime)}`
            : null;

    return (
        <header
            className={`sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60 ${className}`}
        >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                {/* Class Selector */}
                <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Class
                    </span>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg leading-none font-bold text-foreground">
                            {selectedClass?.name ||
                                (loading ? 'Loading...' : 'Select Class')}
                        </h1>
                        <Select
                            value={activeClass}
                            onValueChange={handleClassChange}
                            disabled={loading}
                        >
                            <SelectTrigger className="h-6 w-6 rounded-full border-none px-0 opacity-50 hover:opacity-100 focus:ring-0">
                                <span className="sr-only">Change Class</span>
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Session Time Badge */}
                {selectedClass && (
                    <div className="flex items-center gap-2">
                        {hasActiveSession && sessionTime ? (
                            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{sessionTime}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>No session scheduled</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                asChild
                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
                <Link href="/dashboard">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Exit Scan Mode</span>
                </Link>
            </Button>
        </header>
    );
}
