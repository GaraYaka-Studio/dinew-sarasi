'use client';

import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { todaySchedule, type ScheduleItem } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

function getStatusBadge(status: ScheduleItem['status']) {
    switch (status) {
        case 'active':
            return (
                <Badge variant="success" className="rounded-full">
                    Active
                </Badge>
            );
        case 'upcoming':
            return (
                <Badge variant="secondary" className="rounded-full">
                    Upcoming
                </Badge>
            );
        case 'finished':
            return (
                <Badge variant="outline" className="rounded-full">
                    Finished
                </Badge>
            );
    }
}

// Mobile Card View (Event Cards)
function ClassCard({ item }: { item: ScheduleItem }) {
    return (
        <Card
            className={cn(
                'transition-colors',
                item.status === 'active' && 'bg-emerald-50/50'
            )}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Time & Details */}
                    <div className="flex-1 space-y-2">
                        <div className="text-lg font-bold tabular-nums">
                            {item.time}
                        </div>
                        <div>
                            <h4 className="font-semibold">{item.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                                {item.grade}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                    {item.teacher.initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                                {item.teacher.name}
                            </span>
                        </div>
                    </div>

                    {/* Right: Status */}
                    <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(item.status)}
                        {item.present !== undefined && (
                            <span className="text-xs text-muted-foreground">
                                {item.present}/{item.enrolled}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function ZoneBSchedule() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Today&apos;s Timetable</CardTitle>
                </div>
                <button className="text-sm text-primary hover:underline">
                    View Calendar
                </button>
            </CardHeader>

            <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Attendance
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {todaySchedule.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className={cn(
                                        item.status === 'active' &&
                                        'bg-emerald-50/30'
                                    )}
                                >
                                    <TableCell className="font-mono font-medium">
                                        {item.time}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-semibold">
                                                {item.subject}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {item.grade}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {item.teacher.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{item.teacher.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.present !== undefined ? (
                                            <span className="tabular-nums">
                                                {item.present}/{item.enrolled}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card List */}
                <div className="flex flex-col gap-3 md:hidden">
                    {todaySchedule.map((item) => (
                        <ClassCard key={item.id} item={item} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
