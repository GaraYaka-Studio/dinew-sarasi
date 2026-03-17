'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileDown } from 'lucide-react';
import { MonthPicker } from './month-picker';
import type { ReportType } from '@/types/reports';

interface ReportsHeaderProps {
    reportType: ReportType;
    onReportTypeChange: (type: ReportType) => void;
    selectedYear: number;
    selectedMonth: number;
    onMonthChange: (year: number, month: number) => void;
    onExport: () => void;
    isExporting?: boolean;
}

export function ReportsHeader({
    reportType,
    onReportTypeChange,
    selectedYear,
    selectedMonth,
    onMonthChange,
    onExport,
    isExporting = false,
}: ReportsHeaderProps) {
    const reportTypeOptions: { value: ReportType; label: string }[] = [
        { value: 'financial', label: 'Financial Statement' },
        { value: 'attendance', label: 'Attendance Log' },
        { value: 'activity', label: 'Activity Log' },
    ];

    return (
        <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Reports & Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                    View and export reports for your institute.
                </p>
            </div>

            {/* Center & Right: Controls */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Report Type Selector */}
                <Select
                    value={reportType}
                    onValueChange={(value) =>
                        onReportTypeChange(value as ReportType)
                    }
                >
                    <SelectTrigger className="w-full lg:w-52">
                        <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {reportTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Month Picker */}
                <MonthPicker
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    onChange={onMonthChange}
                />

                {/* Export Button */}
                <Button
                    variant="outline"
                    size="default"
                    onClick={onExport}
                    disabled={isExporting}
                    className="w-full lg:w-auto"
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline">
                        {isExporting ? 'Exporting...' : 'Export'}
                    </span>
                </Button>
            </div>
        </div>
    );
}
