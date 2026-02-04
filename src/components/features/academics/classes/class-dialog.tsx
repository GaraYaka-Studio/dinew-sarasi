'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Clock, User, Banknote, BookOpen } from 'lucide-react';

interface ClassDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ClassDialog({ isOpen, onOpenChange }: ClassDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[95vh] max-h-[900px] w-full max-w-2xl flex-col p-0 sm:h-auto">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>
                        Set up a new class schedule, assign a teacher, and
                        define fees.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form
                        id="create-class-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Section 1: Subject Info */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                <BookOpen className="h-4 w-4" /> Subject Details
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="grade">Grade</Label>
                                    <Select>
                                        <SelectTrigger id="grade">
                                            <SelectValue placeholder="Select Grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gr6">
                                                Grade 6
                                            </SelectItem>
                                            <SelectItem value="gr7">
                                                Grade 7
                                            </SelectItem>
                                            <SelectItem value="gr8">
                                                Grade 8
                                            </SelectItem>
                                            <SelectItem value="gr9">
                                                Grade 9
                                            </SelectItem>
                                            <SelectItem value="gr10">
                                                Grade 10
                                            </SelectItem>
                                            <SelectItem value="gr11">
                                                Grade 11
                                            </SelectItem>
                                            <SelectItem value="al">
                                                Advanced Level
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select>
                                        <SelectTrigger id="subject">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="math">
                                                Mathematics
                                            </SelectItem>
                                            <SelectItem value="sci">
                                                Science
                                            </SelectItem>
                                            <SelectItem value="eng">
                                                English
                                            </SelectItem>
                                            <SelectItem value="hist">
                                                History
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="medium">Medium</Label>
                                    <Select defaultValue="sinhala">
                                        <SelectTrigger id="medium">
                                            <SelectValue placeholder="Select Medium" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sinhala">
                                                Sinhala
                                            </SelectItem>
                                            <SelectItem value="english">
                                                English
                                            </SelectItem>
                                            <SelectItem value="tamil">
                                                Tamil
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Class Type</Label>
                                    <Select defaultValue="theory">
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="theory">
                                                Theory
                                            </SelectItem>
                                            <SelectItem value="revision">
                                                Revision
                                            </SelectItem>
                                            <SelectItem value="paper">
                                                Paper Class
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Logistics */}
                        <div className="space-y-4 border-t pt-2">
                            <h3 className="mt-2 flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                <User className="h-4 w-4" /> Teacher & Fees
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="teacher">Teacher</Label>
                                    <Select>
                                        <SelectTrigger id="teacher">
                                            <SelectValue placeholder="Select Teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="t1">
                                                Mr. Kamal Perera
                                            </SelectItem>
                                            <SelectItem value="t2">
                                                Ms. S. Silva
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fee">
                                        Monthly Fee (LKR)
                                    </Label>
                                    <div className="relative">
                                        <Banknote className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fee"
                                            type="number"
                                            placeholder="2500"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Schedule */}
                        <div className="space-y-4 border-t pt-2">
                            <h3 className="mt-2 flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                <Clock className="h-4 w-4" /> Schedule
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="day">Day</Label>
                                    <Select>
                                        <SelectTrigger id="day">
                                            <SelectValue placeholder="Select Day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mon">
                                                Monday
                                            </SelectItem>
                                            <SelectItem value="tue">
                                                Tuesday
                                            </SelectItem>
                                            <SelectItem value="wed">
                                                Wednesday
                                            </SelectItem>
                                            <SelectItem value="thu">
                                                Thursday
                                            </SelectItem>
                                            <SelectItem value="fri">
                                                Friday
                                            </SelectItem>
                                            <SelectItem value="sat">
                                                Saturday
                                            </SelectItem>
                                            <SelectItem value="sun">
                                                Sunday
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start-time">
                                        Start Time
                                    </Label>
                                    <Input id="start-time" type="time" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-time">End Time</Label>
                                    <Input id="end-time" type="time" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="gap-2 border-t px-6 py-4 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-class-form"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Class'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
