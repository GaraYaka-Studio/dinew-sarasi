'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CircleAlert, Ban } from 'lucide-react';
import { ClassFeeStructure } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface FeeGridProps {
    feeClasses: ClassFeeStructure[];
    selectedClassId: string | null;
    onToggleMonth: (classId: string, monthIndex: number) => void;
}

export function FeeGrid({
    feeClasses,
    selectedClassId,
    onToggleMonth,
}: FeeGridProps) {
    // Find the selected class
    const selectedClass = feeClasses.find((c) => c.classId === selectedClassId);

    if (!selectedClass) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <CircleAlert className="mb-2 h-8 w-8 opacity-50" />
                <div className="text-center">
                    <p className="text-sm font-medium">No class selected</p>
                    <p className="text-xs text-muted-foreground">
                        Select a class from the list above to view and pay fees
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Selected Class Header */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-foreground">
                            {selectedClass.className}
                        </CardTitle>
                        <div className="text-sm font-medium text-foreground">
                            LKR {selectedClass.monthlyFee.toLocaleString()}/mo
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Month Grid */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6">
                        {selectedClass.months.map((month, idx) => {
                            const isPaid = month.status === 'paid';
                            const isSelected = month.status === 'selected';
                            const isPartial = month.status === 'partial';
                            const isUnpaid = month.status === 'unpaid';
                            const isSkipped = month.status === 'skipped';
                            const isFuture = month.isFuture;
                            const isBeforeEnrollment = month.isBeforeEnrollment;
                            const isFirstEnrollmentMonth =
                                month.isFirstEnrollmentMonth;

                            // Determine button styling based on state
                            const getButtonClass = () => {
                                if (isSelected) {
                                    return 'border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2';
                                }
                                if (isPaid) {
                                    return 'cursor-not-allowed bg-green-100 font-bold text-green-700 opacity-80 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400';
                                }
                                if (isBeforeEnrollment) {
                                    return 'cursor-not-allowed bg-muted/10 text-muted-foreground opacity-40 hover:bg-muted/10 line-through';
                                }
                                if (isFuture) {
                                    return 'cursor-not-allowed bg-muted/20 text-muted-foreground opacity-60 hover:bg-muted/20';
                                }
                                if (isSkipped) {
                                    return 'border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900/10 dark:text-gray-500 hover:border-gray-400 cursor-pointer';
                                }
                                if (isPartial) {
                                    return 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/10 dark:text-yellow-500 cursor-pointer';
                                }
                                // First enrollment month - normal unpaid color (can be paid)
                                if (isFirstEnrollmentMonth && isUnpaid) {
                                    return 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 cursor-pointer';
                                }
                                // Unpaid but eligible - RED color
                                return 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 cursor-pointer';
                            };

                            const isDisabled =
                                isPaid || isFuture || isBeforeEnrollment;

                            return (
                                <button
                                    key={`${selectedClass.classId}-${month.month}`}
                                    onClick={() =>
                                        !isDisabled &&
                                        onToggleMonth(
                                            selectedClass.classId,
                                            idx
                                        )
                                    }
                                    disabled={isDisabled}
                                    className={cn(
                                        'relative flex h-16 w-full flex-col gap-1 rounded-md border-2 text-xs font-semibold transition-all sm:text-sm',
                                        'inline-flex items-center justify-center whitespace-nowrap',
                                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                        'disabled:pointer-events-none disabled:opacity-50',
                                        getButtonClass()
                                    )}
                                >
                                    <span className="uppercase">
                                        {month.month}
                                    </span>

                                    {isPaid && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-200 p-0 text-green-800 shadow-sm dark:bg-green-800 dark:text-green-100"
                                        >
                                            <Check className="h-3 w-3" />
                                        </Badge>
                                    )}

                                    {isBeforeEnrollment && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 p-0 text-gray-500 shadow-sm dark:bg-gray-700 dark:text-gray-400"
                                        >
                                            <Ban className="h-2.5 w-2.5" />
                                        </Badge>
                                    )}

                                    {isSkipped && (
                                        <span className="text-[10px] font-medium opacity-80">
                                            Skipped
                                        </span>
                                    )}

                                    {isPartial && (
                                        <span className="text-[10px] font-normal opacity-80">
                                            Due:{' '}
                                            {month.amount -
                                                (month.paidAmount || 0)}
                                        </span>
                                    )}

                                    {isUnpaid &&
                                        !isFuture &&
                                        !isBeforeEnrollment && (
                                            <span className="text-[10px] font-medium opacity-80">
                                                LKR{' '}
                                                {month.amount.toLocaleString()}
                                            </span>
                                        )}

                                    {isFuture && (
                                        <span className="text-[10px] font-normal opacity-50">
                                            {month.year}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span>Paid</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span>Unpaid (Can Pay)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-gray-400" />
                            <span>Skipped (Can Pay)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <span>Partial</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full border-2 border-dashed border-muted-foreground bg-muted" />
                            <span>Future / Not Enrolled</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
