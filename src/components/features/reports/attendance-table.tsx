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
import { type AttendanceRecord } from '@/lib/mock-data-reports';

const getAttendanceBadge = (present: number, enrolled: number) => {
    const percentage = (present / enrolled) * 100;
    if (percentage >= 80) {
        return {
            label: `${present} / ${enrolled}`,
            className: 'bg-green-100 text-green-800 border-green-200',
        };
    }
    if (percentage >= 60) {
        return {
            label: `${present} / ${enrolled}`,
            className: 'bg-orange-100 text-orange-800 border-orange-200',
        };
    }
    return {
        label: `${present} / ${enrolled}`,
        className: 'bg-red-100 text-red-800 border-red-200',
    };
};

export function AttendanceTable({ data }: { data: AttendanceRecord[] }) {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Class Name</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Participation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((record) => {
                            const attendanceBadge = getAttendanceBadge(
                                record.present,
                                record.enrolled
                            );
                            const percentage = Math.round(
                                (record.present / record.enrolled) * 100
                            );
                            return (
                                <TableRow key={record.id}>
                                    <TableCell className="text-sm">
                                        {record.date}
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">
                                            {record.className}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-muted-foreground">
                                            {record.teacher}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'text-xs',
                                                    attendanceBadge.className
                                                )}
                                            >
                                                {attendanceBadge.label}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                ({percentage}%)
                                            </span>
                                        </div>
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
                    const attendanceBadge = getAttendanceBadge(
                        record.present,
                        record.enrolled
                    );
                    const percentage = Math.round(
                        (record.present / record.enrolled) * 100
                    );
                    return (
                        <Card key={record.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {record.className}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {record.teacher}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {record.date}
                                    </p>
                                </div>
                                <div className="ml-4 flex flex-col items-end gap-1">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-xs',
                                            attendanceBadge.className
                                        )}
                                    >
                                        {attendanceBadge.label}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {percentage}%
                                    </span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
