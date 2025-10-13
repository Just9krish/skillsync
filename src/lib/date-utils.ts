/**
 * Format a date to a readable string format
 * @param date - Date object or null
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string or null if date is null
 */
export function formatDate(
    date: Date | null,
    options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }
): string | null {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}

/**
 * Format a date to a short format (MMM DD, YYYY)
 * @param date - Date object or null
 * @returns Formatted date string or null if date is null
 */
export function formatShortDate(date: Date | null): string | null {
    return formatDate(date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a date to a long format (Month DD, YYYY)
 * @param date - Date object or null
 * @returns Formatted date string or null if date is null
 */
export function formatLongDate(date: Date | null): string | null {
    return formatDate(date, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a date to time format (HH:MM AM/PM)
 * @param date - Date object or null
 * @returns Formatted time string or null if date is null
 */
export function formatTime(date: Date | null): string | null {
    return formatDate(date, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format a date to date and time format
 * @param date - Date object or null
 * @returns Formatted date and time string or null if date is null
 */
export function formatDateTime(date: Date | null): string | null {
    return formatDate(date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
