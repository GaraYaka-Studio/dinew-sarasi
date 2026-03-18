'use client';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { StudentPaymentsTable } from './student-payments-table';
import { TeacherPaymentsTable } from './teacher-payments-table';
import type { StudentPaymentRecord, TeacherPaymentGroup, FinancialTabType } from '@/types/reports';

interface FinancialTabsProps {
    studentPayments: StudentPaymentRecord[];
    teacherPayments: TeacherPaymentGroup[];
    activeTab: FinancialTabType;
    onTabChange: (tab: FinancialTabType) => void;
}

export function FinancialTabs({
    studentPayments,
    teacherPayments,
    activeTab,
    onTabChange,
}: FinancialTabsProps) {
    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => onTabChange(value as FinancialTabType)}
            className="flex h-full flex-col"
        >
            <TabsList variant="line" className="w-full justify-start border-b pb-0">
                <TabsTrigger value="student">Student Payments</TabsTrigger>
                <TabsTrigger value="teacher">Teacher Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-6 flex-1">
                {studentPayments.length > 0 ? (
                    <StudentPaymentsTable data={studentPayments} />
                ) : (
                    <EmptyState message="No student payments found for the selected month." />
                )}
            </TabsContent>

            <TabsContent value="teacher" className="mt-6 flex-1">
                {teacherPayments.length > 0 ? (
                    <TeacherPaymentsTable data={teacherPayments} />
                ) : (
                    <EmptyState message="No teacher payments found for the selected month." />
                )}
            </TabsContent>
        </Tabs>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/20">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}
