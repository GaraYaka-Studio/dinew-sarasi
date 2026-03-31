'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { TimetableHeader } from '@/components/features/academics/timetable/timetable-header';
import { DateTabs } from '@/components/features/academics/timetable/date-tabs';
import { ScheduleList } from '@/components/features/academics/timetable/schedule-list';
import { SessionDialog } from '@/components/features/academics/timetable/session-dialog';
import { SessionSheet } from '@/components/features/academics/timetable/session-sheet';
import {
    getSessionsForWeek,
    getActiveClassesForSession,
    checkConflicts,
} from '@/lib/db/timetable';
import { ScheduleSession } from '@/lib/mock-data';
import { toast } from 'sonner';

// Type for session data from database
type DbSession = {
    id: string;
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'extra' | 'cancelled';
    hallName: string | null;
    notes: string | null;
    className: string;
    grade: string;
    medium: 'sinhala' | 'english' | 'tamil';
    type: 'theory' | 'revision' | 'paper';
    subjectId: string;
    subjectName: string;
    teacherId: string;
    teacherName: string;
};

// Transform database session to ScheduleSession format
function toScheduleSession(session: DbSession): ScheduleSession {
    // Format time from "08:00" to "08:00 AM"
    const formatTime = (time: string) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };

    return {
        id: session.id,
        date: session.date,
        startTime: formatTime(session.startTime),
        endTime: formatTime(session.endTime),
        subject: session.subjectName,
        grade: session.grade,
        medium: (session.medium.charAt(0).toUpperCase() +
            session.medium.slice(1)) as 'Sinhala' | 'English' | 'Tamil',
        type: (session.type.charAt(0).toUpperCase() + session.type.slice(1)) as
            | 'Theory'
            | 'Revision'
            | 'Paper',
        teacher: {
            name: session.teacherName || 'Not Assigned',
        },
        location: session.hallName || 'Not Assigned',
        status: session.status,
    };
}

export default function TimetablePage() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [sessions, setSessions] = useState<DbSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sheet State
    const [selectedSession, setSelectedSession] =
        useState<ScheduleSession | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Load sessions when currentDate changes
    useEffect(() => {
        loadSessions();
    }, [currentDate]);

    const loadSessions = async () => {
        setIsLoading(true);
        try {
            const weekSessions = await getSessionsForWeek(currentDate);
            setSessions(weekSessions as DbSession[]);
        } catch (error) {
            console.error('Failed to load sessions:', error);
            toast.error('Failed to load timetable');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter sessions for selected date
    const selectedDateStr = currentDate.toISOString().split('T')[0];
    const filteredSessions = sessions
        .filter((session) => session.date === selectedDateStr)
        .map(toScheduleSession);

    const handleViewSession = (session: ScheduleSession) => {
        setSelectedSession(session);
        setIsSheetOpen(true);
    };

    const handleRefresh = () => {
        loadSessions();
    };

    return (
        <div className="flex h-full flex-col space-y-6">
            {/* Header: Time Machine & Actions */}
            <TimetableHeader
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onAddSession={() => setIsAddSessionOpen(true)}
            />

            {/* Date Navigation Tabs */}
            <DateTabs currentDate={currentDate} onDateChange={setCurrentDate} />

            {/* Main Schedule List */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                            Loading timetable...
                        </p>
                    </div>
                ) : (
                    <ScheduleList
                        sessions={filteredSessions}
                        onView={handleViewSession}
                    />
                )}
            </div>

            {/* Add Session Dialog */}
            <SessionDialog
                isOpen={isAddSessionOpen}
                onOpenChange={(open) => {
                    setIsAddSessionOpen(open);
                    if (!open) handleRefresh();
                }}
                currentDate={currentDate}
                onSessionCreated={handleRefresh}
            />

            {/* View Session Sheet */}
            <SessionSheet
                session={selectedSession}
                isOpen={isSheetOpen}
                onOpenChange={(open) => {
                    setIsSheetOpen(open);
                    if (!open) handleRefresh();
                }}
                onSessionUpdated={handleRefresh}
            />
        </div>
    );
}
