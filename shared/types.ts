/**
 * ResiboWise PH — shared TypeScript contracts (Kiro Task 1.2).
 *
 * This file is the single source of truth for the data contracts shared by
 * the frontend (src/) and the server-side OCR function (api/ + server/).
 * Both sides import from here; no side may define its own conflicting copy
 * of these types (design Section 11.2; AGENTS.md shared-contract rules).
 *
 * Contract freeze status: NOT frozen until both BELLEN (frontend) and
 * CLAVITE (backend) have reviewed. Changes require both developers'
 * agreement.
 *
 * No Lumen-specific value appears anywhere in this file (Task 1.2 rule).
 * The Lumen response shape never leaves `lumenProvider.ts` (design 5.1).
 */

// ---------------------------------------------------------------------------
// Base primitives (design 3.2, 3.3)
// ---------------------------------------------------------------------------

/** ISO 8601 calendar date, "YYYY-MM-DD". A validated calendar date. */
export type IsoDate = string;

/** Positive safe integer number of centavos. No float arithmetic touches money. */
export type Centavos = number;

/** Discriminated result used by pure domain functions (design 3.3 `parseAmount`). */
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/** Error codes returned by `parseAmount` (design 3.3). */
export type AmountError =
  | 'EMPTY'
  | 'NOT_A_NUMBER'
  | 'NEGATIVE_OR_ZERO'
  | 'TOO_MANY_DECIMALS'
  | 'TOO_LARGE';

// ---------------------------------------------------------------------------
// Transaction model (design 3.2)
// ---------------------------------------------------------------------------

export interface Transaction {
  /** crypto.randomUUID(); created when the draft is created, reused on save (7.4). */
  id: string;
  schemaVersion: 1;
  /** Trimmed merchant name, 1..MERCHANT_MAX_LENGTH characters. */
  merchant: string;
  /** Manila calendar date as printed on the receipt / entered by the user. */
  purchaseDate: IsoDate;
  /** 1..MAX_AMOUNT_CENTAVOS. */
  amountCentavos: Centavos;
  /** ISO 8601 UTC instant. Bookkeeping only; never affects summaries. */
  createdAt: string;
  /** ISO 8601 UTC instant. Bookkeeping only; never affects summaries. */
  updatedAt: string;
  /** OPTIONAL enhancement (Req 15); core code treats this as opaque. */
  category?: string;
}

// ---------------------------------------------------------------------------
// OCR API contracts — ours, independent of Lumen (design 4.1, 4.2)
// ---------------------------------------------------------------------------

/** Recognized text from a receipt. Display-only; rendered as plain text (14.10). */
export interface NormalizedExtraction {
  /** Recognized text. Never trust it as structured data. */
  text: string;
  merchant: ProposedField<string>;
  purchaseDate: ProposedField<IsoDate>;
  payableTotal: ProposedTotal;
  /**
   * Informational notes detected by the parser, e.g. "DATE_AMBIGUOUS_DD_MM",
   * "DATE_MULTIPLE". Shown next to the affected field; never gate saving.
   */
  parserNotes: ParserNote[];
}

/** Parser-detected informational note (design 6.3). */
export type ParserNote = string;

/**
 * A single parser-derived field proposal.
 * "ambiguous" is represented as `status: 'missing'` plus non-empty candidates
 * on `ProposedTotal` (Requirement 3.3 defines only proposed or missing).
 */
export type ProposedField<T> =
  | {
      status: 'proposed';
      value: T;
      /** The receipt line the value came from, for user transparency. */
      evidence: string;
    }
  | { status: 'missing' };

export interface AmountCandidate {
  centavos: Centavos;
  /** The original text line the candidate came from. */
  line: string;
  label: AmountCandidateLabel;
}

/** Keyword classification of a monetary line (design 6.3 table). */
export type AmountCandidateLabel =
  | 'total'
  | 'amount_due'
  | 'subtotal'
  | 'tax'
  | 'cash'
  | 'change'
  | 'discount'
  | 'unlabelled';

/**
 * Payable total proposal. `missing` with non-empty `candidates` means the
 * user must type an amount or pick a candidate (6.4).
 */
export type ProposedTotal =
  | {
      status: 'proposed';
      centavos: Centavos;
      evidence: string;
      candidates: AmountCandidate[];
    }
  | {
      status: 'missing';
      candidates: AmountCandidate[];
    };

