/**
 * ResiboWise PH — shared money helpers (Kiro Task 1.2: signature stubs only).
 *
 * Contract per design 3.3:
 * - Amounts are positive safe integers of centavos. No floating-point
 *   arithmetic touches money.
 * - `parseAmount` parses with a strict regex (optional ₱/PHP, whitespace,
 *   thousands commas), splits on '.', builds whole*100 + fraction with
 *   integer math. Errors: EMPTY, NOT_A_NUMBER, NEGATIVE_OR_ZERO,
 *   TOO_MANY_DECIMALS, TOO_LARGE.
 * - `formatPeso` returns e.g. "₱1,234.50" using integer division and manual
 *   grouping (no toFixed on a float).
 *
 * STUB — implementation arrives with the domain task (3.x). Do not call
 * these from features yet; they throw.
 */

import type { AmountError, Centavos } from './types';

/** Discriminated result used by parseAmount (design 3.3). */
export type ParseAmountResult =
  | { ok: true; value: Centavos }
  | { ok: false; error: AmountError };

/**
 * Parse a peso amount string into centavos.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function parseAmount(_input: string): ParseAmountResult {
  throw new Error('not implemented: parseAmount (Task 1.2 stub)');
}

/**
 * Format centavos as a peso string, e.g. "₱1,234.50".
 * Integer division + manual thousands grouping; no float toFixed.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function formatPeso(_centavos: Centavos): string {
  throw new Error('not implemented: formatPeso (Task 1.2 stub)');
}
