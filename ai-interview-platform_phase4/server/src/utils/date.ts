/** Whole calendar days between two dates, ignoring time-of-day (UTC-based). */
export function calendarDaysBetween(earlier: Date, later: Date): number {
  const earlierMidnight = Date.UTC(earlier.getUTCFullYear(), earlier.getUTCMonth(), earlier.getUTCDate());
  const laterMidnight = Date.UTC(later.getUTCFullYear(), later.getUTCMonth(), later.getUTCDate());
  return Math.round((laterMidnight - earlierMidnight) / (1000 * 60 * 60 * 24));
}
