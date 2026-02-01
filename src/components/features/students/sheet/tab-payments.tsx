'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import type { StudentDetail } from '@/lib/mock-data';

interface TabPaymentsProps {
    student: StudentDetail;
}

export function TabPayments({ student }: TabPaymentsProps) {
    const hasAdmissionPending = student.admissionStatus === 'PENDING';

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
                                Rs. {student.admissionFee.toLocaleString()} is
                                pending
                            </p>
                        </div>
                        <Button size="sm" variant="destructive">
                            Settle Now
                        </Button>
                    </div>
                </Card>
            )}

            {/* Arrears Info */}
            {student.arrears > 0 && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <p className="text-sm font-medium text-orange-900">
                        Outstanding Arrears: Rs.{' '}
                        {student.arrears.toLocaleString()}
                    </p>
                </div>
            )}

            {/* Payment History */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Payment History
                </h3>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Month</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead className="text-right">
                                    Amount
                                </TableHead>
                                <TableHead className="w-24">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {student.paymentHistory.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {payment.month}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {payment.class}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        Rs. {payment.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                payment.status === 'paid'
                                                    ? 'success'
                                                    : 'secondary'
                                            }
                                        >
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
