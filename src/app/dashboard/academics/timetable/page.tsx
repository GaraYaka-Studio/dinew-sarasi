'use client';

import { useState } from 'react';
import { TimetableHeader } from '@/components/features/academics/timetable/timetable-header';
import { DateTabs } from '@/components/features/academics/timetable/date-tabs';
import { ScheduleList } from '@/components/features/academics/timetable/schedule-list';
import { SessionDialog } from '@/components/features/academics/timetable/session-dialog';
import { SessionSheet } from '@/components/features/academics/timetable/session-sheet';
import { MOCK_TIMETABLE, ScheduleSession } from '@/lib/mock-data';

export default function TimetablePage() {
    // Current date state - defaulting to mock data start date for demo
    // In real app, this would default to new Date()
    const [currentDate, setCurrentDate] = useState(new Date('2026-02-12'));
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    
    // Sheet State
    const [selectedSession, setSelectedSession] = useState<ScheduleSession | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Filter sessions for selected date
    // Note: This is simplistic filtering. Real app would use easier date comparison/querying
    const selectedDateStr = currentDate.toISOString().split('T')[0];
    const filteredSessions = MOCK_TIMETABLE.filter(
        (session) => session.date === selectedDateStr
    );

    const handleViewSession = (session: ScheduleSession) => {
        setSelectedSession(session);
        setIsSheetOpen(true);
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
            <DateTabs
                currentDate={currentDate}
                onDateChange={setCurrentDate}
            />

            {/* Main Schedule List */}
            <div className="flex-1">
                <ScheduleList 
                    sessions={filteredSessions} 
                    onView={(session) => handleViewSession(session)} // This will be passed to ScheduleCard
                />
            </div>

            {/* Add Session Dialog */}
            <SessionDialog
                isOpen={isAddSessionOpen}
                onOpenChange={setIsAddSessionOpen}
                currentDate={currentDate}
            />

            {/* View Session Sheet */}
            <SessionSheet
                session={selectedSession}
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}
