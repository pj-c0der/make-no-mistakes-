/**
 * ResiboWise PH — shared draft validation (Kiro Task 1.2: signature stubs only).
 *
 * Contract per design 4.3:
 * - `validateDraft(input: DraftInput, now: Date): ValidationResult`
 * - Validates:
 *     merchant: non-empty after trim (MERCHANT_REQUIRED)
 *     amount: parseAmount ok, > 0, <= MAX_AMOUNT_CENTAVOS
 *     date: valid calendar date (YYYY-MM-DD), not in the future in Asia/Manila
 * - Confirm button is enabled ONLY when `ok: true`.
 * - Mapping to requirements:
 *     AMOUNT_REQUIRED (6.1), AMOUNT_INVALID (6.2), AMOUNT_NOT_POSITIVE (6.3),
 *     AMOUNT_TOO_MANY_DECIMALS (6.4), DATE_REQUIRED/INVALID (6.5),
 *     DATE_IN_FUTURE (6.6), MERCHANT_REQUIRED (6.7).
 *
 * STUB — implementation arrives with the domain task (3.x). Do not call
 * from features yet; throws.
 */

import type { DraftInput, ValidationResult } from './types';

/**
 * Validate a user draft against all required rules.
 * Pure function; takes `now` so tests control the Manila date oracle.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function validateDraft(_input: DraftInput, _now: Date): ValidationResult {
  throw new Error('not implemented: validateDraft (Task 1.2 stub)');
}