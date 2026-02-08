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
import { type FinancialRecord } from '@/lib/mock-data-reports';

const getCategoryBadge = (category: FinancialRecord['category']) => {
    const variants = {
        'Class Fee': {
            label: 'Class Fee',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        'Admission Fee': {
            label: 'Admission',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        'Teacher Payment': {
            label: 'Teacher Payment',
            className: 'bg-red-100 text-red-800 border-red-200',
        },
        Other: {
            label: 'Other',
            className: 'bg-gray-100 text-gray-800 border-gray-200',
        },
    };
    return variants[category];
};

export function FinancialTable({ data }: { data: FinancialRecord[] }) {
    const formatCurrency = (amount: number) => {
        const formatted = Math.abs(amount).toLocaleString();
        return amount >= 0 ? `+ LKR ${formatted}` : `- LKR ${formatted}`;
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((record) => {
                            const categoryBadge = getCategoryBadge(
                                record.category
                            );
                            return (
                                <TableRow key={record.id}>
                                    <TableCell className="text-sm">
                                        {record.date}
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">
                                            {record.description}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                categoryBadge.className
                                            )}
                                        >
                                            {categoryBadge.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            'text-right font-mono text-sm',
                                            record.amount >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        )}
                                    >
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
                {data.map((record) => {
                    const categoryBadge = getCategoryBadge(record.category);
                    return (
                        <Card key={record.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {record.description}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {record.date}
                                    </p>
                                    <div className="mt-2">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                categoryBadge.className
                                            )}
                                        >
                                            {categoryBadge.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        'ml-4 font-mono text-sm font-medium',
                                        record.amount >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    )}
                                >
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
