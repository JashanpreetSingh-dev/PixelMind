/**
 * Date helpers that use the browser's local timezone so "today" and calendar
 * dates match the user's location.
 */

/** Format a local Date as YYYY-MM-DD (calendar day in browser timezone). */
export function localDateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today's date in the browser's local timezone (YYYY-MM-DD). */
export function getTodayIso(): string {
  return localDateToIso(new Date());
}

/** Parse YYYY-MM-DD as a local calendar date (no UTC conversion). */
export function isoToLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
