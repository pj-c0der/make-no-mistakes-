/**
 * ResiboWise PH — shared draft mapping (Kiro Task 1.2: signature stubs only).
 *
 * Contract per design 4.4:
 * - `extractionToDraft(extraction: NormalizedExtraction | null): DraftState`
 *   is a pure function.
 * - Missing fields become empty strings with `needsInput: true`; proposed
 *   fields are prefilled with status 'proposed' (NEVER 'verified').
 * - A draft field becomes 'verified' only on Confirm (5.3–5.5).
 * - When `extraction` is null (manual entry after a failure or explicit
 *   "enter manually"), all three fields are empty and `needsInput: true`,
 *   and `candidates` is empty.
 *
 * Property 15: for any NormalizedExtraction (or none), extractionToDraft
 * yields empty, needsInput fields exactly where the extraction is missing,
 * prefilled proposals elsewhere, and no field with status 'verified'.
 *
 * STUB — implementation arrives with the domain task (3.x). Do not call
 * from features yet; throws.
 */

import type { DraftState, NormalizedExtraction } from './types';

/**
 * Map a normalized OCR extraction (or null for manual entry) to an editable
 * draft state.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function extractionToDraft(
  _extraction: NormalizedExtraction | null,
): DraftState {
  throw new Error('not implemented: extractionToDraft (Task 1.2 stub)');
}