/**
 * ResiboWise PH — shared date helpers (Kiro Task 1.2: signature stubs only).
 *
 * Contract per design 3.4:
 * - Purchase dates are stored as `IsoDate` strings ("YYYY-MM-DD"). A purchase
 *   date is a calendar date, so no time zone conversion is applied to it.
 * - "Today" is computed from an injected `now: Date` with
 *   `Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', ... }).formatToParts(now)`,
 *   reading year/month/day independently by part type and assembling
 *   YYYY-MM-DD by our own code. Never relies on a locale string layout.
 * - Asia/Manila has no DST, so a fixed UTC+8 offset is a valid independent
 *   test oracle; production code uses the Intl time zone.
 * - Month key = `purchaseDate.slice(0, 7)` ("YYYY-MM"). Month membership
 *   never uses Date parsing of the purchase date.
 * - Display format: "DD MMMM YYYY" ("05 March 2025") using a fixed English
 *   month-name table, not locale-dependent.
 * - All functions take `now` as a parameter so tests control it.
 *
 * STUB — implementation arrives with the domain task (3.x). Do not call
 * these from features yet; they throw.
 */

import type { IsoDate } from './types';

/**
 * Manila calendar date of the given instant, as "YYYY-MM-DD".
 * Throws a programming error if any part is missing (never guesses).
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function manilaToday(_now: Date): IsoDate {
  throw new Error('not implemented: manilaToday (Task 1.2 stub)');
}

/**
 * Month key "YYYY-MM" for the given purchase date.
 * Pure string slice; never uses Date parsing.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function monthKey(_purchaseDate: IsoDate): string {
  throw new Error('not implemented: monthKey (Task 1.2 stub)');
}

/**
 * Current month key for the given instant, in Asia/Manila.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function currentMonthKey(_now: Date): string {
  throw new Error('not implemented: currentMonthKey (Task 1.2 stub)');
}

/**
 * Display format "DD MMMM YYYY" ("05 March 2025") using a fixed English
 * month-name table.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function displayDate(_purchaseDate: IsoDate): string {
  throw new Error('not implemented: displayDate (Task 1.2 stub)');
}