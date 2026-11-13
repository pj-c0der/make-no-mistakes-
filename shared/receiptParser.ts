/**
 * ResiboWise PH — minimal receipt parser (Kiro Task 1.2: signature stubs only).
 *
 * Contract per design 5.1, 6.3:
 * - Pure, total function `parseReceipt(text: string): Omit<NormalizedExtraction, 'text'>`.
 * - Never throws; handles any text input gracefully.
 * - Extracts amounts, classifies lines by keywords (total, amount_due, subtotal,
 *   tax, cash, change, discount, unlabelled).
 * - Proposes payable total ONLY if exactly 1 distinct total/amount_due candidate
 *   exists; if >= 2 or 0, sets status: 'missing' and lists candidates so the user
 *   picks (4.2, 4.3). Never proposes subtotal, tax, cash, change, discount.
 * - Parses dates (ISO, month-name, numeric). Numeric A/B/YYYY with A,B<=12 and A!=B
 *   is ambiguous -> status: 'missing', parserNote: 'DATE_AMBIGUOUS_DD_MM'.
 * - Merchant: first candidate line among top 6 non-empty lines that is not a date,
 *   phone, amount, or receipt keyword. Weak proposal, editable.
 * - Text input is UNTRUSTED and display-only (rendered as plain text, 14.10).
 *
 * STUB — implementation arrives with Task 3.13. Do not call yet; throws.
 */

import type { NormalizedExtraction } from './types';

/**
 * Parse raw recognized text into parser proposals and candidates.
 * Pure, total function (never throws).
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function parseReceipt(
  _text: string,
): Omit<NormalizedExtraction, 'text'> {
  throw new Error('not implemented: parseReceipt (Task 1.2 stub)');
}