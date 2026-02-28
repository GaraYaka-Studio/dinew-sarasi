'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Student } from '@/types/schema.types';

interface TabPaymentsProps {
    student: Student;
}

export function TabPayments({ student }: TabPaymentsProps) {
    const hasAdmissionPending = student.admission_status === 'pending';
    const admissionFee = Number(student.admission_fee) || 0;

    return (
        <div className="space-y-4">
            {/* Admission Alert */}
            {hasAdmissionPending && (
                <Card className="border-destructive/50 bg-destructive/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <div className="flex-1">
                            <p className="font-semibold text-destructive">
                                Admission Fee Pending
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Rs. {admissionFee.toLocaleString()} is
                                pending
                            </p>
                        </div>
                        <Button size="sm" variant="destructive">
                            Settle Now
                        </Button>
                    </div>
                </Card>
            )}

            {/* Payment History */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Payment History
                </h3>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        No payment history available yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Payment records will appear here once fees are collected
                    </p>
                </div>
            </div>
        </div>
    );
}
