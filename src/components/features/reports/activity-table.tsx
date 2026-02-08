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
import { type ActivityRecord, ActivityStatus } from '@/lib/mock-data-reports';

const getStatusBadge = (status: ActivityStatus) => {
    const variants = {
        held: {
            label: 'Held',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        cancelled: {
            label: 'Cancelled',
            className: 'bg-red-100 text-red-800 border-red-200',
        },
        extra: {
            label: 'Extra',
            className: 'bg-orange-100 text-orange-800 border-orange-200',
        },
    };
    return variants[status];
};

export function ActivityTable({ data }: { data: ActivityRecord[] }) {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Subject - Grade</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((record) => {
                            const statusBadge = getStatusBadge(record.status);
                            return (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {record.date}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {record.time}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">
                                                {record.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {record.grade}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-muted-foreground">
                                            {record.teacher}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                statusBadge.className
                                            )}
                                        >
                                            {statusBadge.label}
                                        </Badge>
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
                    const statusBadge = getStatusBadge(record.status);
                    return (
                        <Card key={record.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {record.subject} - {record.grade}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {record.teacher}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {record.date} at {record.time}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-xs',
                                            statusBadge.className
                                        )}
                                    >
                                        {statusBadge.label}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
