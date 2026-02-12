'use client';

import { useState } from 'react';
import { ReportsHeader } from '@/components/features/reports/reports-header';
import { ReportsSummaryCards } from '@/components/features/reports/reports-summary-cards';
import { FinancialTable } from '@/components/features/reports/financial-table';
import { AttendanceTable } from '@/components/features/reports/attendance-table';
import { ActivityTable } from '@/components/features/reports/activity-table';
import {
    FINANCIAL_DATA,
    ATTENDANCE_DATA,
    ACTIVITY_DATA,
    type ReportType,
} from '@/lib/mock-data-reports';
import { FileDown, Printer } from 'lucide-react';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export default function ReportsPage() {
    const [reportType, setReportType] = useState<ReportType>('financial');
    const [dateRange, setDateRange] = useState({
        start: getTodayDate(),
        end: getTodayDate(),
    });

    // Filter data based on date range
    const filteredFinancialData = FINANCIAL_DATA.filter(
        (item) => item.date >= dateRange.start && item.date <= dateRange.end
    );

    const filteredAttendanceData = ATTENDANCE_DATA.filter(
        (item) => item.date >= dateRange.start && item.date <= dateRange.end
    );

    const filteredActivityData = ACTIVITY_DATA.filter(
        (item) => item.date >= dateRange.start && item.date <= dateRange.end
    );

    // Export handlers
    const handleExportCSV = () => {
        // TODO: Implement CSV export
        console.log('Exporting CSV for', reportType);
    };

    const handleExportPDF = () => {
        // TODO: Implement PDF export
        console.log('Exporting PDF for', reportType);
        window.print();
    };

    // Get current data based on report type
    const getCurrentData = () => {
        switch (reportType) {
            case 'financial':
                return filteredFinancialData;
            case 'attendance':
                return filteredAttendanceData;
            case 'activity':
                return filteredActivityData;
            default:
                return [];
        }
    };

    const currentData = getCurrentData();
    const hasData = currentData.length > 0;

    return (
        <div className="flex h-full flex-col space-y-6 p-4 md:p-8">
            {/* Header & Controls */}
            <ReportsHeader
                reportType={reportType}
                onReportTypeChange={setReportType}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
            />

            {/* Summary Cards */}
            <ReportsSummaryCards reportType={reportType} />

            {/* Data Table Section */}
            {hasData ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        {reportType === 'financial' && (
                            <FinancialTable data={filteredFinancialData} />
                        )}
                        {reportType === 'attendance' && (
                            <AttendanceTable data={filteredAttendanceData} />
                        )}
                        {reportType === 'activity' && (
                            <ActivityTable data={filteredActivityData} />
                        )}
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden">
                        {reportType === 'financial' && (
                            <FinancialTable data={filteredFinancialData} />
                        )}
                        {reportType === 'attendance' && (
                            <AttendanceTable data={filteredAttendanceData} />
                        )}
                        {reportType === 'activity' && (
                            <ActivityTable data={filteredActivityData} />
                        )}
                    </div>
                </>
            ) : (
                // Empty State
                <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/20">
                    <div className="text-center">
                        <FileDown className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">
                            No records found
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            No records found for the selected date range.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
