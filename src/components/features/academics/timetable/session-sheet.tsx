'use client';

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
import { Calendar, Clock, MapPin, Trash2, Users } from 'lucide-react';

interface SessionSheetProps {
    session: ScheduleSession | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SessionSheet({
    session,
    isOpen,
    onOpenChange,
}: SessionSheetProps) {
    if (!session) return null;

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
                            <div className="text-sm">
                                <span className="block font-medium">Time</span>
                                <span className="text-xs text-muted-foreground">
                                    {session.startTime} - {session.endTime}
                                </span>
                            </div>
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
                            <Switch checked={session.status === 'cancelled'} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full">
                                Edit Time
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Users className="mr-2 h-4 w-4" />
                                Attendance
                            </Button>
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-8 sm:justify-start">
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Session
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
