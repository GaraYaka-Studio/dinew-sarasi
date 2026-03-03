'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, DollarSign, Gift, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClassesByGrade } from '@/lib/db/select';

interface StepPaymentProps {
    formData: {
        grade: string;          // Need grade to query classes
        selectedClasses: string[];
        paymentMode: 'later' | 'now' | 'free';
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

export function StepPayment({ formData, onUpdate }: StepPaymentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load classes when grade changes
    useEffect(() => {
        if (formData.grade) {
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
                });
        } else {
            setAvailableClasses([]);
        }
    }, [formData.grade]);

    const toggleClass = (classId: string) => {
        const current = formData.selectedClasses || [];
        const updated = current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId];
        onUpdate('selectedClasses', updated);
    };

    const selectPaymentMode = (mode: 'later' | 'now' | 'free') => {
        onUpdate('paymentMode', mode);
    };

    const filteredClasses = availableClasses.filter(
        (cls) =>
            cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Class Selection */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Select Classes to Enroll
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Showing available classes for <strong>{formData.grade || 'Selected Grade'}</strong>
                </p>

                <div className="relative mb-4">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search classes by name, subject, or teacher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 pl-10"
                    />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center p-12 text-muted-foreground">
                        Loading classes...
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
                        <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-center text-muted-foreground">
                            {formData.grade
                                ? `No classes available for ${formData.grade}`
                                : 'Please select a grade first'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredClasses.map((cls) => (
                            <div
                                key={cls.id}
                                className={cn(
                                    'flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50',
                                    formData.selectedClasses?.includes(cls.id) &&
                                        'border-primary bg-primary/5'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id={cls.id}
                                        checked={
                                            formData.selectedClasses?.includes(
                                                cls.id
                                            ) || false
                                        }
                                        onChange={() => toggleClass(cls.id)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label
                                        htmlFor={cls.id}
                                        className="cursor-pointer flex-1"
                                    >
                                        <div>
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
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Mode */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Admission Payment
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                    {/* Pay Later */}
                    <Card
                        className={cn(
                            'cursor-pointer border-2 transition-all hover:shadow-md',
                            formData.paymentMode === 'later'
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-muted hover:border-orange-200'
                        )}
                        onClick={() => selectPaymentMode('later')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Pay Later</p>
                                    <p className="text-xs text-muted-foreground">
                                        Settle before 1st class
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pay Now */}
                    <Card
                        className={cn(
                            'cursor-pointer border-2 transition-all hover:shadow-md',
                            formData.paymentMode === 'now'
                                ? 'border-green-500 bg-green-50'
                                : 'border-muted hover:border-green-200'
                        )}
                        onClick={() => selectPaymentMode('now')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Pay Now</p>
                                    <p className="text-xs text-muted-foreground">
                                        Rs. 1,000
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Free Card */}
                    <Card
                        className={cn(
                            'cursor-pointer border-2 transition-all hover:shadow-md',
                            formData.paymentMode === 'free'
                                ? 'border-gray-500 bg-gray-50'
                                : 'border-muted hover:border-gray-200'
                        )}
                        onClick={() => selectPaymentMode('free')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <Gift className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Free Card</p>
                                    <p className="text-xs text-muted-foreground">
                                        Special admission
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
