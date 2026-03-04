'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { getActiveClassesForSession, checkConflicts } from '@/lib/db/timetable';
import { createSession } from '@/lib/db/insert';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SessionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentDate: Date;
    onSessionCreated?: () => void;
}

type ClassOption = {
    id: string;
    name: string;
    grade: string;
    medium: string;
    type: string;
    subjectName: string;
    teacherName: string;
};

export function SessionDialog({
    isOpen,
    onOpenChange,
    currentDate,
    onSessionCreated,
}: SessionDialogProps) {
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('10:00');
    const [hallName, setHallName] = useState('Hall A');
    const [conflict, setConflict] = useState<string | null>(null);
    const [allowOverride, setAllowOverride] = useState(false);
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load active classes when dialog opens
    useEffect(() => {
        if (isOpen) {
            loadClasses();
        }
    }, [isOpen]);

    const loadClasses = async () => {
        try {
            const data = await getActiveClassesForSession();
            setClasses(data as ClassOption[]);
        } catch (error) {
            console.error('Failed to load classes:', error);
            toast.error('Failed to load classes');
        }
    };

    // Check for conflicts when inputs change
    useEffect(() => {
        const checkForConflicts = async () => {
            if (!selectedClassId || !startTime || !endTime) {
                setConflict(null);
                return;
            }

            setIsCheckingConflicts(true);
            try {
                const selectedClass = classes.find((c) => c.id === selectedClassId);
                if (!selectedClass) {
                    setConflict(null);
                    return;
                }

                const conflicts = await checkConflicts({
                    classId: selectedClassId,
                    date: format(currentDate, 'yyyy-MM-dd'),
                    startTime,
                    endTime,
                    hallName,
                });

                if (conflicts && conflicts.length > 0) {
                    const c = conflicts[0];
                    const reason = c.grade === selectedClass.grade
                        ? `${c.grade} already has '${c.className}'`
                        : `${c.hallName} is booked for '${c.className}'`;
                    setConflict(`Conflict Detected: ${reason} from ${c.startTime} - ${c.endTime}.`);
                } else {
                    setConflict(null);
                }
            } catch (error) {
                console.error('Failed to check conflicts:', error);
            } finally {
                setIsCheckingConflicts(false);
            }
        };

        const timeoutId = setTimeout(checkForConflicts, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedClassId, startTime, endTime, hallName, classes, currentDate]);

    const handleSubmit = async (formData: FormData) => {
        if (!selectedClassId) {
            toast.error('Please select a class');
            return;
        }

        if (conflict && !allowOverride) {
            toast.error('Please resolve conflicts or allow overlapping');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createSession(null, null, formData);

            if (result.success) {
                toast.success('Session created successfully');
                // Reset form
                setSelectedClassId('');
                setStartTime('08:00');
                setEndTime('10:00');
                setHallName('Hall A');
                setConflict(null);
                setAllowOverride(false);
                // Close dialog and refresh
                onOpenChange(false);
                onSessionCreated?.();
            } else {
                toast.error(result.error || 'Failed to create session');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedClass = classes.find((c) => c.id === selectedClassId);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Class Session</DialogTitle>
                    <DialogDescription>
                        Schedule a new class. Conflicts will be checked automatically.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Class Select */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="classId" className="text-right">
                                Class
                            </Label>
                            <Select
                                name="classId"
                                value={selectedClassId}
                                onValueChange={setSelectedClassId}
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select class..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.subjectName} - {cls.grade} ({cls.medium})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date (Read Only) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Date</Label>
                            <Input
                                value={format(currentDate, 'EEEE, MMM d, yyyy')}
                                disabled
                                className="col-span-3"
                            />
                            {/* Hidden input with actual date value for form submission */}
                            <input
                                type="hidden"
                                name="date"
                                value={format(currentDate, 'yyyy-MM-dd')}
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Time</Label>
                            <div className="col-span-3 flex items-center gap-2">
                                <Input
                                    name="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="flex-1"
                                />
                                <span className="text-muted-foreground">-</span>
                                <Input
                                    name="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        {/* Hall */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hallName" className="text-right">
                                Hall
                            </Label>
                            <Input
                                id="hallName"
                                name="hallName"
                                value={hallName}
                                onChange={(e) => setHallName(e.target.value)}
                                placeholder="e.g., Hall A, Main Hall, Room 101"
                                className="col-span-3"
                            />
                        </div>

                        {/* Conflict Alert */}
                        {conflict && (
                            <div className="col-span-4 mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                                    <div className="space-y-2">
                                        <p className="font-medium">{conflict}</p>

                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="override"
                                                checked={allowOverride}
                                                onCheckedChange={(c) =>
                                                    setAllowOverride(!!c)
                                                }
                                            />
                                            <label
                                                htmlFor="override"
                                                className="text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Allow overlapping (Subject Buckets / Split)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading indicator for conflict checking */}
                        {isCheckingConflicts && (
                            <div className="col-span-4 text-sm text-muted-foreground">
                                Checking for conflicts...
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !!conflict}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Session'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
