'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScheduleSession } from '@/lib/mock-data';
import { Calendar, Clock, MapPin, Trash2, Users, Pencil } from 'lucide-react';
import { deleteSession, updateSession } from '@/lib/db/update';
import { toast } from 'sonner';

interface SessionSheetProps {
    session: ScheduleSession | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSessionUpdated?: () => void;
}

export function SessionSheet({
    session,
    isOpen,
    onOpenChange,
    onSessionUpdated,
}: SessionSheetProps) {
    const router = useRouter();
    const [isCancelled, setIsCancelled] = useState(session?.status === 'cancelled');
    const [isEditing, setIsEditing] = useState(false);
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');

    // Sync isCancelled state with session.status
    useEffect(() => {
        if (session) {
            setIsCancelled(session.status === 'cancelled');
        }
    }, [session]);

    if (!session) return null;

    // Format time from "08:00 AM" to "08:00" for input
    const formatTimeForInput = (timeStr: string) => {
        const [t, p] = timeStr.split(' ');
        const [hStr, mStr] = t.split(':');
        let h = parseInt(hStr, 10);
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${mStr}`;
    };

    const handleCancelToggle = async (checked: boolean) => {
        const formData = new FormData();
        formData.append('status', checked ? 'cancelled' : 'scheduled');
        const result = await updateSession(session.id, null, formData);

        if (result.success) {
            setIsCancelled(checked);
            toast.success(checked ? 'Session cancelled' : 'Session restored');
            onSessionUpdated?.();
        } else {
            toast.error(result.error || 'Failed to update session');
        }
    };

    const handleEditTime = () => {
        if (!isEditing) {
            setEditStartTime(formatTimeForInput(session.startTime));
            setEditEndTime(formatTimeForInput(session.endTime));
            setIsEditing(true);
        }
    };

    const handleSaveTime = async () => {
        const formData = new FormData();
        formData.append('startTime', editStartTime);
        formData.append('endTime', editEndTime);

        const result = await updateSession(session.id, null, formData);

        if (result.success) {
            toast.success('Session time updated');
            setIsEditing(false);
            onSessionUpdated?.();
        } else {
            toast.error(result.error || 'Failed to update session');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditStartTime('');
        setEditEndTime('');
    };

    const handleViewAttendance = () => {
        router.push(`/dashboard/attendance?sessionId=${session.id}`);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this session? This action cannot be undone.'
        );

        if (!confirmed) return;

        const formData = new FormData();
        const result = await deleteSession(session.id, null, formData);

        if (result.success) {
            toast.success('Session deleted');
            onOpenChange(false);
            onSessionUpdated?.();
        } else {
            toast.error(result.error || 'Failed to delete session');
        }
    };

    // Only allow deleting extra sessions
    const canDelete = session.status === 'extra';

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[400px]">
                <SheetHeader className="mb-6">
                    <SheetTitle>{session.subject}</SheetTitle>
                    <SheetDescription>
                        {session.grade} • {session.medium} Media
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Key Details */}
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                <span className="block font-medium">Date</span>
                                <span className="text-xs text-muted-foreground">
                                    {session.date}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm flex-1">
                                <span className="block font-medium">Time</span>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="time"
                                            value={editStartTime}
                                            onChange={(e) => setEditStartTime(e.target.value)}
                                            className="border rounded px-2 py-1 text-xs"
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <input
                                            type="time"
                                            value={editEndTime}
                                            onChange={(e) => setEditEndTime(e.target.value)}
                                            className="border rounded px-2 py-1 text-xs"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        {session.startTime} - {session.endTime}
                                    </span>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2"
                                        onClick={handleSaveTime}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2"
                                    onClick={handleEditTime}
                                >
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                <span className="block font-medium">
                                    Location
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {session.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Cancelled</Label>
                                <p className="text-xs text-muted-foreground">
                                    Mark this specific session as cancelled.
                                </p>
                            </div>
                            <Switch
                                checked={isCancelled}
                                onCheckedChange={handleCancelToggle}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleEditTime}
                                disabled={isCancelled}
                            >
                                Edit Time
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleViewAttendance}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Attendance
                            </Button>
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-8 sm:justify-start">
                    {canDelete && (
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Session
                        </Button>
                    )}
                    {!canDelete && (
                        <p className="text-xs text-muted-foreground w-full text-center">
                            Only extra sessions can be deleted
                        </p>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
