'use client';

import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
    selectedYear: number;
    selectedMonth: number; // 0-11
    maxYear?: number; // Maximum year (default: current year)
    maxMonth?: number; // Maximum month when at maxYear (default: current month)
    onChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

/**
 * Format month and year for display
 * e.g., "March 2026"
 */
function formatMonthYear(year: number, month: number): string {
    return `${MONTH_NAMES[month]} ${year}`;
}

/**
 * Check if given year/month is current month
 */
function isCurrentMonth(year: number, month: number): boolean {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth();
}

export function MonthPicker({
    selectedYear,
    selectedMonth,
    maxYear,
    maxMonth,
    onChange,
}: MonthPickerProps) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Use provided max or default to current
    const effectiveMaxYear = maxYear ?? currentYear;
    const effectiveMaxMonth = maxYear !== undefined && maxYear === currentYear
        ? (maxMonth ?? currentMonth)
        : 11;

    const handlePrevMonth = () => {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        onChange(newYear, newMonth);
    };

    const handleNextMonth = () => {
        // Don't allow navigating past current month
        if (
            selectedYear >= effectiveMaxYear &&
            selectedMonth >= effectiveMaxMonth
        ) {
            return;
        }

        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        onChange(newYear, newMonth);
    };

    const handleCurrentMonth = () => {
        onChange(currentYear, currentMonth);
    };

    // Disable next button if at max month
    const isNextDisabled =
        selectedYear >= effectiveMaxYear &&
        selectedMonth >= effectiveMaxMonth;

    return (
        <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex min-w-[140px] items-center justify-center gap-2 px-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isCurrentMonth(selectedYear, selectedMonth) ? 'font-semibold' : ''}>
                        {formatMonthYear(selectedYear, selectedMonth)}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextMonth}
                    disabled={isNextDisabled}
                    aria-label="Next month"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleCurrentMonth}
                disabled={isCurrentMonth(selectedYear, selectedMonth)}
                className="text-xs"
            >
                Current Month
            </Button>
        </div>
    );
}
