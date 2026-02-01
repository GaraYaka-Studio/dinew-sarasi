import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassFeeStructure, FeeMonth } from "@/lib/mock-data";
import { Check, CircleAlert, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeeGridProps {
    feeClasses: ClassFeeStructure[];
    onToggleMonth: (classId: string, monthIndex: number) => void;
}

export function FeeGrid({ feeClasses, onToggleMonth }: FeeGridProps) {
    if (feeClasses.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <span className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4" />
                    No classes enrolled
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {feeClasses.map((feeClass) => (
                <Card key={feeClass.classId} className="overflow-hidden">
                    <CardHeader className="bg-muted/40 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-foreground">
                                {feeClass.className}
                            </CardTitle>
                            <div className="text-sm font-medium text-muted-foreground">
                                {feeClass.monthlyFee} LKR/mo
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
                            {feeClass.months.map((month, idx) => {
                                const isPaid = month.status === 'paid';
                                const isSelected = month.status === 'selected';
                                const isPartial = month.status === 'partial';

                                return (
                                    <Button
                                        key={`${feeClass.classId}-${month.month}`}
                                        variant={isSelected ? "default" : isPaid ? "secondary" : "outline"}
                                        className={cn(
                                            "relative flex h-16 w-full flex-col gap-1 text-xs font-semibold sm:text-sm",
                                            isPaid && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 font-bold opacity-80 cursor-not-allowed",
                                            isSelected && "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                                            isPartial && !isSelected && "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-500"
                                        )}
                                        onClick={() => !isPaid && onToggleMonth(feeClass.classId, idx)}
                                        disabled={isPaid}
                                    >
                                        <span className="uppercase">{month.month}</span>
                                        
                                        {isPaid && (
                                            <Badge variant="secondary" className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-200 p-0 text-green-800 dark:bg-green-800 dark:text-green-100 shadow-sm">
                                                <Check className="h-3 w-3" />
                                            </Badge>
                                        )}

                                        {isPartial && !isSelected && (
                                            <span className="text-[10px] font-normal opacity-80">
                                                Due: {month.amount - (month.paidAmount || 0)}
                                            </span>
                                        )}
                                        
                                        {month.status === 'unpaid' && (
                                           <span className="text-[10px] font-normal opacity-50">{month.year}</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
