'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileDown, Printer } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { type ReportType } from '@/lib/mock-data-reports';

interface ReportsHeaderProps {
    reportType: ReportType;
    onReportTypeChange: (type: ReportType) => void;
    dateRange: { start: string; end: string };
    onDateRangeChange: (range: { start: string; end: string }) => void;
    onExportCSV: () => void;
    onExportPDF: () => void;
}

export function ReportsHeader({
    reportType,
    onReportTypeChange,
    dateRange,
    onDateRangeChange,
    onExportCSV,
    onExportPDF,
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
                    <SelectTrigger className="w-full lg:w-[200px]">
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

                {/* Date Range Picker */}
                <div className="relative">
                    <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                            onDateRangeChange({
                                ...dateRange,
                                start: e.target.value,
                            })
                        }
                        className="w-full pl-9 lg:w-[160px]"
                    />
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="default"
                        onClick={onExportCSV}
                        className="w-full lg:w-auto"
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        <span className="hidden lg:inline">CSV</span>
                    </Button>
                    <Button
                        size="default"
                        onClick={onExportPDF}
                        className="w-full lg:w-auto"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        <span className="hidden lg:inline">Print</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
