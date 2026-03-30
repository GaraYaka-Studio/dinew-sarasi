'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StudentPaymentRecord } from '@/types/reports';

const getPaymentTypeBadge = (type: 'monthly' | 'admission') => {
    if (type === 'admission') {
        return {
            label: 'Admission',
            className: 'bg-purple-100 text-purple-800 border-purple-200',
        };
    }
    return {
        label: 'Monthly',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    };
};

export function StudentPaymentsTable({
    data,
}: {
    data: StudentPaymentRecord[];
}) {
    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString()}`;
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Receipt</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((record, index) => {
                            const typeBadge = getPaymentTypeBadge(record.type);
                            return (
                                <TableRow
                                    key={`${record.date}-${record.receiptNumber}-${index}`}
                                >
                                    <TableCell className="text-sm">
                                        {record.date}
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-mono text-sm">
                                            #{record.receiptNumber}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">
                                            {record.studentName}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                typeBadge.className
                                            )}
                                        >
                                            {typeBadge.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">
                                            {record.grade} {record.className}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm font-medium">
                                        {formatCurrency(record.amount)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
                {data.map((record, index) => {
                    const typeBadge = getPaymentTypeBadge(record.type);
                    return (
                        <Card
                            key={`${record.date}-${record.receiptNumber}-${index}`}
                            className="p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {record.studentName}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        #{record.receiptNumber} • {record.date}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {record.grade} {record.className}
                                    </p>
                                    <div className="mt-2">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                typeBadge.className
                                            )}
                                        >
                                            {typeBadge.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="ml-4 font-mono text-sm font-medium">
                                    {formatCurrency(record.amount)}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
