/**
 * ResiboWise PH — shared selectors (Kiro Task 1.2: signature stubs only).
 *
 * Contract per design 3.6 (pure, shared):
 *   sortTransactions(txs): Transaction[]               // purchaseDate desc, then createdAt desc, then id
 *   searchTransactions(txs, term): Transaction[]       // case-insensitive "contains" on merchant; empty term -> all
 *   summarizeMonth(txs, monthKey): { totalCentavos: number; count: number }
 *
 * The Dashboard derives its numbers from `transactions` at render time
 * (memoized), so totals are always consistent with the saved data (11.1).
 *
 * STUB — implementation arrives with the domain task (3.x). Do not call
 * from features yet; throws.
 */

import type { Centavos, Transaction } from './types';

/**
 * Sort: purchaseDate desc, then createdAt desc, then id (stable, deterministic).
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function sortTransactions(_txs: readonly Transaction[]): Transaction[] {
  throw new Error('not implemented: sortTransactions (Task 1.2 stub)');
}

/**
 * Case-insensitive "contains" filter on merchant. Empty/blank term -> all.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function searchTransactions(_txs: readonly Transaction[], _term: string): Transaction[] {
  throw new Error('not implemented: searchTransactions (Task 1.2 stub)');
}

export interface MonthSummary {
  totalCentavos: Centavos;
  count: number;
}

/**
 * Exact integer sum of transactions whose purchaseDate monthKey equals the
 * given "YYYY-MM" key. No float arithmetic.
 *
 * STUB: not implemented (Task 1.2 freeze — signatures only).
 */
export function summarizeMonth(_txs: readonly Transaction[], _monthKey: string): MonthSummary {
  throw new Error('not implemented: summarizeMonth (Task 1.2 stub)');
}