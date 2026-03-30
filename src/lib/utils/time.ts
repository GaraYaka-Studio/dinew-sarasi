/**
 * Time and date utility functions
 * Shared between server and client components
 */

// Constants
export const MINUTES_IN_DAY = 1440; // 24 hours in minutes
export const SESSION_BUFFER_MINUTES = 10; // Minutes before start time to consider session "current"

/**
 * Convert time string (HH:MM or HH:MM:SS) to minutes since midnight
 * Handles sessions that cross midnight (e.g., 22:00-00:00 becomes 22:00-24:00)
 *
 * @param timeStr - Time in HH:MM or HH:MM:SS format
 * @param startMinutes - Optional start minutes to detect midnight crossover
 * @returns Minutes since midnight, or -1 if invalid
 *
 * @example
 * timeToMinutes("08:00:00") // 480
 * timeToMinutes("22:00:00") // 1320
 * timeToMinutes("00:00:00", 1320) // 1440 (midnight crossover detected)
 */
export function timeToMinutes(
    timeStr: string | null,
    startMinutes?: number
): number {
    if (!timeStr) return -1;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const result = hours * 60 + minutes;

    // If this looks like an end time (00:00) and we have a start time that's later,
    // it means the session crosses midnight, so treat 00:00 as 24:00 (1440)
    if (result === 0 && startMinutes !== undefined && startMinutes > 0) {
        return MINUTES_IN_DAY;
    }

    return result;
}

/**
 * Format time from 24-hour format to 12-hour format with AM/PM
 *
 * @param time24 - Time in HH:MM or HH:MM:SS format
 * @returns Formatted time (e.g., "8:00 AM", "10:30 PM") or "--:--" if invalid
 *
 * @example
 * formatTime("08:00:00") // "8:00 AM"
 * formatTime("22:30:00") // "10:30 PM"
 * formatTime(null) // "--:--"
 */
export function formatTime(time24: string | null): string {
    if (!time24) return '--:--';

    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Get current date in YYYY-MM-DD format (local timezone)
 *
 * @returns Current date string
 */
export function getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get current time in minutes since midnight
 *
 * @returns Current time in minutes
 */
export function getCurrentMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

/**
 * Format a Date object to YYYY-MM-DD string
 *
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get date offset from today
 *
 * @param days - Number of days to offset (negative for past, positive for future)
 * @returns Date string in YYYY-MM-DD format
 */
export function getDateOffset(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

/**
 * Get current time in Sri Lanka timezone (UTC+5:30)
 * Returns time in HH:MM:SS format for database time column
 *
 * @returns Current time string in HH:MM:SS format (Sri Lanka timezone)
 */
export function getCurrentScanTime(): string {
    const now = new Date();
    // Convert to Sri Lanka timezone (UTC+5:30)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const sriLankaTime = new Date(utc + 3600000 * 5.5);

    const hours = String(sriLankaTime.getHours()).padStart(2, '0');
    const minutes = String(sriLankaTime.getMinutes()).padStart(2, '0');
    const seconds = String(sriLankaTime.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Get current timestamp in Sri Lanka timezone (UTC+5:30)
 * Returns Date object set to Sri Lanka timezone for database timestamp columns
 *
 * @returns Date object in Sri Lanka timezone
 */
export function getCurrentSriLankaTimestamp(): Date {
    const now = new Date();
    // Convert to Sri Lanka timezone (UTC+5:30)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * 5.5);
}
