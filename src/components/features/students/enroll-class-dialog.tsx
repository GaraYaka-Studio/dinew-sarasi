'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClassesByGrade } from '@/lib/db/select';
import { enrollStudent } from '@/lib/db/insert';
import { Student } from '@/types/schema.types';

interface EnrollClassDialogProps {
    student: Student;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onEnrolled?: () => void;
}

interface ClassOption {
    id: string;
    name: string;
    grade: string;
    medium: 'sinhala' | 'english' | 'tamil';
    type: 'theory' | 'revision' | 'paper';
    monthlyFee: number;
    day: string | null;
    startTime: string | null;
    endTime: string | null;
    hallName: string | null;
    subjectName: string;
    teacherName: string | null;
    enrolled?: boolean;
}

const mediumColors: Record<string, string> = {
    sinhala: 'bg-red-100 text-red-700 hover:bg-red-200',
    english: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    tamil: 'bg-green-100 text-green-700 hover:bg-green-200',
};

const typeColors: Record<string, string> = {
    theory: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    revision: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    paper: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
};

export function EnrollClassDialog({
    student,
    isOpen,
    onOpenChange,
    onEnrolled,
}: EnrollClassDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [state, formAction, isPending] = useActionState(
        async (_prevState: unknown, formData: FormData) => {
            return enrollStudent(student.id, _prevState, formData);
        },
        { success: false, status: 500, error: null }
    );

    // Load classes when dialog opens
    useEffect(() => {
        if (isOpen && student.current_grade) {
            setIsLoading(true);
            getClassesByGrade(student.current_grade)
                .then((classes) => {
                    const transformed = classes.map((cls) => {
                        const dayName = cls.day
                            ? cls.day.charAt(0).toUpperCase() + cls.day.slice(1)
                            : 'TBD';

                        const time = cls.startTime && cls.endTime
                            ? `${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}`
                            : 'TBD';

                        return {
                            id: cls.id,
                            name: cls.name,
                            grade: cls.grade,
                            medium: cls.medium || 'sinhala',
                            type: cls.type || 'theory',
                            monthlyFee: Number(cls.monthlyFee),
                            day: cls.day,
                            startTime: cls.startTime,
                            endTime: cls.endTime,
                            hallName: cls.hallName,
                            subjectName: cls.subjectName,
                            teacherName: cls.teacherName || 'Not Assigned',
                            schedule: `${dayName}, ${time}`,
                        };
                    });
                    setAvailableClasses(transformed);
                })
                .catch((error) => {
                    console.error('Failed to load classes:', error);
                    setAvailableClasses([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, student.current_grade]);

    // Handle successful enrollment
    useEffect(() => {
        if (state.success) {
            onEnrolled?.();
            onOpenChange(false);
            // Reset form state
            setSelectedClassId(null);
        }
    }, [state.success, onEnrolled, onOpenChange]);

    const handleSubmit = (e: React.FormEvent) => {
        // Only prevent default and stop submission if no class is selected
        if (!selectedClassId) {
            e.preventDefault();
            return;
        }
        // If class is selected, let the form submit normally to the server action
    };

    const filteredClasses = availableClasses.filter(
        (cls) =>
            cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form action={formAction} onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Enroll in Class</DialogTitle>
                        <DialogDescription>
                            Select a class to enroll <strong>{student.full_name}</strong> in.
                            Showing classes for <strong>{student.current_grade}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Hidden input for selected class ID */}
                        <input type="hidden" name="classId" value={selectedClassId || ''} />

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by class name, subject, or teacher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-11 pl-10"
                            />
                        </div>

                        {/* Class List */}
                        {isLoading ? (
                            <div className="flex items-center justify-center p-12 text-muted-foreground">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                Loading classes...
                            </div>
                        ) : filteredClasses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
                                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <p className="text-center text-muted-foreground">
                                    {searchQuery
                                        ? 'No classes match your search'
                                        : `No classes available for ${student.current_grade}`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {filteredClasses.map((cls: any) => (
                                    <div
                                        key={cls.id}
                                        className={cn(
                                            'flex items-center justify-between rounded-lg border p-4 transition-colors cursor-pointer',
                                            selectedClassId === cls.id
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-muted/50'
                                        )}
                                        onClick={() => setSelectedClassId(cls.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="class"
                                                checked={selectedClassId === cls.id}
                                                onChange={() => setSelectedClassId(cls.id)}
                                                className="h-4 w-4"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">
                                                        {cls.name}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-xs', typeColors[cls.type])}
                                                    >
                                                        {cls.type}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-xs capitalize', mediumColors[cls.medium])}
                                                    >
                                                        {cls.medium}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {cls.schedule}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {cls.teacherName}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-medium text-foreground">
                                                        Rs. {cls.monthlyFee.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error Message */}
                        {state.error && (
                            <p className="text-sm text-destructive">{state.error as string}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedClassId || isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enrolling...
                                </>
                            ) : (
                                'Enroll Student'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').slice(0, 2).map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${period}`;
}
