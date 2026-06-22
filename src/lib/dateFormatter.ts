/**
 * Format a date to "day abbr-month, year" format
 * e.g., "14 May, 2029"
 */
export function formatDateCustom(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();

  // Format as "Day Month, Year" (e.g., "14 May, 2029")
  return `${day} ${month}, ${year}`;
}

/**
 * Get the ordinal suffix for a day number
 * (st, nd, rd, th)
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Format a date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Format a date to short format (MM/DD/YYYY)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}/${day}/${year}`;
}

/**
 * Format a date with time
 * e.g., "4th June, 2026 at 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDateCustom(d);
  const timeStr = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  return `${dateStr} at ${timeStr}`;
}