export type OcrErrorCode =
  | 'METHOD_NOT_ALLOWED'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'FILE_TOO_LARGE'
  | 'BAD_REQUEST'
  | 'FORBIDDEN_ORIGIN'
  | 'RATE_LIMITED'
  | 'NO_TEXT'
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_ERROR'
  | 'UPSTREAM_UNINTERPRETABLE'
  | 'SERVER_MISCONFIGURED'
  | 'OCR_DISABLED';

export interface OcrSuccessResponse {
  ok: true;
  requestId: string;
  /** 'mock' is only possible in local dev/tests; the UI shows a MOCK banner. */
  provider: 'lumen' | 'mock';
  extraction: NormalizedExtraction;
}

export interface OcrErrorResponse {
  ok: false;
  requestId: string;
  error: {
    code: OcrErrorCode;
    /** Safe, user-facing message. Never contains credentials or internals (14.8). */
    message: string;
    /** Present only for RATE_LIMITED. */
    retryAfterSeconds?: number;
  };
}

// ---------------------------------------------------------------------------
// Validation contracts (design 4.3)
// ---------------------------------------------------------------------------

/** Raw form values, before parsing. All strings as typed in the form. */
export interface DraftInput {
  merchant: string;
  /** As typed in the form; not yet guaranteed to be a valid IsoDate. */
  purchaseDate: string;
  /** As typed in the form; not yet guaranteed to be a valid amount. */
  amount: string;
}

export type FieldError =
  | 'MERCHANT_REQUIRED'
  | 'DATE_REQUIRED'
  | 'DATE_INVALID'
  | 'DATE_IN_FUTURE'
  | 'AMOUNT_REQUIRED'
  | 'AMOUNT_INVALID'
  | 'AMOUNT_NOT_POSITIVE'
  | 'AMOUNT_TOO_MANY_DECIMALS'
  | 'AMOUNT_TOO_LARGE';

export type ValidationResult =
  | {
      ok: true;
      value: { merchant: string; purchaseDate: IsoDate; amountCentavos: Centavos };
    }
  | {
      ok: false;
      errors: Partial<Record<'merchant' | 'purchaseDate' | 'amount', FieldError>>;
    };

// ---------------------------------------------------------------------------
// Draft contract (design 4.4, 6.2)
// ---------------------------------------------------------------------------

/**
 * A field is 'verified' ONLY after the user confirms (5.3–5.5). OCR output
 * is never verified on arrival.
 */
export type DraftFieldStatus = 'empty' | 'proposed' | 'verified';

export interface DraftTextField {
  /** '' when missing/empty. */
  value: string;
  status: DraftFieldStatus;
  /** True exactly where the extraction was missing and the user must act. */
  needsInput: boolean;
}

export interface DraftAmountField extends DraftTextField {
  /** Candidates offered when the total is missing/ambiguous (6.4). */
  candidates: AmountCandidate[];
}

export interface DraftState {
  /** crypto.randomUUID(); created when the draft enters Reviewing. Becomes Transaction.id on save. */
  id: string;
  merchant: DraftTextField;
  purchaseDate: DraftTextField;
  amount: DraftAmountField;
  /** Informational parser notes carried over from the extraction, if any. */
  parserNotes: ParserNote[];
}

// ---------------------------------------------------------------------------
// Storage contracts (design 3.5)
// ---------------------------------------------------------------------------

/** Safe, user-presentable storage failure. Never contains internals (3.5, 14.8). */
export interface StorageError {
  kind: 'quota' | 'unavailable' | 'unknown';
  message: string;
}

/**
 * `list()` returns invalid records untouched so the UI can offer recovery
 * (8.6). Write failures reject with `StorageError`.
 */
export interface TransactionListResult {
  valid: Transaction[];
  invalid: unknown[];
}

export interface TransactionRepository {
  /**
   * Open a read transaction, validate each stored record, and return the
   * valid/invalid split. Invalid records are not deleted or overwritten.
   */
  list(): Promise<TransactionListResult>;
  /** Read one transaction by id; a missing id resolves to undefined. */
  get(id: string): Promise<Transaction | undefined>;
  /**
   * Insert or replace by id (idempotent put, 7.4).
   * Rejects with StorageError on quota/unavailable/unknown write failure.
   */
  put(transaction: Transaction): Promise<void>;
  /** Delete a single record by id. */
  delete(id: string): Promise<void>;
}
