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
import { ChevronRight } from 'lucide-react';
import type { TeacherPaymentGroup } from '@/types/reports';
import { useState } from 'react';

export function TeacherPaymentsTable({ data }: { data: TeacherPaymentGroup[] }) {
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
                            <TableHead>Teacher</TableHead>
                            <TableHead>Classes</TableHead>
                            <TableHead className="text-right">Total Paid</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((group) => (
                            <TeacherPaymentRow
                                key={group.teacherId}
                                group={group}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
                {data.map((group) => (
                    <TeacherPaymentCard
                        key={group.teacherId}
                        group={group}
                        formatCurrency={formatCurrency}
                    />
                ))}
            </div>
        </>
    );
}

function TeacherPaymentRow({
    group,
    formatCurrency,
}: {
    group: TeacherPaymentGroup;
    formatCurrency: (amount: number) => string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell>
                    <p className="font-medium">{group.teacherName}</p>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="text-xs">
                        {group.classes.length} class
                        {group.classes.length !== 1 ? 'es' : ''}
                    </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-medium">
                    {formatCurrency(group.totalPaid)}
                </TableCell>
                <TableCell className="w-10">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted',
                            isOpen && 'bg-muted'
                        )}
                    >
                        <ChevronRight
                            className={cn(
                                'h-4 w-4 transition-transform',
                                isOpen && 'rotate-90'
                            )}
                        />
                    </button>
                </TableCell>
            </TableRow>
            {isOpen && (
                <TableRow>
                    <TableCell colSpan={4} className="border-b bg-muted/30 p-4">
                        <div className="space-y-2">
                            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                                Payment Details
                            </p>
                            {group.classes.map((classPayment, index) => (
                                <div
                                    key={`${classPayment.className}-${classPayment.grade}-${index}`}
                                    className="flex items-center justify-between rounded-md border bg-background p-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {classPayment.grade} {classPayment.className}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {classPayment.studentCount} student
                                            {classPayment.studentCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <span className="font-mono text-sm font-medium">
                                        {formatCurrency(classPayment.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

function TeacherPaymentCard({
    group,
    formatCurrency,
}: {
    group: TeacherPaymentGroup;
    formatCurrency: (amount: number) => string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                    <p className="font-medium">{group.teacherName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {group.classes.length} class
                        {group.classes.length !== 1 ? 'es' : ''}
                    </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">
                        {formatCurrency(group.totalPaid)}
                    </span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted',
                            isOpen && 'bg-muted'
                        )}
                    >
                        <ChevronRight
                            className={cn(
                                'h-4 w-4 transition-transform',
                                isOpen && 'rotate-90'
                            )}
                        />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="mt-4 space-y-2 border-t pt-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Payment Details
                    </p>
                    {group.classes.map((classPayment, index) => (
                        <div
                            key={`${classPayment.className}-${classPayment.grade}-${index}`}
                            className="flex items-center justify-between rounded-md border bg-muted/30 p-3"
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    {classPayment.grade} {classPayment.className}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {classPayment.studentCount} student
                                    {classPayment.studentCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <span className="font-mono text-sm font-medium">
                                {formatCurrency(classPayment.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
