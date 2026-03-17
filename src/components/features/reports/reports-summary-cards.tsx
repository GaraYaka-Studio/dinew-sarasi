'use client';

import { Card } from '@/components/ui/card';
import type { ReportType, FinancialSummary, AttendanceSummary, ActivitySummary } from '@/types/reports';

interface ReportsSummaryCardsProps {
    reportType: ReportType;
    financialSummary?: FinancialSummary;
    attendanceSummary?: AttendanceSummary;
    activitySummary?: ActivitySummary;
}

export function ReportsSummaryCards({
    reportType,
    financialSummary,
    attendanceSummary,
    activitySummary,
}: ReportsSummaryCardsProps) {
    if (reportType === 'financial' && financialSummary) {
        return (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SummaryCard
                    label="Total Income"
                    value={`+ LKR ${financialSummary.totalIncome.toLocaleString()}`}
                    className="border-green-200 bg-green-50/50"
                />
                <SummaryCard
                    label="Total Expenses"
                    value={`- LKR ${Math.abs(financialSummary.totalExpenses).toLocaleString()}`}
                    className="border-red-200 bg-red-50/50"
                />
                <SummaryCard
                    label="Net Profit"
                    value={`LKR ${financialSummary.netProfit.toLocaleString()}`}
                    className={
                        financialSummary.netProfit >= 0
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-red-200 bg-red-50/50'
                    }
                />
            </div>
        );
    }

    if (reportType === 'attendance' && attendanceSummary) {
        return (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SummaryCard
                    label="Classes Held"
                    value={attendanceSummary.classesHeld.toString()}
                    className="border-gray-200 bg-gray-50/50"
                />
                <SummaryCard
                    label="Total Enrollments"
                    value={attendanceSummary.totalEnrollments.toString()}
                    className="border-gray-200 bg-gray-50/50"
                />
                <SummaryCard
                    label="Avg. Attendance"
                    value={`${attendanceSummary.avgAttendance}%`}
                    className={
                        attendanceSummary.avgAttendance >= 80
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-orange-200 bg-orange-50/50'
                    }
                />
            </div>
        );
    }

    if (reportType === 'activity' && activitySummary) {
        return (
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    label="Total Scheduled"
                    value={activitySummary.totalScheduled.toString()}
                    className="border-gray-200 bg-gray-50/50"
                />
                <SummaryCard
                    label="Held"
                    value={activitySummary.completed.toString()}
                    className="border-green-200 bg-green-50/50"
                />
                <SummaryCard
                    label="Extra"
                    value={activitySummary.extra.toString()}
                    className="border-blue-200 bg-blue-50/50"
                />
                <SummaryCard
                    label="Cancelled"
                    value={activitySummary.cancelled.toString()}
                    className="border-red-200 bg-red-50/50"
                />
            </div>
        );
    }

    return null;
}

function SummaryCard({
    label,
    value,
    className,
}: {
    label: string;
    value: string;
    className: string;
}) {
    return (
        <Card className={`border p-4 shadow-sm ${className}`}>
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </Card>
    );
}
