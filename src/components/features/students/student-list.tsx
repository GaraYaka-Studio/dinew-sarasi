'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { studentData, type Student } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface StudentListProps {
    onViewStudent: (student: Student) => void;
}

const getPaymentBadge = (status: Student['paymentStatus']) => {
    const variants = {
        paid: { label: 'Paid', className: 'bg-green-100 text-green-800 border-green-200' },
        pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800 border-orange-200' },
        free: { label: 'Free', className: 'bg-gray-100 text-gray-800 border-gray-200' },
        draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    };
    return variants[status];
};

export function StudentList({ onViewStudent }: StudentListProps) {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Academic</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentData.map((student) => {
                            const paymentBadge = getPaymentBadge(student.paymentStatus);
                            return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {student.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.studentId}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {student.phone}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium">{student.grade}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {student.batch}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn('text-xs', paymentBadge.className)}
                                        >
                                            {paymentBadge.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {student.lastActivity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewStudent(student)}
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {studentData.map((student) => {
                    const paymentBadge = getPaymentBadge(student.paymentStatus);
                    return (
                        <Card key={student.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {student.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {student.studentId}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewStudent(student)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {student.batch}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={cn('text-xs', paymentBadge.className)}
                                        >
                                            {paymentBadge.label}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
