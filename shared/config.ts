/**
 * ResiboWise PH — shared limits and configuration (Kiro Task 1.2).
 *
 * Single configuration location for the whole app (Requirement 24.1).
 * Imported by BOTH the browser client (src/) and the Vercel function
 * (api/ + server/), so keep it platform-agnostic: no `process`, no
 * `import.meta.env`, no secrets. `CONFIG` holds non-secret values only
 * (design 5.4, 7.1).
 *
 * Value discipline (AGENTS.md, tasks.md "Rules that apply to every task"):
 * every value is one of
 *   - verified:     with a `VERIFIED: <source, date>` comment, or
 *   - provisional:  labelled PROVISIONAL with the deciding person/date,
 *   - UNSET:        0 / empty until a verified or approved provisional
 *                   value exists (Task 2.12 owns provisional values).
 *
 * UNSET values are deliberately not guessed. Nothing in this file claims
 * an Lumen endpoint, auth scheme, limit, format or rate (Task 1.2 rule).
 *
 * Contract freeze status: NOT frozen until both BELLEN (frontend) and
 * CLAVITE (backend) have reviewed.
 */

/**
 * Application limits. Values marked UNSET stay 0/empty until confirmed
 * from official organizer documentation or a team decision (Open Items).
 * Zero means "not configured" and consumers MUST fail closed on it
 * (design 5.4: "Values marked UNSET are deliberately not guessed").
 */
export const CONFIG = {
  /**
   * Image types the client may accept and the server may process.
   * UNSET until verified (Open Item 3). Filled by Task 2.12 — provisional,
   * labelled — until the Lumen contract is confirmed.
   */
  SUPPORTED_IMAGE_TYPES: [] as readonly string[],

  /** UNSET until verified (Open Item 3). 0 = not configured, fail closed. */
  MAX_IMAGE_BYTES: 0,

  /** UNSET until decided (Open Item 11). Must stay below Vercel maxDuration. */
  OCR_TIMEOUT_MS: 0,

  /** OCR_TIMEOUT_MS + client margin. UNSET until OCR_TIMEOUT_MS is set. */
  OCR_CLIENT_TIMEOUT_MS: 0,

  /** OCR request limit per client per window. UNSET until decided (Open Item 10). */
  OCR_RATE_LIMIT: { requests: 0, windowSeconds: 0 },

  /** Maximum merchant name length (design 3.2). */
  MERCHANT_MAX_LENGTH: 120,

  /**
   * Design cap of ₱999,999,999.99 in centavos (design 3.3).
   * Design choice, not a requirement; keeps sums far below MAX_SAFE_INTEGER.
   */
  MAX_AMOUNT_CENTAVOS: 99_999_999_999,

  /** Multipart envelope overhead reserved against the request-body limit (design 5.7). */
  MULTIPART_OVERHEAD_BYTES: 16_384,
} as const;

/**
 * Verified external limits, recorded ONLY after confirmation from an
 * official source (design 5.4, 5.5).
 *
 * Nothing is verified yet — all fields intentionally absent.
 * When the team confirms Vercel's documented 4.5 MB function body limit
 * from current Vercel documentation, `platformMaxBodyBytes` is set here
 * with a `VERIFIED: <source, date>` comment (design 5.5(a)).
 */
export const VERIFIED_LIMITS: {
  /** Maximum image size accepted by Lumen, in bytes (Open Item 3). */
  lumenMaxBytes?: number;
  /** Image types accepted by Lumen (Open Item 3). */
  lumenTypes?: readonly string[];
  /** Vercel function request-body limit in bytes (design 5.5(a)). */
  platformMaxBodyBytes?: number;
} = {};

/**
 * Stricter-of rule (Requirement 24.2): the effective limit is the minimum
 * of the defined (non-zero) values. Returns 0 when nothing is configured —
 * consumers fail closed (nothing may be uploaded).
 */
export function effectiveMaxBytes(): number {
  const candidates = [
    CONFIG.MAX_IMAGE_BYTES,
    VERIFIED_LIMITS.lumenMaxBytes,
    VERIFIED_LIMITS.platformMaxBodyBytes,
  ].filter((n): n is number => typeof n === 'number' && n > 0);
  return candidates.length === 0 ? 0 : Math.min(...candidates);
}

/**
 * Stricter-of rule for image types (Requirement 24.2): the intersection of
 * the configured list and the verified Lumen list.
 *
 * - CONFIG list empty (UNSET) -> [] (nothing accepted, fail closed).
 * - VERIFIED_LIMITS.lumenTypes absent -> the configured list as-is.
 * - both present -> intersection (empty intersection = nothing accepted).
 */
export function effectiveSupportedImageTypes(): readonly string[] {
  const configured = CONFIG.SUPPORTED_IMAGE_TYPES;
  if (configured.length === 0) return configured;
  const lumenTypes = VERIFIED_LIMITS.lumenTypes;
  if (lumenTypes === undefined) return configured;
  const lumenSet = new Set(lumenTypes);
  return configured.filter((type) => lumenSet.has(type));
}
