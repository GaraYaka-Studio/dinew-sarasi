'use client';

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Edit,
    Trash2,
    ChevronRight,
    Calendar,
    Plus,
    Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { Teacher } from '@/types/teacher.types';
import { cn } from '@/lib/utils';
import { RecordPaymentDialog } from './record-payment-dialog';

interface TeacherSheetProps {
    teacher: Teacher | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TeacherSheet({
    teacher,
    isOpen,
    onOpenChange,
}: TeacherSheetProps) {
    const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

    if (!teacher) return null;

    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString()}`;
    };

    const paymentInfo = teacher.paymentInfo || {
        totalEarned: 0,
        amountPaid: 0,
        balanceDue: 0,
        paymentHistory: [],
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-xl">
                {/* Visually Hidden Title/Desc for Accessibility */}
                <SheetTitle className="sr-only">
                    {teacher.name} - Teacher Profile
                </SheetTitle>
                <SheetDescription className="sr-only">
                    View teacher information, assigned classes, payments, and
                    timetable.
                </SheetDescription>

                {/* Fixed Header */}
                <div className="shrink-0 border-b bg-muted/5 p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-lg text-primary">
                                {teacher.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold tracking-tight">
                                {teacher.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {teacher.display_name}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <Badge
                                    variant={
                                        teacher.status === 'active'
                                            ? 'success'
                                            : 'secondary'
                                    }
                                >
                                    {teacher.status}
                                </Badge>
                                <Badge variant="outline">
                                    {teacher.subjects.length} Subjects
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Tabs */}
                <Tabs
                    defaultValue="overview"
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <TabsList className="w-full shrink-0 justify-start rounded-none border-b px-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                        <TabsTrigger value="financials">Financials</TabsTrigger>
                        <TabsTrigger value="timetable">Timetable</TabsTrigger>
                    </TabsList>

                    <div className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-4">
                        {/* Overview Tab */}
                        <TabsContent
                            value="overview"
                            className="mt-0 space-y-6"
                        >
                            {/* Personal Details */}
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">NIC</span>
                                        <span className="text-sm font-medium">
                                            {teacher.nic}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Phone</span>
                                        <span className="text-sm font-medium">
                                            {teacher.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Address</span>
                                        <span className="max-w-[60%] text-right text-sm font-medium">
                                            {teacher.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Joined Date
                                        </span>
                                        <span className="text-sm font-medium">
                                            {teacher.joinedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Subjects */}
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                    Teaching Subjects
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {teacher.subjects.map((subject) => (
                                        <Badge
                                            key={subject}
                                            variant="secondary"
                                        >
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Classes Tab */}
                        <TabsContent value="classes" className="mt-0 space-y-3">
                            {teacher.assignedClasses &&
                            teacher.assignedClasses.length > 0 ? (
                                teacher.assignedClasses.map((cls) => (
                                    <Link
                                        key={cls.id}
                                        href="/dashboard/academics/classes"
                                        className="block"
                                    >
                                        <Card className="p-4 transition-colors hover:bg-accent/50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        {cls.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {cls.grade} •{' '}
                                                        {cls.medium}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p className="text-sm">
                                        No classes assigned
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Financials Tab */}
                        <TabsContent
                            value="financials"
                            className="mt-0 space-y-6"
                        >
                            {/* Summary Box */}
                            <Card className="bg-muted/50 p-4">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Wallet className="h-4 w-4" />
                                    Payment Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Total Earned
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {formatCurrency(
                                                paymentInfo.totalEarned
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Amount Paid
                                        </span>
                                        <span className="text-sm font-semibold text-blue-600">
                                            {formatCurrency(
                                                paymentInfo.amountPaid
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-3">
                                        <span className="text-sm font-medium">
                                            Balance Due
                                        </span>
                                        <span
                                            className={cn(
                                                'text-sm font-bold',
                                                paymentInfo.balanceDue > 0
                                                    ? 'text-orange-600'
                                                    : 'text-green-600'
                                            )}
                                        >
                                            {formatCurrency(
                                                paymentInfo.balanceDue
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Record Payment Button */}
                            <Button
                                onClick={() => setIsRecordPaymentOpen(true)}
                                className="w-full"
                                size="lg"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Record Payment
                            </Button>

                            {/* Payment History */}
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                    Payment History
                                </h3>
                                {paymentInfo.paymentHistory.length > 0 ? (
                                    <div className="space-y-2">
                                        {paymentInfo.paymentHistory.map(
                                            (record) => (
                                                <Card
                                                    key={record.id}
                                                    className="p-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {formatCurrency(
                                                                    record.amount
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {record.date}
                                                            </p>
                                                        </div>
                                                        <p className="max-w-[50%] text-right text-sm text-muted-foreground">
                                                            {record.note}
                                                        </p>
                                                    </div>
                                                </Card>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <p className="text-sm">
                                            No payment records
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Timetable Tab */}
                        <TabsContent value="timetable" className="mt-0">
                            <div className="py-8 text-center text-muted-foreground">
                                <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                <p>Weekly agenda for this teacher</p>
                                <p className="text-sm">Coming soon...</p>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Fixed Footer */}
                <div className="shrink-0 border-t bg-muted/5 p-4 sm:p-6">
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                        </Button>
                    </div>
                </div>
            </SheetContent>

            {/* Record Payment Dialog */}
            <RecordPaymentDialog
                isOpen={isRecordPaymentOpen}
                onOpenChange={setIsRecordPaymentOpen}
                teacherName={teacher.name}
            />
        </Sheet>
    );
}
