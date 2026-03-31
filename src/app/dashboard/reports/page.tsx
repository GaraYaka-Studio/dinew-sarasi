'use client';

import { useState, useEffect } from 'react';
import { ReportsHeader } from '@/components/features/reports/reports-header';
import { ReportsSummaryCards } from '@/components/features/reports/reports-summary-cards';
import { FinancialTabs } from '@/components/features/reports/financial-tabs';
import { AttendanceLogTable } from '@/components/features/reports/attendance-log-table';
import { ActivityLogTable } from '@/components/features/reports/activity-log-table';
import { FileDown } from 'lucide-react';
import type {
    ReportType,
    FinancialTabType,
    StudentPaymentRecord,
    TeacherPaymentGroup,
    FinancialSummary,
    AttendanceLogSessionWithDate,
    AttendanceSummary,
    ActivitySession,
    ActivitySummary,
} from '@/types/reports';
import {
    generateCSV,
    downloadCSV,
    formatCurrencyForCSV,
} from '@/lib/utils/csv';
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
    const [financialTab, setFinancialTab] =
        useState<FinancialTabType>('student');

    // Get current date for default month selection
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [isExporting, setIsExporting] = useState(false);

    // Data states
    const [isLoading, setIsLoading] = useState(true);
    const [studentPayments, setStudentPayments] = useState<
        StudentPaymentRecord[]
    >([]);
    const [teacherPayments, setTeacherPayments] = useState<
        TeacherPaymentGroup[]
    >([]);
    const [financialSummary, setFinancialSummary] =
        useState<FinancialSummary | null>(null);
    const [attendanceLog, setAttendanceLog] = useState<
        AttendanceLogSessionWithDate[]
    >([]);
    const [attendanceSummary, setAttendanceSummary] =
        useState<AttendanceSummary | null>(null);
    const [activityLog, setActivityLog] = useState<ActivitySession[]>([]);
    const [activitySummary, setActivitySummary] =
        useState<ActivitySummary | null>(null);

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
                    const [studentData, teacherData, summary] =
                        await Promise.all([
                            getStudentPaymentsForMonth(
                                selectedYear,
                                selectedMonth
                            ),
                            getTeacherPaymentsForMonth(
                                selectedYear,
                                selectedMonth
                            ),
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
            const monthName = new Date(
                selectedYear,
                selectedMonth
            ).toLocaleString('en-US', { month: 'long' });

            if (reportType === 'financial') {
                if (financialTab === 'student') {
                    // Export Student Payments - pre-format data with currency
                    const formattedData = studentPayments.map((p) => ({
                        date: p.date,
                        receiptNumber: p.receiptNumber,
                        studentName: p.studentName,
                        type: p.type,
                        className: p.className,
                        grade: p.grade,
                        amount: formatCurrencyForCSV(p.amount),
                    }));

                    const csv = generateCSV(formattedData, [
                        { key: 'date', label: 'Date' },
                        { key: 'receiptNumber', label: 'Receipt Number' },
                        { key: 'studentName', label: 'Student Name' },
                        { key: 'type', label: 'Type' },
                        { key: 'className', label: 'Class' },
                        { key: 'grade', label: 'Grade' },
                        { key: 'amount', label: 'Amount (LKR)' },
                    ]);
                    downloadCSV(
                        `Student_Payments_${monthName}_${selectedYear}.csv`,
                        csv
                    );
                } else {
                    // Export Teacher Payments - flatten the grouped data
                    const flatData: {
                        date: string;
                        teacherName: string;
                        className: string;
                        grade: string;
                        studentCount: number;
                        amount: string;
                    }[] = [];

                    for (const group of teacherPayments) {
                        for (const classData of group.classes) {
                            flatData.push({
                                date: monthName,
                                teacherName: group.teacherName,
                                className: classData.className,
                                grade: classData.grade,
                                studentCount: classData.studentCount,
                                amount: formatCurrencyForCSV(classData.amount),
                            });
                        }
                    }

                    const csv = generateCSV(flatData, [
                        { key: 'date', label: 'Date' },
                        { key: 'teacherName', label: 'Teacher Name' },
                        { key: 'className', label: 'Class' },
                        { key: 'grade', label: 'Grade' },
                        { key: 'studentCount', label: 'Students' },
                        { key: 'amount', label: 'Amount (LKR)' },
                    ]);
                    downloadCSV(
                        `Teacher_Payments_${monthName}_${selectedYear}.csv`,
                        csv
                    );
                }
            } else if (reportType === 'attendance') {
                // Export Attendance Log - flatten sessions with students
                const flatData: {
                    date: string;
                    time: string;
                    className: string;
                    studentName: string;
                    studentId: number;
                    scanTime: string;
                }[] = [];

                for (const session of attendanceLog) {
                    for (const student of session.students) {
                        flatData.push({
                            date: session.date,
                            time: session.time,
                            className: session.className,
                            studentName: student.name,
                            studentId: student.studentId,
                            scanTime: student.scanTime,
                        });
                    }
                }

                const csv = generateCSV(flatData, [
                    { key: 'date', label: 'Date' },
                    { key: 'time', label: 'Time' },
                    { key: 'className', label: 'Class' },
                    { key: 'studentName', label: 'Student Name' },
                    { key: 'studentId', label: 'Student ID' },
                    { key: 'scanTime', label: 'Scan Time' },
                ]);
                downloadCSV(
                    `Attendance_Log_${monthName}_${selectedYear}.csv`,
                    csv
                );
            } else if (reportType === 'activity') {
                // Export Activity Log
                const csv = generateCSV(activityLog as unknown as Record<string, unknown>[], [
                    { key: 'date', label: 'Date' },
                    { key: 'time', label: 'Time' },
                    { key: 'className', label: 'Class' },
                    { key: 'grade', label: 'Grade' },
                    { key: 'teacherName', label: 'Teacher' },
                    { key: 'status', label: 'Status' },
                    { key: 'attendanceCount', label: 'Attendance' },
                    { key: 'totalEnrolled', label: 'Enrolled' },
                ]);
                downloadCSV(
                    `Activity_Log_${monthName}_${selectedYear}.csv`,
                    csv
                );
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
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
                            activeTab={financialTab}
                            onTabChange={setFinancialTab}
                        />
                    )}

                    {/* Attendance Report */}
                    {reportType === 'attendance' && (
                        <AttendanceLogTable data={attendanceLog} />
                    )}

                    {/* Activity Report */}
                    {reportType === 'activity' && (
                        <ActivityLogTable data={activityLog} />
                    )}
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
