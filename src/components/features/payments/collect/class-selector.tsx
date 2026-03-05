'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClassFeeStructure } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface ClassSelectorProps {
    classes: ClassFeeStructure[];
    selectedClassId: string | null;
    onSelectClass: (classId: string) => void;
}

export function ClassSelector({ classes, selectedClassId, onSelectClass }: ClassSelectorProps) {
    if (classes.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">No enrolled classes found</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Select Class to Pay Fees
            </h3>
            <div className="space-y-3">
                {classes.map((cls) => {
                    const isSelected = selectedClassId === cls.classId;
                    const isAllPaid = cls.totalUnpaid === 0;
                    const hasUnpaid = cls.totalUnpaid > 0;

                    return (
                        <Card
                            key={cls.classId}
                            className={cn(
                                'transition-all cursor-pointer hover:shadow-md',
                                isSelected
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'hover:border-primary/50'
                            )}
                            onClick={() => onSelectClass(cls.classId)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-foreground">
                                                {cls.className}
                                            </h4>
                                            {isAllPaid ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Fully Paid
                                                </Badge>
                                            ) : hasUnpaid ? (
                                                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {cls.totalUnpaid} Unpaid
                                                </Badge>
                                            ) : null}
                                        </div>
                                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>Monthly Fee: LKR {cls.monthlyFee.toLocaleString()}</span>
                                            {hasUnpaid && (
                                                <span className="font-medium text-foreground">
                                                    Due: LKR {cls.totalDue.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant={isSelected ? 'default' : 'ghost'}
                                        size="icon"
                                        className={cn(
                                            'shrink-0',
                                            isSelected && 'bg-primary text-primary-foreground'
                                        )}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
