'use client';

import { useState } from 'react';
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
import { MOCK_TIMETABLE } from '@/lib/mock-data';
import { format } from 'date-fns';

interface SessionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentDate: Date;
}

export function SessionDialog({
    isOpen,
    onOpenChange,
    currentDate,
}: SessionDialogProps) {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('10:00');
    const [hall, setHall] = useState('Hall A');

    // Derived state for mock conflict detection
    // In a real app, this would be a server action or async query
    const [allowOverride, setAllowOverride] = useState(false);

    // Format helper for mock data time strings "08:00 AM" to 24h min
    const parseMinutes24 = (timeStr: string) => {
        const [t, p] = timeStr.split(' ');
        const [hStr, mStr] = t.split(':');
        let h = Number(hStr);
        const m = Number(mStr);
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    };

    const subjects = [
        { id: 'sub1', name: 'Combined Maths', grade: 'Grade 12' },
        { id: 'sub2', name: 'Physics', grade: 'Grade 13' },
        { id: 'sub3', name: 'Chemistry', grade: 'Grade 12' },
        { id: 'sub4', name: 'Biology', grade: 'Grade 11' },
    ];

    // Conflict Calculation (Derived State)
    // We calculate this during render. It's fast enough.
    const conflict = (() => {
        if (!selectedSubject || !startTime || !endTime) return null;

        const subject = subjects.find((s) => s.id === selectedSubject);
        if (!subject) return null;

        // Convert times to minutes for comparison
        const parseMinutes = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const startMins = parseMinutes(startTime);
        const endMins = parseMinutes(endTime);
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        // Check against MOCK_TIMETABLE
        const conflicts = MOCK_TIMETABLE.filter((session) => {
            if (session.date !== dateStr) return false;

            const sessionStart = parseMinutes24(session.startTime);
            const sessionEnd = parseMinutes24(session.endTime);

            const isTimeOverlap =
                startMins < sessionEnd && endMins > sessionStart;

            if (!isTimeOverlap) return false;
            // Check Grade or Location
            if (session.grade === subject.grade) return true;
            if (session.location === hall) return true;

            return false;
        });

        if (conflicts.length > 0) {
            const c = conflicts[0];
            const reason =
                c.grade === subject.grade
                    ? `${c.grade} already has '${c.subject}'`
                    : `${c.location} is booked for '${c.subject}'`;
            return `Conflict Detected: ${reason} from ${c.startTime} - ${c.endTime}.`;
        }
        return null;
    })();

    const handleSave = () => {
        // Here we would call an action to save
        console.log('Saved session');
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Class Session</DialogTitle>
                    <DialogDescription>
                        Schedule a new class. Conflicts will be checked
                        automatically.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Class Select */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Class
                        </Label>
                        <Select
                            onValueChange={setSelectedSubject}
                            value={selectedSubject}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select class..." />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((sub) => (
                                    <SelectItem key={sub.id} value={sub.id}>
                                        {sub.name} - {sub.grade}
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
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Time</Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="flex-1"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Hall */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hall" className="text-right">
                            Hall
                        </Label>
                        <Select onValueChange={setHall} value={hall}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select hall" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Hall A">
                                    Hall A (Main)
                                </SelectItem>
                                <SelectItem value="Hall B">
                                    Hall B (Science)
                                </SelectItem>
                                <SelectItem value="Hall C">Hall C</SelectItem>
                            </SelectContent>
                        </Select>
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
                                            Allow overlapping (Subject Buckets /
                                            Split)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!!conflict && !allowOverride}
                    >
                        Save Session
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
