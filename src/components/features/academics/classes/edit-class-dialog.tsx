'use client';

import {
    useState,
    useEffect,
    useActionState,
    useEffectEvent,
    useMemo,
} from 'react';

import { updateClass } from '@/lib/db/update';
import { getSubjects, getTeachers } from '@/lib/db/select';

import { Subject, Teacher } from '@/types/schema.types';
import { ClassItem } from '@/lib/mock-data-classes';
import { ClassWithDetails } from '@/lib/db/transformers';

import { DAYS, GRADES } from '@/lib/constants';

import { toast } from 'sonner';
import { Clock, User, Banknote, BookOpen } from 'lucide-react';
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

interface EditClassDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    classItem: ClassItem | null;
    classData: ClassWithDetails | null;
    onClassUpdated?: () => void;
}

export function EditClassDialog({
    isOpen,
    onOpenChange,
    classItem,
    classData,
    onClassUpdated,
}: EditClassDialogProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Form state - initialized from classData (raw database data)
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

    const populateForm = useEffectEvent(() => {
        setFormData({
            name: classData?.name ?? '',
            grade: classData?.grade ?? '',
            medium: classData?.medium ?? 'sinhala',
            type: classData?.type ?? 'theory',
            subjectId: classData?.subjectId ?? '',
            teacherId: classData?.teacherId ?? '',
            day: classData?.day ?? '',
            startTime: classData?.startTime ?? '',
            endTime: classData?.endTime ?? '',
            hallName: classData?.hallName ?? '',
            monthlyFee: classData?.monthlyFee ?? '',
        });
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
        onClassUpdated?.();
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

    // Pre-populate form from classData (raw database data)
    useEffect(() => {
        if (classData && isOpen) populateForm();

        // Reset form when dialog closes
        if (!isOpen) clearForm();
    }, [classData, isOpen]);

    // Bind updateClass with form data
    const updateClassBound = classItem
        ? updateClass.bind(null, classItem.id, {
            ...formData,
            isActive: classItem.status === 'Active',
        })
        : null;
    const [state, formAction, pending] = useActionState(
        updateClassBound ||
        (() => ({ success: false, status: 0, error: null })),
        { success: false, status: 0, error: null }
    );

    // Handle success/error
    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Class updated successfully');
            completeAdd();
        }
    }, [state]);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const classNameGen = useMemo(() => {
        const subject = subjects.find((s) => s.id === formData.subjectId);
        if (subject) return `${subject.name} - ${formData.grade}`;
        return '';
    }, [formData.subjectId, formData.grade, subjects]);

    if (!classItem) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[95vh] max-h-[900px] w-full max-w-2xl flex-col p-0 sm:h-auto">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Edit Class</DialogTitle>
                    <DialogDescription>
                        Update information for {classItem.subject} - {classItem.grade}
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
                                id="edit-class-form"
                                action={formAction}
                                className="space-y-6"
                            >
                                {/* Section 1: Subject Info */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                        <BookOpen className="h-4 w-4" /> Subject Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-grade">Grade</Label>
                                            <Select
                                                value={formData.grade}
                                                onValueChange={(value) => updateField('grade', value)}
                                                name="grade"
                                            >
                                                <SelectTrigger id="edit-grade">
                                                    <SelectValue placeholder="Select Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GRADES.map((grade) => (
                                                        <SelectItem key={grade} value={grade}>
                                                            {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-subject">Subject</Label>
                                            <Select
                                                value={formData.subjectId}
                                                onValueChange={(value) => updateField('subjectId', value)}
                                                name="subject"
                                            >
                                                <SelectTrigger id="edit-subject">
                                                    <SelectValue placeholder="Select Subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-medium">Medium</Label>
                                            <Select
                                                value={formData.medium}
                                                onValueChange={(value) => updateField('medium', value)}
                                                name="medium"
                                            >
                                                <SelectTrigger id="edit-medium">
                                                    <SelectValue placeholder="Select Medium" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sinhala">Sinhala</SelectItem>
                                                    <SelectItem value="english">English</SelectItem>
                                                    <SelectItem value="tamil">Tamil</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-type">Class Type</Label>
                                            <Select
                                                value={formData.type}
                                                onValueChange={(value) => updateField('type', value)}
                                                name="type"
                                            >
                                                <SelectTrigger id="edit-type">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="theory">Theory</SelectItem>
                                                    <SelectItem value="revision">Revision</SelectItem>
                                                    <SelectItem value="paper">Paper Class</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Class Name</Label>
                                        <Input
                                            id="edit-name"
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

                                {/* Section 2: Teacher & Fees */}
                                <div className="space-y-4 border-t pt-2">
                                    <h3 className="mt-2 flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                        <User className="h-4 w-4" /> Teacher & Fees
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-teacher">Teacher</Label>
                                            <Select
                                                value={formData.teacherId}
                                                onValueChange={(value) => updateField('teacherId', value)}
                                                name="teacher"
                                            >
                                                <SelectTrigger id="edit-teacher">
                                                    <SelectValue placeholder="Select Teacher" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachers.map((teacher) => (
                                                        <SelectItem key={teacher.id} value={teacher.id}>
                                                            {teacher.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-fee">Monthly Fee (LKR)</Label>
                                            <div className="relative">
                                                <Banknote className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="edit-fee"
                                                    type="number"
                                                    placeholder="2500"
                                                    className="pl-9"
                                                    value={formData.monthlyFee}
                                                    onChange={(e) => updateField('monthlyFee', e.target.value)}
                                                    name="fee"
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
                                            <Label htmlFor="edit-day">Day</Label>
                                            <Select
                                                value={formData.day}
                                                onValueChange={(value) => updateField('day', value)}
                                                name="day"
                                            >
                                                <SelectTrigger id="edit-day">
                                                    <SelectValue placeholder="Select Day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DAYS.map((day) => (
                                                        <SelectItem key={day.value} value={day.value}>
                                                            {day.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-start-time">Start Time</Label>
                                            <Input
                                                id="edit-start-time"
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => updateField('startTime', e.target.value)}
                                                name="startTime"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-end-time">End Time</Label>
                                            <Input
                                                id="edit-end-time"
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => updateField('endTime', e.target.value)}
                                                name="endTime"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-hall">Hall Name (Optional)</Label>
                                        <Input
                                            id="edit-hall"
                                            placeholder="e.g., Hall A, Room 101"
                                            value={formData.hallName}
                                            onChange={(e) => updateField('hallName', e.target.value)}
                                            name="hallName"
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
                        form="edit-class-form"
                        disabled={pending || isLoadingData}
                    >
                        {pending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
