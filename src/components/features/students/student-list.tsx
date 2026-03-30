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
import { Eye, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Student } from '@/types/schema.types';
import { cn, getInitials } from '@/lib/utils';

type SortField = 'name' | 'id' | 'grade' | 'batch';
type SortOrder = 'asc' | 'desc';

interface StudentListProps {
    students: Student[];
    onViewStudent: (student: Student) => void;
    onSort?: (field: SortField) => void;
    sortField?: SortField;
    sortOrder?: SortOrder;
}

const getPaymentBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
        paid: {
            label: 'Paid',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        pending: {
            label: 'Pending',
            className: 'bg-orange-100 text-orange-800 border-orange-200',
        },
        free: {
            label: 'Free',
            className: 'bg-gray-100 text-gray-800 border-gray-200',
        },
    };
    return variants[status] || variants.pending;
};

export function StudentList({ students, onViewStudent, onSort, sortField, sortOrder }: StudentListProps) {

    const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
        if (!onSort) return <TableHead>{children}</TableHead>;

        const isActive = sortField === field;
        const sortIcon = isActive ? (sortOrder === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />) : <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />;

        return (
            <TableHead>
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium hover:bg-muted/50"
                    onClick={() => onSort(field)}
                >
                    {children}
                    {sortIcon}
                </Button>
            </TableHead>
        );
    };
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortButton field="name">Student</SortButton>
                            <TableHead>Contact</TableHead>
                            <SortButton field="grade">Academic</SortButton>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => {
                            const paymentBadge = getPaymentBadge(
                                student.admission_status || 'pending'
                            );
                            return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                                    {getInitials(student.full_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {student.full_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.student_id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {student.phone}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {student.current_grade}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {student.batch_year}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                paymentBadge.className
                                            )}
                                        >
                                            {paymentBadge.label}
                                        </Badge>
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
            <div className="space-y-3 md:hidden">
                {students.map((student) => {
                    const paymentBadge = getPaymentBadge(
                        student.admission_status || 'pending'
                    );
                    return (
                        <Card key={student.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-sm text-primary">
                                        {getInitials(student.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">
                                                {student.full_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {student.student_id}
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
                                            {student.batch_year}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'text-xs',
                                                paymentBadge.className
                                            )}
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
