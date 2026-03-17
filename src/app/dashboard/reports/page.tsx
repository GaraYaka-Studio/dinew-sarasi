'use client';

import { useState, useEffect } from 'react';
import { ReportsHeader } from '@/components/features/reports/reports-header';
import { ReportsSummaryCards } from '@/components/features/reports/reports-summary-cards';
import { FinancialTabs } from '@/components/features/reports/financial-tabs';
import { AttendanceLogTable } from '@/components/features/reports/attendance-log-table';
import { ActivityLogTable } from '@/components/features/reports/activity-log-table';
import { FileDown } from 'lucide-react';
import type { ReportType } from '@/types/reports';
import {
    getStudentPaymentsForMonth,
    getTeacherPaymentsForMonth,
    getFinancialSummary,
    getAttendanceLogByMonth,
    getAttendanceSummary,
    getActivityLogByMonth,
    getActivitySummaryByMonth,
} from '@/lib/db/reports';

export default function ReportsPage() {
    const [reportType, setReportType] = useState<ReportType>('financial');

    // Get current date for default month selection
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [isExporting, setIsExporting] = useState(false);

    // Data states
    const [isLoading, setIsLoading] = useState(true);
    const [studentPayments, setStudentPayments] = useState<any[]>([]);
    const [teacherPayments, setTeacherPayments] = useState<any[]>([]);
    const [financialSummary, setFinancialSummary] = useState<{
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
    } | null>(null);
    const [attendanceLog, setAttendanceLog] = useState<any[]>([]);
    const [attendanceSummary, setAttendanceSummary] = useState<{
        classesHeld: number;
        totalEnrollments: number;
        avgAttendance: number;
    } | null>(null);
    const [activityLog, setActivityLog] = useState<any[]>([]);
    const [activitySummary, setActivitySummary] = useState<{
        totalScheduled: number;
        completed: number;
        cancelled: number;
        extra: number;
    } | null>(null);

    // Month change handler
    const handleMonthChange = (year: number, month: number) => {
        setSelectedYear(year);
        setSelectedMonth(month);
    };

    // Fetch data when month or report type changes
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                if (reportType === 'financial') {
                    const [studentData, teacherData, summary] = await Promise.all([
                        getStudentPaymentsForMonth(selectedYear, selectedMonth),
                        getTeacherPaymentsForMonth(selectedYear, selectedMonth),
                        getFinancialSummary(selectedYear, selectedMonth),
                    ]);
                    setStudentPayments(studentData);
                    setTeacherPayments(teacherData);
                    setFinancialSummary(summary);
                } else if (reportType === 'attendance') {
                    const [logData, summary] = await Promise.all([
                        getAttendanceLogByMonth(selectedYear, selectedMonth),
                        getAttendanceSummary(selectedYear, selectedMonth),
                    ]);
                    setAttendanceLog(logData);
                    setAttendanceSummary(summary);
                } else if (reportType === 'activity') {
                    const [logData, summary] = await Promise.all([
                        getActivityLogByMonth(selectedYear, selectedMonth),
                        getActivitySummaryByMonth(selectedYear, selectedMonth),
                    ]);
                    setActivityLog(logData);
                    setActivitySummary(summary);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [selectedYear, selectedMonth, reportType]);

    // Export handler
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // TODO: Implement CSV export based on report type
            console.log('Exporting', reportType, 'for', selectedYear, selectedMonth);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex h-full flex-col space-y-6 p-4 md:p-8">
            {/* Header & Controls */}
            <ReportsHeader
                reportType={reportType}
                onReportTypeChange={setReportType}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                onExport={handleExport}
                isExporting={isExporting}
            />

            {/* Summary Cards */}
            <ReportsSummaryCards
                reportType={reportType}
                financialSummary={financialSummary ?? undefined}
                attendanceSummary={attendanceSummary ?? undefined}
                activitySummary={activitySummary ?? undefined}
            />

            {/* Data Table Section */}
            {isLoading ? (
                <LoadingState />
            ) : (
                <>
                    {/* Financial Report with Tabs */}
                    {reportType === 'financial' && (
                        <FinancialTabs
                            studentPayments={studentPayments}
                            teacherPayments={teacherPayments}
                        />
                    )}

                    {/* Attendance Report */}
                    {reportType === 'attendance' && <AttendanceLogTable data={attendanceLog} />}

                    {/* Activity Report */}
                    {reportType === 'activity' && <ActivityLogTable data={activityLog} />}
                </>
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/20">
            <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Loading report data...
                </p>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/20">
            <div className="text-center">
                <FileDown className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No records found</h3>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}
