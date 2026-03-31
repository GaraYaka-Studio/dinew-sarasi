'use client';

import {
    useState,
    useEffect,
    useActionState,
    useEffectEvent,
    useMemo,
} from 'react';

import { addClass } from '@/lib/db/insert';
import { getSubjects, getTeachers } from '@/lib/db/select';

import { Subject, Teacher } from '@/types/schema.types';

import { DAYS, GRADES } from '@/lib/constants';

import { toast } from 'sonner';
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
    onClassAdded?: () => void;
}

export function ClassDialog({
    isOpen,
    onOpenChange,
    onClassAdded,
}: ClassDialogProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        medium: 'sinhala',
        type: 'theory',
        subjectId: '',
        teacherId: '',
        day: '',
        startTime: '',
        endTime: '',
        hallName: '',
        monthlyFee: '',
    });

    const clearForm = useEffectEvent(() => {
        setFormData({
            name: '',
            grade: '',
            medium: 'sinhala',
            type: 'theory',
            subjectId: '',
            teacherId: '',
            day: '',
            startTime: '',
            endTime: '',
            hallName: '',
            monthlyFee: '',
        });
    });

    const loading = useEffectEvent(() => {
        setIsLoadingData(true);
    });

    const notLoading = useEffectEvent(() => {
        setIsLoadingData(false);
    });

    const completeAdd = useEffectEvent(() => {
        onOpenChange(false);
        onClassAdded?.();
    });

    // Load subjects and teachers when dialog opens
    useEffect(() => {
        if (isOpen) {
            loading();
            getSubjects().then(setSubjects);
            getTeachers().then(setTeachers);
            notLoading();
        }
    }, [isOpen]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) clearForm();
    }, [isOpen]);

    const [state, formAction, pending] = useActionState(addClass, {
        success: false,
        status: 0,
        error: null,
    });

    // Handle success/error
    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Class created successfully');
            completeAdd();
        }
    }, [state]);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Auto-generate class name from subject and grade
    const classNameGen = useMemo(() => {
        const subject = subjects.find((s) => s.id === formData.subjectId);
        if (subject) return `${subject.name} - ${formData.grade}`;
        return '';
    }, [formData.subjectId, formData.grade, subjects]);

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

                {isLoadingData ? (
                    <div className="flex flex-1 items-center justify-center p-12">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <form
                                id="create-class-form"
                                action={formAction}
                                className="space-y-6"
                            >
                                {/* Section 1: Subject Info */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                        <BookOpen className="h-4 w-4" /> Subject
                                        Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="grade">Grade</Label>
                                            <Select
                                                name="grade"
                                                value={formData.grade}
                                                onValueChange={(value) =>
                                                    updateField('grade', value)
                                                }
                                            >
                                                <SelectTrigger id="grade">
                                                    <SelectValue placeholder="Select Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GRADES.map((grade) => (
                                                        <SelectItem
                                                            key={grade}
                                                            value={grade}
                                                        >
                                                            {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">
                                                Subject
                                            </Label>
                                            <Select
                                                name="subject"
                                                value={formData.subjectId}
                                                onValueChange={(value) =>
                                                    updateField(
                                                        'subjectId',
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="subject">
                                                    <SelectValue placeholder="Select Subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((subject) => (
                                                        <SelectItem
                                                            key={subject.id}
                                                            value={subject.id}
                                                        >
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="medium">
                                                Medium
                                            </Label>
                                            <Select
                                                name="medium"
                                                value={formData.medium}
                                                onValueChange={(value) =>
                                                    updateField('medium', value)
                                                }
                                            >
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
                                            <Label htmlFor="type">
                                                Class Type
                                            </Label>
                                            <Select
                                                name="type"
                                                value={formData.type}
                                                onValueChange={(value) =>
                                                    updateField('type', value)
                                                }
                                            >
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

                                    {/* Auto-generated class name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Class Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={classNameGen}
                                            onChange={(e) =>
                                                updateField(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Auto-generated from subject and grade"
                                        />
                                    </div>
                                </div>

                                {/* Section 2: Logistics */}
                                <div className="space-y-4 border-t pt-2">
                                    <h3 className="mt-2 flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                        <User className="h-4 w-4" /> Teacher &
                                        Fees
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="teacher">
                                                Teacher
                                            </Label>
                                            <Select
                                                name="teacher"
                                                value={formData.teacherId}
                                                onValueChange={(value) =>
                                                    updateField(
                                                        'teacherId',
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="teacher">
                                                    <SelectValue placeholder="Select Teacher" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachers.map((teacher) => (
                                                        <SelectItem
                                                            key={teacher.id}
                                                            value={teacher.id}
                                                        >
                                                            {teacher.name}
                                                        </SelectItem>
                                                    ))}
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
                                                    name="fee"
                                                    type="number"
                                                    placeholder="2500"
                                                    className="pl-9"
                                                    value={formData.monthlyFee}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'monthlyFee',
                                                            e.target.value
                                                        )
                                                    }
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
                                            <Select
                                                name="day"
                                                value={formData.day}
                                                onValueChange={(value) =>
                                                    updateField('day', value)
                                                }
                                            >
                                                <SelectTrigger id="day">
                                                    <SelectValue placeholder="Select Day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DAYS.map((day) => (
                                                        <SelectItem
                                                            key={day.value}
                                                            value={day.value}
                                                        >
                                                            {day.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="start-time">
                                                Start Time
                                            </Label>
                                            <Input
                                                id="start-time"
                                                name="startTime"
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) =>
                                                    updateField(
                                                        'startTime',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end-time">
                                                End Time
                                            </Label>
                                            <Input
                                                id="end-time"
                                                name="endTime"
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) =>
                                                    updateField(
                                                        'endTime',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hall">
                                            Hall Name (Optional)
                                        </Label>
                                        <Input
                                            id="hall"
                                            name="hallName"
                                            placeholder="e.g., Hall A, Room 101"
                                            value={formData.hallName}
                                            onChange={(e) =>
                                                updateField(
                                                    'hallName',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}

                <DialogFooter className="gap-2 border-t px-6 py-4 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={pending || isLoadingData}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-class-form"
                        disabled={pending || isLoadingData}
                    >
                        {pending ? 'Creating...' : 'Create Class'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
