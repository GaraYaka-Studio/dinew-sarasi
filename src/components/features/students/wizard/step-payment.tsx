'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Gift, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClassesByGrade } from '@/lib/db/select';

interface StepPaymentProps {
    formData: {
        grade: string;
        selectedClasses: string[];
        paymentMode: 'later' | 'now' | 'free';
        selectedMonths: Map<string, number[]>; // classId -> array of month indices
    };
    onUpdate: (field: string, value: string | Map<string, number[]>) => void;
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

const MONTH_LABELS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
];

// Get current month index (0-11)
const getCurrentMonthIndex = () => new Date().getMonth();

export function StepPayment({ formData, onUpdate }: StepPaymentProps) {
    const [selectedClassesData, setSelectedClassesData] = useState<
        ClassOption[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingRef = useRef(false);

    // Load selected classes data
    useEffect(() => {
        // Skip if already loading
        if (isLoadingRef.current) return;

        if (formData.selectedClasses.length > 0 && formData.grade) {
            isLoadingRef.current = true;
            // Defer loading to avoid synchronous setState
            const timeoutId = setTimeout(() => {
                setIsLoading(true);
                getClassesByGrade(formData.grade)
                    .then((classes) => {
                        const transformed = classes.map((cls) => {
                            const dayName = cls.day
                                ? cls.day.charAt(0).toUpperCase() +
                                  cls.day.slice(1)
                                : 'TBD';

                            const time =
                                cls.startTime && cls.endTime
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
                        // Filter to only selected classes
                        const selected = transformed.filter((c) =>
                            formData.selectedClasses.includes(c.id)
                        );
                        setSelectedClassesData(selected);
                    })
                    .catch((error) => {
                        console.error('Failed to load classes:', error);
                        setSelectedClassesData([]);
                    })
                    .finally(() => {
                        setIsLoading(false);
                        isLoadingRef.current = false;
                    });
            }, 0);

            return () => clearTimeout(timeoutId);
        } else {
            // Defer setState in else branch
            const timeoutId = setTimeout(() => setSelectedClassesData([]), 0);
            return () => clearTimeout(timeoutId);
        }
    }, [formData.selectedClasses, formData.grade]);

    const selectPaymentMode = (mode: 'later' | 'now' | 'free') => {
        onUpdate('paymentMode', mode);
    };

    // Toggle month selection for a specific class
    const toggleMonth = (classId: string, monthIndex: number) => {
        const newMap = new Map(formData.selectedMonths);
        const currentMonths = newMap.get(classId) || [];

        if (currentMonths.includes(monthIndex)) {
            // Remove month
            newMap.set(
                classId,
                currentMonths.filter((m) => m !== monthIndex)
            );
            if (newMap.get(classId)?.length === 0) {
                newMap.delete(classId);
            }
        } else {
            // Add month
            newMap.set(classId, [...currentMonths, monthIndex]);
        }

        onUpdate('selectedMonths', newMap);
    };

    // Clear all month selections for a class
    const clearAllMonths = (classId: string) => {
        const newMap = new Map(formData.selectedMonths);
        newMap.delete(classId);
        onUpdate('selectedMonths', newMap);
    };

    // Calculate totals
    const totals = useMemo(() => {
        let admissionFee = 0;
        let monthlyFees = 0;

        if (formData.paymentMode === 'now') {
            admissionFee = 1000; // Rs. 1,000 admission fee
        }

        formData.selectedMonths.forEach((months, classId) => {
            const classData = selectedClassesData.find((c) => c.id === classId);
            if (classData) {
                monthlyFees += months.length * classData.monthlyFee;
            }
        });

        return {
            admissionFee,
            monthlyFees,
            total: admissionFee + monthlyFees,
        };
    }, [formData.paymentMode, formData.selectedMonths, selectedClassesData]);

    const currentMonth = getCurrentMonthIndex();

    return (
        <div className="space-y-6">
            {/* Selected Classes Summary */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Selected Classes
                </h3>

                {!formData.grade || formData.selectedClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                        <Info className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-center text-muted-foreground">
                            {!formData.grade
                                ? 'Please complete the Academic step first'
                                : 'No classes selected. Please go back and select classes to enroll.'}
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center p-12 text-muted-foreground">
                        Loading class details...
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedClassesData.map((cls) => (
                            <Card key={cls.id} className="border-muted">
                                <CardContent className="p-4">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-medium">
                                                    {cls.name}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs',
                                                        typeColors[cls.type]
                                                    )}
                                                >
                                                    {cls.type}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs capitalize',
                                                        mediumColors[cls.medium]
                                                    )}
                                                >
                                                    {cls.medium}
                                                </Badge>
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {cls.schedule}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-foreground">
                                                    Rs.{' '}
                                                    {cls.monthlyFee.toLocaleString()}
                                                    /month
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Month Selection */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground">
                                                Select month to pay (current
                                                month only):
                                            </Label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        clearAllMonths(cls.id)
                                                    }
                                                    className="text-xs text-muted-foreground underline hover:text-foreground"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
                                            {MONTH_LABELS.map((month, idx) => {
                                                const isSelected =
                                                    formData.selectedMonths
                                                        .get(cls.id)
                                                        ?.includes(idx) ||
                                                    false;
                                                const isPast =
                                                    idx < currentMonth;
                                                const isFuture =
                                                    idx > currentMonth;
                                                const isCurrentMonth =
                                                    idx === currentMonth;

                                                return (
                                                    <button
                                                        key={month}
                                                        type="button"
                                                        disabled={
                                                            isPast || isFuture
                                                        }
                                                        onClick={() =>
                                                            !isPast &&
                                                            !isFuture &&
                                                            toggleMonth(
                                                                cls.id,
                                                                idx
                                                            )
                                                        }
                                                        className={cn(
                                                            'relative flex flex-col items-center justify-center rounded-md border p-2 text-xs transition-all',
                                                            isPast &&
                                                                'cursor-not-allowed bg-muted/50 opacity-30',
                                                            isFuture &&
                                                                'cursor-not-allowed bg-muted/50 opacity-30',
                                                            !isPast &&
                                                                !isFuture &&
                                                                !isSelected &&
                                                                'cursor-pointer hover:bg-muted',
                                                            isSelected &&
                                                                'border-primary bg-primary text-primary-foreground',
                                                            isCurrentMonth &&
                                                                !isSelected &&
                                                                'border-primary/50 hover:bg-primary/10',
                                                            isCurrentMonth &&
                                                                'font-bold'
                                                        )}
                                                        title={
                                                            isPast
                                                                ? 'Past month - cannot pay for new student'
                                                                : isFuture
                                                                  ? 'Future month - cannot pay'
                                                                  : `Pay for ${month}`
                                                        }
                                                    >
                                                        <span>{month}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Info className="h-3 w-3" />
                                            <span>
                                                For new students, only current
                                                month can be selected for
                                                payment
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Admission Fee */}
            <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Admission Fee
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
                                        Collect later
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
                                    <p className="font-semibold">Free</p>
                                    <p className="text-xs text-muted-foreground">
                                        Waive admission fee
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Summary */}
            {(formData.paymentMode === 'now' ||
                formData.selectedMonths.size > 0) && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="p-4">
                        <h4 className="mb-3 font-semibold">Payment Summary</h4>
                        <div className="space-y-2 text-sm">
                            {formData.paymentMode === 'now' && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Admission Fee:
                                    </span>
                                    <span className="font-medium">
                                        Rs.{' '}
                                        {totals.admissionFee.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {formData.selectedMonths.size > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Monthly Fees:
                                    </span>
                                    <span className="font-medium">
                                        Rs.{' '}
                                        {totals.monthlyFees.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Total:</span>
                                <span className="text-lg font-bold">
                                    Rs. {totals.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Note */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                    You can skip payments now and collect fees later. Monthly
                    fees are optional at registration - you can collect them
                    anytime based on your class schedule.
                </p>
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
