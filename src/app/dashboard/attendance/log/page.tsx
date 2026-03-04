'use client';

import { useState, useEffect } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { AttendanceLogHeader } from '@/components/features/attendance/log/attendance-log-header';
import { DateTabs } from '@/components/features/academics/timetable/date-tabs';
import {
    getAttendanceLogByDate,
    deleteAttendanceRecord,
    type AttendanceLogSession,
} from '@/lib/db/attendance';
import { format } from 'date-fns';
import { getCurrentDate } from '@/lib/utils/time';

export default function AttendanceLogPage() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [sessions, setSessions] = useState<AttendanceLogSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        attendanceId: string;
        studentName: string;
    }>({
        isOpen: false,
        attendanceId: '',
        studentName: '',
    });

    // Load attendance when date changes
    useEffect(() => {
        loadAttendance();
    }, [currentDate]);

    const loadAttendance = async () => {
        setIsLoading(true);
        try {
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            const data = await getAttendanceLogByDate(formattedDate);
            setSessions(data);
        } catch (error) {
            console.error('Failed to load attendance:', error);
            toast.error('Failed to load attendance records');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (studentName: string, attendanceId: string) => {
        setDeleteDialog({
            isOpen: true,
            attendanceId,
            studentName,
        });
    };

    const handleDeleteConfirm = async () => {
        const { attendanceId, studentName } = deleteDialog;

        try {
            const result = await deleteAttendanceRecord(attendanceId);

            if (result.success) {
                toast.success(`Deleted attendance for ${studentName}`);
                loadAttendance(); // Refresh
            } else {
                toast.error('Failed to delete', {
                    description: result.error || 'An error occurred',
                });
            }
        } catch (error) {
            console.error('Failed to delete attendance:', error);
            toast.error('Failed to delete attendance record');
        } finally {
            setDeleteDialog({ isOpen: false, attendanceId: '', studentName: '' });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex h-full flex-col space-y-6">
            {/* Header with Week Navigator */}
            <AttendanceLogHeader
                currentDate={currentDate}
                onDateChange={setCurrentDate}
            />

            {/* Date Tabs */}
            <DateTabs currentDate={currentDate} onDateChange={setCurrentDate} />

            {/* Main Content */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">Loading attendance...</p>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="mx-auto max-w-4xl">
                        <Accordion type="single" collapsible className="space-y-4">
                            {sessions.map((classSession) => (
                                <AccordionItem
                                    key={classSession.id}
                                    value={classSession.id}
                                    className="overflow-hidden rounded-lg border bg-card"
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                                        <div className="flex w-full items-center justify-between pr-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-base font-semibold">
                                                    {classSession.className}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {classSession.time}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="default"
                                                className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                                            >
                                                {classSession.totalPresent} Present
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="px-6 pb-4">
                                        <ScrollArea className="h-100">
                                            <div className="space-y-2 pr-4">
                                                {classSession.students.map((student) => (
                                                    <div
                                                        key={student.id}
                                                        className="flex items-center justify-between rounded-md border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                                                    >
                                                        {/* Scan Time */}
                                                        <div className="w-20 text-sm text-muted-foreground">
                                                            {student.scanTime}
                                                        </div>

                                                        {/* Student Info */}
                                                        <div className="flex flex-1 items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={student.avatarUrl ?? undefined} />
                                                                <AvatarFallback className="text-xs">
                                                                    {getInitials(student.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">
                                                                    {student.name}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {student.studentId}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Delete Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => handleDeleteClick(student.name, student.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ) : (
                    // Empty State
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">
                                No records found
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                No attendance records for the selected date.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Attendance Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete attendance for{' '}
                            <strong>{deleteDialog.studentName}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
