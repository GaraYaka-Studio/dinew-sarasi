'use client';

import { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle2 } from 'lucide-react';

import { Class, Teacher } from '@/types/schema.types';

import { cn, getInitials } from '@/lib/utils';

interface TeacherListDesktopProps {
    teachers: Teacher[];
    classes: Class[];
    onViewTeacher: (teacher: Teacher) => void;
}

export function TeacherListDesktop({
    teachers,
    classes,
    onViewTeacher,
}: TeacherListDesktopProps) {
    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString()}`;
    };

    return (
        <div className="hidden rounded-lg border lg:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[280px]">Teacher</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Pending Due</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.map((teacher) => {
                        const pendingDue = Number(teacher.total_earned) - Number(teacher.amount_paid) || 0;
                        const isPaidOff = pendingDue === 0;

                        const numClasses = classes?.filter(cls => cls.teacher_id === teacher.id).length || 0;

                        return (
                            <TableRow key={teacher.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                                {getInitials(teacher.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {teacher.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {teacher.nic}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">
                                        {teacher.subjects?.join(', ')}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {teacher.phone}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {String(numClasses).padStart(
                                        2,
                                        '0'
                                    )}{' '}
                                    Classes
                                </TableCell>
                                <TableCell>
                                    {isPaidOff ? (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                Paid
                                            </span>
                                        </div>
                                    ) : (
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                pendingDue > 0
                                                    ? 'text-orange-600'
                                                    : ''
                                            )}
                                        >
                                            {formatCurrency(pendingDue)}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                'h-2 w-2 rounded-full',
                                                teacher.status === 'active'
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            )}
                                        />
                                        <span className="text-sm capitalize">
                                            {teacher.status}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onViewTeacher(teacher)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
