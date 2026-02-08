'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, BookOpen, Eye, CheckCircle2 } from 'lucide-react';
import { Teacher } from '@/types/teacher.types';
import { cn } from '@/lib/utils';

interface TeacherListMobileProps {
    teachers: Teacher[];
    onViewTeacher: (teacher: Teacher) => void;
}

export function TeacherListMobile({
    teachers,
    onViewTeacher,
}: TeacherListMobileProps) {
    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString()}`;
    };

    return (
        <div className="grid gap-4 lg:hidden">
            {teachers.map((teacher) => {
                const pendingDue = teacher.paymentInfo?.balanceDue || 0;
                const isPaidOff = pendingDue === 0;

                return (
                    <div
                        key={teacher.id}
                        className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/10 text-sm text-primary">
                                    {teacher.initials}
                                </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                {/* Name + Status Dot + Eye Icon */}
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="truncate font-semibold">
                                        {teacher.name}
                                    </h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div
                                            className={cn(
                                                'h-2 w-2 rounded-full',
                                                teacher.status === 'active'
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            )}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => onViewTeacher(teacher)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Subjects - No badges */}
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {teacher.subjects.join(', ')}
                                </p>

                                {/* Phone */}
                                <div className="flex items-center gap-1.5 mt-2 text-sm">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{teacher.phone}</span>
                                </div>

                                {/* Classes */}
                                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>
                                        {teacher.classCount} Classes Assigned
                                    </span>
                                </div>

                                {/* Pending Due */}
                                <div className="mt-2 flex items-center gap-1.5 text-sm">
                                    {isPaidOff ? (
                                        <>
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                            <span className="font-medium text-green-600">
                                                Paid
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-muted-foreground">
                                                Pending:
                                            </span>
                                            <span className={cn(
                                                'font-medium',
                                                pendingDue > 0 ? 'text-orange-600' : ''
                                            )}>
                                                {formatCurrency(pendingDue)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
