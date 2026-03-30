'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Users, Info } from 'lucide-react';
import { cn, calculateBatchYear } from '@/lib/utils';
import { getClassesByGrade } from '@/lib/db/select';

interface StepAcademicProps {
    formData: {
        grade: string;
        batch: string;
        selectedClasses: string[];
    };
    onUpdate: (field: string, value: string | string[]) => void;
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
    schedule: string;
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

export function StepAcademic({ formData, onUpdate }: StepAcademicProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Track previous grade for batch update only
    const prevGradeForBatchRef = useRef<string | null>(null);
    const isLoadingRef = useRef(false);

    // Load classes when grade changes
    useEffect(() => {
        // Skip if already loading
        if (isLoadingRef.current) return;

        // Update batch when grade actually changes
        if (formData.grade && formData.grade !== prevGradeForBatchRef.current) {
            prevGradeForBatchRef.current = formData.grade;
            const batch = calculateBatchYear(formData.grade);
            // Defer update to avoid synchronous setState
            const timeoutId = setTimeout(() => {
                onUpdate('batch', batch.display);
            }, 0);

            return () => clearTimeout(timeoutId);
        }

        // Load classes for the selected grade
        if (formData.grade) {
            isLoadingRef.current = true;
            // Defer loading to avoid synchronous setState
            const timeoutId = setTimeout(() => {
                setIsLoading(true);
                getClassesByGrade(formData.grade)
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
                        isLoadingRef.current = false;
                    });
            }, 0);

            return () => clearTimeout(timeoutId);
        } else {
            // Defer setState in else branch
            const timeoutId = setTimeout(() => setAvailableClasses([]), 0);
            return () => clearTimeout(timeoutId);
        }
    }, [formData.grade, onUpdate]);

    const toggleClass = (classId: string) => {
        const current = formData.selectedClasses || [];
        const updated = current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId];
        onUpdate('selectedClasses', updated);
    };

    const filteredClasses = availableClasses.filter(
        (cls) =>
            cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCount = formData.selectedClasses?.length || 0;
    const totalMonthlyFee = availableClasses
        .filter(c => formData.selectedClasses?.includes(c.id))
        .reduce((sum, c) => sum + c.monthlyFee, 0);

    return (
        <div className="space-y-6">
            {/* Academic Information */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Academic Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="grade">Grade *</Label>
                        <select
                            id="grade"
                            value={formData.grade}
                            onChange={(e) => onUpdate('grade', e.target.value)}
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select grade...</option>
                            <option value="Grade 1">Grade 1</option>
                            <option value="Grade 2">Grade 2</option>
                            <option value="Grade 3">Grade 3</option>
                            <option value="Grade 4">Grade 4</option>
                            <option value="Grade 5">Grade 5</option>
                            <option value="Grade 6">Grade 6</option>
                            <option value="Grade 7">Grade 7</option>
                            <option value="Grade 8">Grade 8</option>
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                            <option value="Grade 13">Grade 13</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="batch">Batch (Auto-calculated) *</Label>
                        <Input
                            id="batch"
                            value={formData.batch}
                            onChange={(e) => onUpdate('batch', e.target.value)}
                            className="h-11"
                            placeholder="Auto-calculated from grade"
                        />
                        <p className="text-xs text-muted-foreground">
                            Automatically calculated based on grade. Can be edited if needed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Class Enrollment */}
            <div>
                <div className="mb-4">
                    <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                        Class Enrollment
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select classes for <strong>{formData.grade || 'Selected Grade'}</strong>
                    </p>
                </div>

                {/* Search */}
                {availableClasses.length > 0 && (
                    <div className="relative mb-4">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search classes by name, subject, or teacher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-10"
                        />
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center p-12 text-muted-foreground">
                        Loading classes...
                    </div>
                ) : !formData.grade ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
                        <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-center text-muted-foreground">
                            Please select a grade first to see available classes
                        </p>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
                        <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-center text-muted-foreground">
                            No classes available for {formData.grade}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredClasses.map((cls) => (
                            <Card
                                key={cls.id}
                                className={cn(
                                    'transition-all hover:shadow-md cursor-pointer',
                                    formData.selectedClasses?.includes(cls.id)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted'
                                )}
                                onClick={() => toggleClass(cls.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id={`class-${cls.id}`}
                                            checked={
                                                formData.selectedClasses?.includes(cls.id) || false
                                            }
                                            onChange={() => toggleClass(cls.id)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <label
                                                    htmlFor={`class-${cls.id}`}
                                                    className="font-medium cursor-pointer"
                                                >
                                                    {cls.name}
                                                </label>
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
                                            <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground mt-2">
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
                                                    Rs. {cls.monthlyFee.toLocaleString()}/month
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Selection Summary */}
                {selectedCount > 0 && (
                    <Card className="mt-4 border-primary/50 bg-primary/5">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {selectedCount} class{selectedCount > 1 ? 'es' : ''} selected
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Total monthly fees: Rs. {totalMonthlyFee.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
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
