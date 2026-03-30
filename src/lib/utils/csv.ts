/**
 * CSV Generation and Download Utilities
 */

/**
 * Generate CSV from array of objects
 */
export function generateCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: { key: keyof T; label: string }[]
): string {
    // Header row
    const headers = columns.map((c) => c.label).join(',');

    // Data rows
    const rows = data.map((row) => {
        return columns
            .map((col) => {
                const value = row[col.key];
                return formatCSVValue(value);
            })
            .join(',');
    });

    return [headers, ...rows].join('\n');
}

function formatCSVValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (
            value.includes(',') ||
            value.includes('"') ||
            value.includes('\n')
        ) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    return String(value);
}

/**
 * Download CSV file
 */
export function downloadCSV(filename: string, csvContent: string): void {
    const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

/**
 * Format currency for display in CSV
 */
export function formatCurrencyForCSV(amount: number): string {
    return `LKR ${amount.toLocaleString()}`;
}
