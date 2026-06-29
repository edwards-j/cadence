export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Format a number as a zero-padded 2-digit string: 1 → "01", 12 → "12". */
export const twoDigit = (n: number) => String(n).padStart(2, "0");

/** Format a duration in hours: 2.5 → "2.5h". */
export const formatHours = (h: number) => `${h}h`;

/** Round a duration to the nearest 0.5h increment, minimum 0.5h. */
export const snapToHalfHour = (h: number) => Math.max(0.5, Math.round(h * 2) / 2);

export function formatDateRange(start: Date, end: Date): string {
  const startStr = `${MONTHS[start.getMonth()]} ${start.getDate()}`;
  const endStr =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : `${MONTHS[end.getMonth()]} ${end.getDate()}`;
  return `${startStr} – ${endStr}`;
}
