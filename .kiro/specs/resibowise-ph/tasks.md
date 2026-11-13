# Implementation Plan: ResiboWise PH

## Overview

This plan turns `requirements.md` and `design.md` into small, verifiable tasks for a two-developer hackathon team (BELLEN and CLAVITE). The safe deadline is 2:00 PM. The smallest complete MVP comes first:

Receipt upload → Real Lumen OCR → ResiboVerify → Confirm and save → IndexedDB → Searchable history → Monthly dashboard → Deployment.

**Status: APPROVED FOR IMPLEMENTATION / EXECUTION.**

- Approval date: November 13, 2026.
- Approved by the ResiboWise PH development team: BELLEN — Frontend Developer; CLAVITE — Backend Developer.
- Approval record: BELLEN explicitly confirmed on November 13, 2026 that both team members reviewed and approved the requirements, design and tasks, and authorized implementation of the approved MVP, subject to task dependencies and documented external blockers. CLAVITE's approval is recorded as "confirmed by BELLEN on behalf of the team". The hackathon organizers have not approved these specifications.
- Approval means tasks are authorized to be executed. It does NOT mean any task is implemented: every checkbox remains unchecked. The AGENTS.md approval prerequisite (requirements → design → tasks) is satisfied by this recorded team decision.
- Decisions D1–D8 and C1 are resolved (see Notes). Unverified external items remain open under Blockers.

**Ownership (confirmed by BELLEN on behalf of the team).**

- **BELLEN (Frontend Developer):** React app foundation, frontend setup and UI components, app shell/navigation, upload + preview UI, ResiboVerify UI, client-side validation integration, IndexedDB and transaction history, monthly dashboard, frontend tests and responsive design.
- **CLAVITE (Backend Developer):** official Lumen API investigation, server-side OCR API, provider integration and parsing coordination, server-side image validation, backend API security and error handling, backend tests, Vercel functions and deployment.
- **Shared (both):** TypeScript contracts and config review, domain-logic coordination, integration testing, final deployment verification, README, presentation, submission.

**Stream-to-owner mapping (task numbers and dependencies unchanged).** Stream A → CLAVITE. Stream B → BELLEN. Domain tasks (group 3) → coordinated: BELLEN owns IndexedDB storage (3.19–3.22) and the money/date/selector/validation code used by the UI; CLAVITE owns the receipt parser (3.13–3.16) in coordination with the OCR function; either developer may take other Domain tasks. Shared → both. Task 1.1 (frontend scaffold) → BELLEN, and is not blocked by the Lumen contract.

**Workstream tags used in tasks below.**

- **Stream A** — backend (CLAVITE): OCR server function, Lumen adapter, upload validation, security, deployment.
- **Stream B** — frontend (BELLEN): shell, intake, ResiboVerify, history, dashboard, responsive layout.
- **Domain / Shared** — shared contracts, pure logic and storage, split as described above.

**Shared contracts (change only with both developers' agreement):** `shared/types.ts`, `shared/config.ts`, the `TransactionRepository` interface, the `NormalizedExtraction` contract, and the `OcrProvider` interface. `shared/config.ts` is edited only by 1.2, 2.12, 2.9 and 7.6, in that order, never in the same wave. Both developers review each of those edits.

**Reading the wave graph.** Waves are a logical ordering, not clock time. A task starts when all its listed prerequisites are done; a BLOCKED task starts when its blocker clears, regardless of wave number. A task never shares a wave with any of its prerequisites, and two tasks in one wave never edit the same file.

### Lumen unknowns: what truly blocks vs. what only constrains

Nothing below is assumed. Task 2.1 (immediate human action) converts each "unknown" into "confirmed from <source, date>" or leaves it unknown.

| Class | Unknown | Effect |
|---|---|---|
| **BLOCKS the real integration** (B1–B5) | B1 endpoint/URL and HTTP method (or SDK) to submit an image | `lumenProvider.ts` cannot be written (2.10) |
| | B2 how the issued key and secret are used (headers, signing, token exchange) | 2.10 cannot be written |
| | B3 request format for the image (multipart, base64, URL, other) and required parameters | 2.10 cannot be written |
| | B4 which response field holds the recognized text | 2.10 cannot map output |
| | B5 permission and a way to make one real request with a sample receipt | 2.11 and 5.3 cannot run |
| **CONSTRAINS (needed before the first real demo, but does not block writing adapter code)** | C-a supported image formats and max size (Lumen side) | Fills `SUPPORTED_IMAGE_TYPES` / `MAX_IMAGE_BYTES` (2.9). Until then only provisional, labelled values (2.12, per approved D8) exist. |
| | C-b error format, status codes, retry guidance | Adapter maps any non-success generically to `ProviderError`; refined once known |
| | C-c whether Lumen is callable from a Vercel-hosted function (network/IP restrictions) | Blocks the deployed real flow (7.5, 6.6), not local adapter work |
| **Does NOT block (tuning only)** | Lumen rate limits/quotas, typical latency, data-handling terms (privacy notice wording), attribution rules | Tune `OCR_RATE_LIMIT`, timeouts, notice text, demo |

Partially verified contracts: implement only the verified portions of the adapter in 2.10. Do not wait for Vercel `maxDuration`, WAF plan availability or other deployment settings to be resolved before implementing adapter code (2.10 does not depend on 7.3, 7.4 or 7.6).

**Blockers (nothing below is assumed resolved):**

- **BLOCKER-LUMEN:** B1–B5 above. These block provider-specific work (2.10, 2.11, 5.3, 6.5) but NOT Task 1.1 or other frontend/domain scaffolding. Tasks marked **BLOCKED** cannot start. No endpoint, auth scheme, request or response field, format, limit or SDK may be invented. Still unverified: Lumen endpoint, auth scheme, request/response structure, image size/format limits, permission to make a real request, Lumen reachability from Vercel, actual WAF configuration and deployment runtime settings.
- **BLOCKER-VERCEL-PLAN:** function `maxDuration`, WAF rate-limiting availability on the team's plan. These constrain deployment tasks (7.1, 7.4, 7.6) only.
- **BLOCKER-DECISIONS:** none outstanding. D1–D8 and C1 were resolved on November 13, 2026 (see Notes). Approved decisions do not verify any external value.

**Rules that apply to every task.**

- Mock OCR output never counts as a real OCR success. The mock exists for local development and automated tests only, and the MOCK banner must show whenever it is used.
- Missing or incomplete Lumen configuration never produces fake success: the API returns `SERVER_MISCONFIGURED` and the UI offers manual entry.
- Credentials live only in server-side environment variables. Never print, log or commit them. Never use a `VITE_` prefix for secrets. Credential protection checks (7.2 bundle check, 8.1 audit) are mandatory.
- Values in `shared/config.ts` are one of: **verified** (with a source comment), **provisional** (labelled `PROVISIONAL` with the deciding person/date, never described as verified) or **UNSET**. Never present a provisional value as verified.
- Do not stage, commit or push without explicit authorization.
- Task format: Stream, Depends on, Parallel, Done when. Every file has one owner at a time.

## Tasks

- [ ] 1. Foundation and early deployment checkpoint
  - [ ] 1.1 Scaffold the React + TypeScript + Vite + Tailwind app with a minimal route
    - Objective: create the project skeleton with minimal frontend dependencies only (React, React Router, Tailwind, Lucide React, selected shadcn/ui components: Button, Input, Label, Dialog/AlertDialog, Sonner, Select). Pin exact versions. Add the `idb` helper for IndexedDB. Add ESLint with `react/no-danger`. Use the package manager already configured in the repository, or npm if none. Provide one minimal placeholder route `/` and a placeholder not-found route so routing can be smoke-tested early (the real shell is built in 4.1, which replaces these files).
    - Stream: Shared. Depends on: none. Parallel: with 2.1.
    - Done when: `npm run build` exits 0 and `npm run dev` starts, which the developer checks by running it manually (the agent must not run dev servers); the lint script exists and runs.
    - _Requirements: 23.1, 23.2, 23.5, 14.10_
  - [ ] 1.2 Write the shared TypeScript contracts and stub signatures
    - Objective: create `shared/types.ts` (`Transaction`, `DraftInput`, `ValidationResult`, `FieldError`, `NormalizedExtraction`, `ProposedField`, `ProposedTotal`, `AmountCandidate`, `OcrSuccessResponse`, `OcrErrorResponse`, `OcrErrorCode`, `StorageError`, `TransactionRepository` interface, `DraftState`). Create `shared/config.ts` with `CONFIG` and `VERIFIED_LIMITS`; Lumen-dependent values stay UNSET and are never guessed; `effectiveMaxBytes` takes the stricter defined limit. Create stub files with signatures only for `money.ts`, `dates.ts`, `validation.ts`, `receiptParser.ts`, `selectors.ts` and `draft.ts`. Stubs throw `not implemented`.
    - Stream: Shared (both developers review). Depends on: 1.1. Parallel: with 1.3 and 1.4 (different files). This is the contract freeze for checkpoint 10.
    - Done when: `tsc --noEmit` passes; both developers have reviewed the contracts; no Lumen-specific value appears anywhere.
    - _Requirements: 24.1, 24.2, 3.2, 3.3, 8.3, 8.8_
  - [ ] 1.3 Add placeholder `/api` functions, SPA rewrite, local-dev approach and `.env.example`
    - Objective: create `api/ocr.ts` as a placeholder that returns HTTP 501 with a JSON body `{ ok: false, error: { code: "NOT_IMPLEMENTED" } }` for every method; it must not look like an `OcrSuccessResponse` and must never return a fabricated extraction. Create a temporary `api/health.ts` returning 200 with `{ status: "ok" }` only (basic service status; per D7 it MUST NOT disclose whether any individual secret environment variable is configured, and must not list variable names or values). Create a minimal `vercel.json` (SPA rewrite excluding `/api/*`). Create `.env.example` with variable NAMES only (`LUMEN_API_KEY`, `LUMEN_API_SECRET`, `LUMEN_BASE_URL` marked provisional, `OCR_PROVIDER`, `LOCAL_MOCK_OCR`, `OCR_DISABLED`). Update `.gitignore` to exclude `.env*` except `.env.example`. Write local-dev notes into `docs/local-dev-notes.md`: `vercel dev` primary, Vite `server.proxy` plus a local Node script as the documented alternative; do not add a dev dependency for the alternative without decision D3.
    - Stream: A. Depends on: 1.1. Parallel: with 1.2 and 1.4.
    - Done when: `.env.example` contains names only; `git check-ignore .env.local` confirms it is ignored; the placeholder responses are as described; the local-dev notes state which approach was actually verified, or say "not verified".
    - _Requirements: 14.1, 14.2, 23.3, 23.4_
    - Affected by decisions: D3, D7.
  - [ ] 1.4 Configure the test runner, scripts and basic build verification
    - Objective: add Vitest, fast-check, React Testing Library, user-event and fake-indexeddb as dev dependencies (pinned), and add `test` (single run, not watch), `typecheck` and `lint` scripts in `package.json`. Add one shared `numRuns` constant (default 50 or fewer; 25 for IndexedDB properties) in a test-only helper. No other test infrastructure (no Playwright).
    - Stream: Shared. Depends on: 1.1. Parallel: with 1.2 and 1.3.
    - Done when: `npm run test` runs a trivial passing test and exits 0; `npm run build` and `npm run typecheck` exit 0.
    - _Requirements: 23.1_
    - Affected by decision: D1.
  - [ ] 1.5 Early Vercel deployment smoke test (placeholder only, NOT Lumen)
    - Objective: manually deploy the scaffold to Vercel (project link and deploy require the team's Vercel account and explicit authorization) and verify, on the deployed URL: (a) the frontend builds and is served over HTTPS; (b) the SPA rewrite works (direct load and refresh of `/` and of an unknown route do not 404 at the host); (c) `/api/*` is routed to functions and not swallowed by the SPA rewrite: `POST /api/ocr` returns the placeholder 501 `NOT_IMPLEMENTED` JSON; (d) environment configuration readiness: server environment variable NAMES can be set in the Vercel project (credentials may be left unset at this stage; set them only in the Vercel dashboard, never in files); `/api/health` returns only basic service status and reveals nothing about which secrets are configured, so env readiness is checked in the Vercel dashboard, not through the endpoint; (e) basic deployed response handling: status codes, JSON content type and absence of stack traces or paths in error bodies; (f) the bundle secrets check (7.2) passes on the build output. Record the deployed URL, date and every observed result in `docs/vercel-smoke-test.md`. Note any function duration or body-size behavior observed, as input to 7.3.
    - **The placeholder OCR endpoint is NOT a working Lumen integration.** This task makes no Lumen call, needs no Lumen credentials, and its completion does NOT satisfy Requirement 1.1, 1.2 or any "real Lumen" claim. The final production deployment (7.5) and the real end-to-end test (6.6) remain required.
    - Stream: A (the other developer observes from a phone). Depends on: 1.3, 7.2. Parallel: with 1.6, 2.2 and other wave-2/3 work; it must not edit `src/app/` (owned by 4.1).
    - Done when: all of (a)–(f) are recorded as pass or fail in `docs/vercel-smoke-test.md`, failures stated honestly; the record states explicitly that no Lumen integration was exercised.
    - _Requirements: 23.3, 23.4, 14.1, 14.2_
  - [ ] 1.6 Draft the README early
    - Objective: write the first `README.md` draft: project purpose, stack, local setup and scripts as they exist, environment variable NAMES, the browser-local storage limitation, the "recorded expenses only" meaning, and clearly marked `TODO: verify` placeholders for Lumen usage, deployment URL, WAF status and test results. Do not state anything unverified as fact. Task 8.2 later fills in the verified results.
    - Stream: Shared (one author). Depends on: 1.3, 1.4. Parallel: yes.
    - Done when: `README.md` exists, contains no credentials, and every unverified statement is marked `TODO: verify`.
    - _Requirements: 8.7, 10.6, 23.1_

- [ ] 2. Lumen OCR integration and server security (Stream A)
  - [ ] 2.1 IMMEDIATE HUMAN ACTION: obtain the official Lumen documentation (start now, wave 0)
    - Objective: a team member asks the hackathon organizers right away (in person or through the official channel) for the official Lumen OCR documentation or written answers to the design Section 5.6 checklist, and for permission and a way to make one real request with a sample receipt. This is an investigation that can be completed today; it is not "cannot be investigated". Record each finding, with source and date, in `docs/lumen-contract-notes.md`, classified as B1–B5, C-a–C-c or tuning per the table above. Never write credentials in it. Report to the team as soon as B1–B5 are answered, even if C-a–C-c are still open, so 2.10 can start immediately; a partial contract unlocks the verified portions of 2.10.
    - Status: the human action starts at once. Provider-specific implementation (2.10, 2.11) stays **BLOCKED** until B1–B5 are confirmed from an official source. If the organizers cannot supply them, report that Requirement 1.1 is at risk. Do not guess.
    - Stream: A (either developer). Depends on: none. Parallel: with 1.1. Start immediately.
    - Done when: every checklist item is either "confirmed from <source, date>" or "unknown" and classified; the team has been told which of B1–B5 remain open.
    - _Requirements: 1.1, 1.2, 14.1; Open Items 1–7_
  - [ ] 2.2 Implement the provider interface, errors, mock provider, factory guard and shared image validation
    - Objective: create `server/ocr/provider.ts` (`OcrProvider`, `RawOcrResult`, `ProviderError`, `createProvider`), `server/ocr/errors.ts` (whitelisted error-code mapping with safe messages), `server/ocr/mockProvider.ts` with 2–3 fixture receipt texts, and `shared/imageValidation.ts` (`validateImageFile(file description, limits)`: type, size, empty file, magic bytes; limits are passed in so tests never need real Lumen values). `createProvider` allows the mock only if `OCR_PROVIDER=mock`, `LOCAL_MOCK_OCR=true`, `NODE_ENV!=='production'`, and `VERCEL_ENV` is unset or `development`. Otherwise it throws `ProviderError('misconfigured')`. Until 2.10 lands, the Lumen provider throws `misconfigured`; missing config never yields a successful extraction.
    - Stream: A. Depends on: 1.2, 1.4. Parallel: yes (with Domain tasks and 4.1).
    - Done when: typecheck passes; example tests in 6.2 and 6.3 can run against these modules; the mock response carries `provider: 'mock'`.
    - _Requirements: 1.4, 14.8, 2.4, 2.5, 2.6, 24.1, 24.2_
    - Affected by decision: D5.
  - [ ] 2.3 Implement upload validation, the handler pipeline and the real `api/ocr.ts` entry
    - Objective: write `server/ocr/validateUpload.ts` and `server/ocr/handler.ts` following design Section 5.3: method, kill switch, same-origin, content-type and content-length, single `receipt` part, actual size, MIME and magic bytes, `AbortController` timeout, provider call, error mapping, the real `parseReceipt` from 3.13, safe log record (`requestId`, status, errorCode, duration, size; never bytes, text or headers). The handler accepts an injected provider so tests need no env flags. If `OCR_TIMEOUT_MS` or the supported type list is UNSET, the handler fails closed with `SERVER_MISCONFIGURED`. Replace the placeholder body of `api/ocr.ts` with the handler wiring.
    - Stream: A. Depends on: 2.2, 3.13, 2.12. Parallel: no (owns `server/ocr/handler.ts` until 2.4 is done).
    - Done when: a direct handler call with the mock provider returns `NormalizedExtraction`; 405, 413, 415 and the other whitelisted error paths return the whitelisted codes; typecheck passes; no log line contains image data or recognized text.
    - _Requirements: 3.1, 3.2, 3.5, 3.6, 3.7, 14.3, 14.4, 14.7, 14.8, 7.2_
  - [ ] 2.4 Add the best-effort in-memory rate limiter and kill switch handling
    - Objective: write `server/ocr/rateLimit.ts` (sliding window per client IP from the platform forwarded header; limits from `CONFIG.OCR_RATE_LIMIT`; returns `RATE_LIMITED` with `retryAfterSeconds`) and wire it into `handler.ts`. State in a code comment that it is per-instance only and does not satisfy 14.5 alone.
    - Stream: A. Depends on: 2.3. Parallel: with other wave tasks that touch other files.
    - Done when: sequential requests beyond the limit receive `RATE_LIMITED` with a positive `retryAfterSeconds`; the code comment about the per-instance limitation exists.
    - _Requirements: 14.5, 14.6_
    - Affected by decision: D4.
  - [ ]* 2.5 Write property test for the in-memory limiter
    - **Property 19: In-memory limiter never exceeds its window limit**
    - Own file `server/ocr/rateLimit.property.test.ts`. Optional tier; scheduled after the first deployed demo (it has no dependents).
    - Depends on: 2.4.
    - **Validates: Requirements 14.6**
  - [ ]* 2.6 Write property test for upload validation
    - **Property 16: Upload validation accepts exactly valid files, with stricter limits winning**
    - Own file `shared/imageValidation.property.test.ts`. Optional tier; the boundary example tests in 6.3 stay mandatory.
    - Depends on: 2.2.
    - **Validates: Requirements 2.4, 2.5, 2.6, 14.3, 24.2**
  - [ ]* 2.7 Write property test for the method and content-type gate
    - **Property 17: Method and content-type gate**
    - Own file `server/ocr/gate.property.test.ts`. Optional tier.
    - Depends on: 2.3.
    - **Validates: Requirements 14.4**
  - [ ] 2.8 Write property test for safe error responses
    - **Property 18: Error responses never leak secrets or upstream bodies**
    - Own file `server/ocr/errors.property.test.ts`. Mandatory. Use fake credential strings and provider failures carrying arbitrary text; assert the response body contains none of it.
    - Depends on: 2.3.
    - **Validates: Requirements 14.2, 14.8**
  - [ ] 2.9 Record Lumen-verified limits into `shared/config.ts`
    - Objective: replace provisional values with verified ones: `SUPPORTED_IMAGE_TYPES`, `MAX_IMAGE_BYTES` and `VERIFIED_LIMITS.lumenMaxBytes` / `lumenTypes` from the Lumen documentation (2.1, class C-a). The documented Vercel request-body limit may also be recorded in `VERIFIED_LIMITS.platformMaxBodyBytes` after the team confirms the exact byte value from the current Vercel documentation. Cite the source in a comment on every value. Leave unconfirmed values UNSET or provisional (as set by 2.12).
    - Status: **BLOCKED** on 2.1 for Lumen-side limits (C-a). It does not depend on 7.3, 7.4 or any Vercel plan setting.
    - Stream: A (edits a shared contract; the other developer reviews). Depends on: 1.2, 2.1, 2.12. Parallel: no.
    - Done when: every changed value is confirmed with a source comment or explicitly left UNSET/PROVISIONAL; `effectiveMaxBytes()` cannot return more than the stricter known limit; typecheck passes.
    - _Requirements: 24.1, 24.2, 2.4, 2.6_
    - Affected by decision: D1.
  - [ ] 2.10 Implement the real `lumenProvider.ts` adapter (verified portions only)
    - Objective: implement `recognize()` strictly per the verified contract in `docs/lumen-contract-notes.md`; map every failure to `ProviderError` kinds; honor the abort signal; read credentials only from server environment variables; keep the Lumen response shape inside this file; never copy upstream bodies into errors or logs. Register it in `createProvider` as the default. If only part of the contract is verified, implement only the verified part and leave the rest throwing `misconfigured`. Do not wait for Vercel `maxDuration`, WAF plan or `OCR_TIMEOUT_MS` finalization; the adapter honors whatever abort signal the handler passes.
    - Status: **BLOCKED** until B1–B4 are confirmed (see the table in the Overview). Do not invent endpoints, headers, SDKs or fields.
    - Stream: A. Depends on: 2.1, 2.2. Parallel: with 2.9 (different files).
    - Done when: typecheck passes; with credentials absent the provider yields `SERVER_MISCONFIGURED`; every implemented request/response detail cites a line in `docs/lumen-contract-notes.md`.
    - _Requirements: 1.1, 1.2, 1.3, 14.1, 14.2, 14.8_
  - [ ] 2.11 Run one real OCR request with an authorized sample receipt and report the true result
    - Objective: with credentials in an untracked `.env.local`, send one authorized sample receipt through the handler and the real adapter. Record in `docs/lumen-contract-notes.md` a dated, honest outcome: success or failure, latency, and what the response contained, with no receipt text beyond what the owner authorized and no credentials. A mock result never satisfies this task.
    - Status: **BLOCKED** until 2.10 and B5 (permission and a sample receipt).
    - Stream: A. Depends on: 2.3, 2.4, 2.9, 2.10, 2.12. Parallel: no.
    - Done when: the notes record the real outcome; if it failed, the failure and the next step are recorded and the team has been told.
    - _Requirements: 1.1, 1.2, 3.1_
  - [ ] 2.12 Set provisional (non-verified) configuration values
    - Objective: in `shared/config.ts`, set values the team can decide without external documentation, each labelled `PROVISIONAL`: `OCR_TIMEOUT_MS` (a team-chosen conservative value; Open Item 11), `OCR_CLIENT_TIMEOUT_MS` (timeout plus margin), `OCR_RATE_LIMIT` (D4/Open Item 4). Per approved decision D8, also set provisional dev-only `SUPPORTED_IMAGE_TYPES` and `MAX_IMAGE_BYTES` so the local mock flow can run before the Lumen documentation arrives; these are never described as Lumen-verified and are replaced by 2.9. Anything not decided stays UNSET.
    - Stream: A (shared contract; the other developer reviews). Depends on: 1.2. Parallel: yes (no other task edits `shared/config.ts` in this wave).
    - Done when: every value is marked PROVISIONAL with a short rationale, or UNSET; typecheck passes.
    - _Requirements: 24.1, 3.7, 14.5_
    - Affected by decisions: D4, D8.

- [ ] 3. Domain logic and storage (Domain)
  - [ ] 3.1 Implement exact PHP money handling
    - Objective: implement `shared/money.ts`: `parseAmount` (strict string parse into integer centavos; error codes per design Section 3.3), `formatPlain`, `formatPeso` (`₱1,234.50`, integer math, no float `toFixed`), `sumCentavos`. The cap is `MAX_AMOUNT_CENTAVOS`.
    - Stream: Domain. Depends on: 1.2. Parallel: yes.
    - Done when: typecheck passes; `parseAmount('1,234.50')` is 123450; `'12.345'`, `'0'`, `'-5'`, `''` and `'abc'` are rejected with the specific code.
    - _Requirements: 6.2, 6.3, 6.4, 8.3, 10.5, 24.5_
  - [ ] 3.2 Write property test for the peso round trip
    - **Property 1: Peso amount round trip**
    - Own file `shared/money.p1.property.test.ts`. Mandatory.
    - Depends on: 3.1.
    - **Validates: Requirements 6.2, 8.3, 24.5**
  - [ ] 3.3 Write property test for the amount parser
    - **Property 2: Amount parser accepts exactly valid PHP amounts**
    - Own file `shared/money.p2.property.test.ts`. Mandatory.
    - Depends on: 3.1.
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
  - [ ] 3.4 Implement Asia/Manila date handling
    - Objective: implement `shared/dates.ts`: `manilaToday(now)` using `Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', ... }).formatToParts(now)`. Read year, month and day independently by part `type`, zero-pad them, and throw if a part is missing. Never parse a locale-formatted string. Add `currentMonthKey`, `monthKey` (string prefix), `isRealCalendarDate`, `displayDate` (`05 March 2025`, fixed English month table). All functions take `now` as a parameter.
    - Stream: Domain. Depends on: 1.2. Parallel: yes.
    - Done when: typecheck passes; `2025-03-05T16:30:00Z` gives Manila date `2025-03-06`; `2025-02-30` is rejected.
    - _Requirements: 6.5, 6.6, 10.1, 24.3, 24.4_
  - [ ] 3.5 Write property test for Manila date boundaries
    - **Property 4: Manila date and month boundaries**
    - Own file `shared/dates.property.test.ts`. Mandatory. The oracle is a fixed UTC+8 offset applied to the instant.
    - Depends on: 3.4.
    - **Validates: Requirements 6.6, 10.1, 24.3, 24.4**
  - [ ] 3.6 Implement draft validation
    - Objective: implement `shared/validation.ts` `validateDraft(input, now)` with the field error codes of design Section 4.3. Merchant is trimmed and limited by `MERCHANT_MAX_LENGTH`. The date must be real and not later than the Manila today. The amount uses `parseAmount`. One function serves OCR, manual and edit drafts.
    - Stream: Domain. Depends on: 3.1, 3.4. Parallel: yes.
    - Done when: typecheck passes; blank merchant, bad date, future date, empty and invalid amounts each return their own error; a valid input returns `ok: true` with centavos.
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_
  - [ ] 3.7 Write property test for draft validation
    - **Property 3: Draft validation matches the field rules**
    - Own file `shared/validation.property.test.ts`. Mandatory.
    - Depends on: 3.6.
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8**
  - [ ] 3.8 Implement selectors and monthly totals
    - Objective: implement `shared/selectors.ts`: `sortTransactions`, `searchTransactions`, `summarizeMonth` (integer sum, month by string prefix), `currentMonthKey` re-export. All pure.
    - Stream: Domain. Depends on: 3.1, 3.4. Parallel: yes.
    - Done when: typecheck passes; an empty month returns `{0, 0}`; totals equal the exact integer sum for a sample list.
    - _Requirements: 9.1, 9.2, 9.3, 10.2, 10.3, 10.4, 10.5, 10.7, 11.5_
  - [ ] 3.9 Write property test for monthly summaries
    - **Property 5: Monthly summary is the exact integer sum**
    - Own file `shared/summary.property.test.ts`. Mandatory. Oracle is a `BigInt` sum.
    - Depends on: 3.8.
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.5, 10.7, 11.5**
  - [ ] 3.10 Write property test for edit and delete deltas
    - **Property 6: Edits and deletes change totals by exact deltas**
    - Own file `shared/deltas.property.test.ts`. Mandatory.
    - Depends on: 3.8.
    - **Validates: Requirements 9.8, 11.2, 11.3, 11.4, 11.6**
  - [ ]* 3.11 Write property test for history ordering
    - **Property 7: History ordering**
    - Own file `shared/sort.property.test.ts`. Optional tier; scheduled after the first deployed demo.
    - Depends on: 3.8.
    - **Validates: Requirements 9.1**
  - [ ]* 3.12 Write property test for search
    - **Property 8: Search filters by merchant, case-insensitively**
    - Own file `shared/search.property.test.ts`. Optional tier; scheduled after the first deployed demo.
    - Depends on: 3.8.
    - **Validates: Requirements 9.2, 9.3**
  - [ ] 3.13 Implement the conservative receipt parser and fixtures
    - Objective: implement `shared/receiptParser.ts` `parseReceipt(text)` per design Section 6.3: amount candidates labelled by keyword; payable total proposed only when exactly one distinct amount sits on total/amount-due lines, otherwise `missing` with all candidates; dates proposed only when unambiguous (ISO, month-name, numeric with one part >12 or equal parts), `DATE_AMBIGUOUS_DD_MM` and `DATE_MULTIPLE` notes, no two-digit years; merchant from the first plausible line among the first six. The parser is total and never throws. Add anonymized Philippine receipt text fixtures (VAT line, SC/PWD discount, subtotal/cash/change) in `shared/fixtures/`.
    - Stream: Domain. Depends on: 1.2, 3.1, 3.4. Parallel: yes. Prerequisite of 2.3 (the handler uses the real parser; no pass-through stub).
    - Done when: typecheck passes; fixtures with a subtotal, cash and change never propose those amounts; a fixture with total and a different amount due returns `missing` with both candidates.
    - _Requirements: 3.2, 3.3, 4.1, 4.2, 4.3, 4.4_
    - Note: Open Item 9 (receipt layouts) is tuned later using real sample receipts.
  - [ ] 3.14 Write property test for parser totality
    - **Property 12: Parser is total and only proposes well-formed values**
    - Own file `shared/parser.p12.property.test.ts`. Mandatory.
    - Depends on: 3.13.
    - **Validates: Requirements 3.2, 3.3**
  - [ ] 3.15 Write property test for payable total proposals
    - **Property 13: Payable total is proposed only when unambiguous and labelled**
    - Own file `shared/parser.p13.property.test.ts`. Mandatory.
    - Depends on: 3.13.
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [ ] 3.16 Write property test for ambiguous dates
    - **Property 14: Ambiguous numeric dates are never guessed**
    - Own file `shared/parser.p14.property.test.ts`. Mandatory.
    - Depends on: 3.13.
    - **Validates: Requirements 3.3, 4.4, 5.3**
  - [ ] 3.17 Implement the extraction-to-draft mapping
    - Objective: implement `shared/draft.ts` `extractionToDraft(extraction | null)` per design Section 4.4. Missing fields become empty with `needsInput`; proposals are prefilled with status `proposed`. Nothing is ever `verified` until Confirm. The draft `id` is created with `crypto.randomUUID()` when the draft is created.
    - Stream: Domain. Depends on: 1.2. Parallel: yes.
    - Done when: typecheck passes; a null extraction gives an all-empty draft; no field has status `verified`.
    - _Requirements: 5.3, 5.4, 5.5, 7.2_
  - [ ]* 3.18 Write property test for draft mapping
    - **Property 15: Draft mapping never marks proposals as verified**
    - Own file `shared/draft.property.test.ts`. Optional tier; scheduled after the first deployed demo.
    - Depends on: 3.17.
    - **Validates: Requirements 5.3, 5.4, 5.5**
  - [ ] 3.19 Implement the IndexedDB transaction repository
    - Objective: implement `src/storage/transactionRepository.ts` using `idb`: database `resibowise` v1, store `transactions` (keyPath `id`, index `byPurchaseDate`), `list()` returning `{ valid, invalid }` with a record type guard, `get`, `put` (idempotent by id), `delete`. Invalid records are never deleted or overwritten without an explicit `clearInvalid()` call. Write errors become typed `StorageError` (`quota`, `unavailable`, `unknown`). Call `navigator.storage.persist()` best effort after the first save. Update uses a single read-write transaction.
    - Stream: Domain. Depends on: 1.2. Parallel: yes.
    - Done when: typecheck passes; a saved transaction is readable after reopening the database (verified by 3.20); a quota-like failure yields `StorageError`, not a thrown raw error.
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.8, 7.4_
  - [ ] 3.20 Write property test for the repository round trip
    - **Property 9: Repository round trip and reload**
    - Own file `src/storage/repository.p9.property.test.ts`. Mandatory. Use `fake-indexeddb` and the lower `numRuns` (25 or fewer).
    - Depends on: 3.19, 1.4.
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.8**
  - [ ]* 3.21 Write property test for confirm idempotence
    - **Property 10: Confirm is idempotent**
    - Own file `src/storage/repository.p10.property.test.ts`. Optional tier; the example test in 6.4 covers 7.4 in the mandatory scope.
    - Depends on: 3.19.
    - **Validates: Requirements 7.4**
  - [ ]* 3.22 Write property test for corrupt-data quarantine
    - **Property 11: Corrupt stored data is quarantined, not destroyed**
    - Own file `src/storage/repository.p11.property.test.ts`. Optional tier; the example test in 6.4 covers 8.6 in the mandatory scope.
    - Depends on: 3.19.
    - **Validates: Requirements 8.6**

- [ ] 4. Core frontend (Stream B)
  - [ ] 4.1 Build the app shell, routing, state context and feedback regions
    - Objective: create `src/app/`: router with routes `/`, `/verify`, `/history`, `/history/:id/edit`, `/dashboard`, each pointing at its own placeholder file under `src/features/*` (later tasks replace only their own file, so no one edits the router again); replace the placeholder routes from 1.1; bottom tab bar under 768 px and top nav at 768 px or wider; toast region; shell-level error boundary that never discards stored data; transactions context (`transactions`, `status: loading | ready | recovery | error`, mutations) written against the `TransactionRepository` interface with an in-memory stub until 5.1; `StorageNotice` stating that data is stored only in this browser on this device.
    - Stream: B. Depends on: 1.2. Parallel: yes.
    - Done when: typecheck and build pass; every route renders its placeholder; the storage notice is visible on every page; navigation targets are at least 44 px.
    - _Requirements: 8.7, 12.1, 12.2, 12.4, 13.2, 13.3_
  - [ ] 4.2 Implement `OcrClient` and the single error-message table
    - Objective: `src/features/intake/ocrClient.ts` `processReceipt(file, signal)` posting multipart to `/api/ocr`, aborting at `OCR_CLIENT_TIMEOUT_MS`, mapping `OcrErrorResponse` and client-side failures (network, abort, undecodable) to typed errors. Create `src/features/intake/errorMessages.ts`: one table keyed by error code, each entry with a message that says what failed and a next-step action (Retry, Reselect, Manual entry).
    - Stream: B. Depends on: 1.2, 2.2 (error codes). Parallel: yes.
    - Done when: typecheck passes; a table-driven unit test confirms every `OcrErrorCode` has a message and an action; unknown codes fall back to a generic message with Retry and Manual entry.
    - _Requirements: 3.1, 3.5, 3.6, 3.7, 13.3_
  - [ ] 4.3 Build `IntakePanel`: upload, camera capture, preview, privacy gate
    - Objective: `src/features/intake/IntakePanel.tsx` with a file input (`accept` from config), `capture` where available, client validation through `validateImageFile` plus a decode check (`createImageBitmap` or `Image`), object-URL preview, the one-time privacy notice (acknowledged flag in localStorage; Process is disabled until acknowledged), the Process button, and a manual-entry link. Use the specific messages in design Section 5.7 (unsupported type, too large with sizes, unreadable, empty). Revoke object URLs on discard.
    - Stream: B. Depends on: 4.1, 2.2, 2.12. Parallel: yes.
    - Done when: typecheck and build pass; selecting a wrong-type, oversized, empty and undecodable file each shows its own message and does not allow Process; a valid file shows a preview.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 14.9_
    - Affected by decision: D2 (oversize files are rejected, not downscaled).
  - [ ] 4.4 Build `ProcessingState` (loading, cancel and error panels)
    - Objective: `src/features/intake/ProcessingState.tsx`: text loading indicator ("Reading receipt…") with Cancel; error panels with Retry, Reselect and Manual entry actions from the message table; the Process button disabled while a request is in flight; a visible "MOCK OCR — not Lumen" banner when the response says `provider: 'mock'`.
    - Stream: B. Depends on: 4.2, 4.3. Parallel: yes.
    - Done when: a component test with a stubbed `OcrClient` shows loading, then each error panel with its actions; a second Process click during flight sends no second request; state is conveyed by text, not color only.
    - _Requirements: 3.5, 3.6, 3.7, 3.8, 13.1, 13.3, 13.5, 1.4_
  - [ ] 4.5 Build the ResiboVerify editable form
    - Objective: `src/features/verify/ResiboVerify.tsx` (reusable for edit through props): image beside the form at 768 px or wider and stacked below that; merchant, date and total fields; "needs your input" markers; total candidate picker (choosing a candidate fills the input but does not confirm); parser notes beside fields; inline error text from `validateDraft`; manual entry opens the same form with an empty draft; the image stays viewable whether or not it is retained. Nothing is displayed as verified before Confirm; the UI does not claim a proposed total is correct.
    - Stream: B. Depends on: 3.6, 3.17, 4.1. Parallel: yes.
    - Done when: a component test shows missing fields marked, a candidate pick fills the amount, invalid values show the specific messages and disable Confirm; no write to storage occurs on render.
    - _Requirements: 4.2, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 12.3_
  - [ ] 4.6 Implement explicit confirmation, save feedback and the discard guard
    - Objective: Confirm calls one idempotent `put` with the draft id and is disabled while saving; success shows a success message and navigates; a `StorageError` keeps the draft on screen, shows an error and never shows success; a router blocker with a confirmation dialog guards in-app navigation away from a dirty draft (a browser `beforeunload` generic prompt covers tab close; documented limitation); object URLs are revoked after save or discard. Owns `ResiboVerify.tsx` edits in its wave.
    - Stream: B. Depends on: 4.5, 5.1. Parallel: no for `ResiboVerify.tsx`.
    - Done when: a component test confirms double-click saves one record, a stubbed quota error keeps the draft and shows an error, and leaving a dirty draft prompts.
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.5, 13.2, 13.3_
  - [ ] 4.7 Build `HistoryList` with search
    - Objective: `src/features/history/HistoryList.tsx`: newest-first list, case-insensitive merchant search, no-results message including the search term, and an empty state with a call to action that links to Add receipt. Dates are shown as `DD MonthName YYYY` and amounts as `₱x,xxx.xx`.
    - Stream: B. Depends on: 3.8, 4.1. Parallel: yes.
    - Done when: a component test confirms ordering, search match and clear, the no-results text with the term, and the empty state.
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.9, 13.4, 24.3, 24.5_
  - [ ] 4.8 Add edit and delete
    - Objective: Edit opens `ResiboVerify` in edit mode (props only; no change to `ResiboVerify.tsx`) from a new `src/features/history/EditTransaction.tsx` route file and saves with `put` through the same validation. Delete uses an AlertDialog confirmation, added in `HistoryList.tsx`. Success messages appear for both, and the dashboard reacts without reload. If `ResiboVerify.tsx` needs a change, do it in 4.5/4.6 instead; do not edit it here.
    - Stream: B. Depends on: 4.5, 4.6, 4.7, 5.1. Parallel: with 5.2 (different files: 5.2 edits only app glue).
    - Done when: a component test confirms an edited date moves the transaction and a cancelled delete keeps it; a confirmed delete removes it and shows a success message.
    - _Requirements: 9.5, 9.6, 9.7, 9.8, 11.1, 13.2_
  - [ ] 4.9 Build the monthly `Dashboard`
    - Objective: `src/features/dashboard/Dashboard.tsx`: month selector defaulting to the current Manila month; total, count and a clear "Recorded expenses (saved receipts only; not total household spending)" label; `₱0.00`, 0 and an empty state when no data; derived at render time from the context so it updates without reload.
    - Stream: B. Depends on: 3.8, 4.1. Parallel: yes.
    - Done when: a component test with an injected `now` confirms the default month, a month change recalculates, the empty state shows, and saving or deleting in the context updates totals.
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 11.1, 11.6, 13.4_
  - [ ] 4.10 Responsive and accessibility pass
    - Objective: verify and fix all core views at 360, 768 and 1920 px widths (no horizontal scroll, 44 px targets under 768 px, ResiboVerify side by side from 768 px); full keyboard operation of add, review, confirm, search, edit, delete and dashboard; visible focus; text-based state messaging.
    - Stream: B. Depends on: 4.4, 4.6, 4.8, 4.9. Parallel: no (may touch any frontend file).
    - Done when: manual checks at the three widths and a keyboard-only walkthrough are recorded in `docs/manual-test-log.md`. No Playwright is added.
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 13.5_

- [ ] 5. Integration
  - [ ] 5.1 Wire the context to the real repository
    - Objective: replace the in-memory stub in the transactions context with the IndexedDB repository; load on start; re-read on `visibilitychange`; handle `recovery` and `error` states with the recovery message (never overwriting unreadable data without explicit confirmation).
    - Stream: B (integration with Domain). Depends on: 3.19, 4.1. Parallel: yes (edits only the context file under `src/app/`).
    - Done when: a saved transaction survives a page refresh (manual check recorded in `docs/manual-test-log.md`); typecheck and build pass.
    - _Requirements: 8.1, 8.2, 8.6, 11.1_
  - [ ] 5.2 Wire the full core flow against the local mock provider
    - Objective: connect intake → `OcrClient` → `/api/ocr` handler → `ResiboVerify` → confirm → history → dashboard, using the injected or local-flag mock provider. Glue edits are confined to `src/app/` routing/flow state; do not edit feature files owned by other tasks. The mock is for development only and the MOCK banner must show.
    - Stream: Both (joint integration session; one person drives to avoid simultaneous edits). Depends on: 2.3, 2.12, 4.3, 4.4, 4.6, 4.7, 4.9. Parallel: with 4.8, 6.4.
    - Done when: the developers walk the flow once locally and record the result; the MOCK banner is visible; this task does NOT count as a real OCR success.
    - _Requirements: 3.1, 5.1, 7.1, 7.3, 9.1, 10.2, 11.1_
  - [ ] 5.3 Switch to the real Lumen provider and verify the flow
    - Objective: run the same flow with `OCR_PROVIDER` unset or `lumen` and real credentials in `.env.local`. Confirm that the MOCK banner is gone, the response says `provider: 'lumen'`, and failures show the correct panels. Record the real outcome.
    - Status: **BLOCKED** until 2.10 and 2.11 succeed.
    - Stream: Both. Depends on: 2.11, 5.2. Parallel: with 4.10, 6.5.
    - Done when: one real receipt flows to a saved transaction, or the failure is recorded with its cause.
    - _Requirements: 1.1, 1.2, 1.4, 3.1_

- [ ] 6. Testing (mandatory scope only; properties live next to their implementation in groups 2 and 3)
  - [ ] 6.1 Write OCR failure-mode example tests
    - Objective: test the handler with an injected mock provider that throws, hangs (fake timers → `UPSTREAM_TIMEOUT`), returns empty text (`NO_TEXT`) and returns malformed data (`UPSTREAM_UNINTERPRETABLE`); assert the whitelisted codes and the absence of provider text in the body.
    - Stream: A. Depends on: 2.3. Parallel: yes.
    - Done when: `npm run test` passes these tests.
    - _Requirements: 1.3, 3.5, 3.6, 3.7_
  - [ ] 6.2 Write mock-guard example tests
    - Objective: test that `createProvider` refuses the mock when `VERCEL_ENV` is `production` or `preview`, when `LOCAL_MOCK_OCR` is unset, or when `NODE_ENV=production`; that missing Lumen configuration yields `SERVER_MISCONFIGURED` and no extraction.
    - Stream: A. Depends on: 2.2. Parallel: yes.
    - Done when: the tests pass.
    - _Requirements: 1.4, 14.1_
    - Affected by decision: D5.
  - [ ] 6.3 Write upload boundary example tests
    - Objective: type allow-list, size at exactly the maximum and one byte over, empty file, magic-byte mismatch; the user message text from design Section 5.7. Limits are injected, so no Lumen value is needed.
    - Stream: A. Depends on: 2.3. Parallel: yes.
    - Done when: the tests pass.
    - _Requirements: 2.4, 2.5, 2.6, 14.3_
  - [ ] 6.4 Write storage example tests
    - Objective: a repository stub that throws a quota error leaves the draft on screen and never shows success; a repeated confirm saves one record; invalid stored records stay in place until the user explicitly confirms clearing.
    - Stream: Domain. Depends on: 3.19, 4.6. Parallel: with 5.2.
    - Done when: the tests pass.
    - _Requirements: 7.4, 8.5, 8.6_
  - [ ] 6.5 Write the one real Lumen integration test
    - Objective: `tests/integration/lumen.real.test.ts` skips automatically when credentials are absent, and otherwise sends the authorized sample receipt through the real provider and asserts a non-empty text result. Run it manually and record the actual outcome with a date. It must never use the mock provider.
    - Status: **BLOCKED** until 2.10 and 2.11.
    - Stream: A. Depends on: 2.11. Parallel: yes.
    - Done when: the recorded result in `docs/manual-test-log.md` is accurate; a skipped run is reported as skipped, not as passed.
    - _Requirements: 1.1, 1.2, 3.1_
  - [ ] 6.6 Run and record the manual end-to-end test on the deployed URL
    - Objective: follow the design Section 9.3 checklist on a real phone using the deployed app and a real Lumen result: upload, privacy notice, processing, ResiboVerify, validation, confirm, refresh persistence, search, edit, delete, dashboard, and the forced failures (oversize, wrong type, offline, timeout, kill switch). Check that logs hold no receipt data.
    - Stream: Both. Depends on: 5.3, 7.5. Parallel: with 7.4, 8.1.
    - Done when: each step is recorded as pass or fail in `docs/manual-test-log.md`, with failures stated honestly.
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 7.1, 8.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 10.2, 11.1, 12.1, 14.7_

- [ ] 7. Deployment
  - [ ] 7.1 Finalize `vercel.json` and remove the smoke-test health endpoint
    - Objective: SPA rewrite excluding `/api/*`; security headers (CSP `default-src 'self'; img-src 'self' blob: data:`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy` camera for self); `functions` entry for `api/ocr.ts` with the verified `maxDuration` (from 7.3) and optional `memory`. Delete the temporary `api/health.ts` unless the team authorizes a safe retained version (D7); any retained version returns basic service status only and no environment or secret-configuration information.
    - Status: the `maxDuration` value is constrained by 7.3. Leave it out until it is verified. Do not guess it.
    - Stream: A. Depends on: 1.3, 2.3, 7.3. Parallel: with 7.6 (different files).
    - Done when: the file is valid JSON; the build succeeds; headers are visible on the deployed site (checked in 7.5).
    - _Requirements: 14.10, 23.3, 23.4, 3.7_
    - Affected by decision: D7.
  - [ ] 7.2 Add a bundle secrets smoke check (early, mandatory)
    - Objective: a small script `scripts/check-bundle.mjs` that searches `dist/` for credential variable names and any value read from the local environment, and exits non-zero on a match. Add it as an npm script. Do not print values.
    - Stream: A. Depends on: 1.4 (shares `package.json`). Parallel: yes.
    - Done when: the script passes on a clean build; deliberately placing a fake test value in a temporary build makes it fail (temporary file removed after).
    - _Requirements: 14.1, 14.2_
  - [ ] 7.3 Verify real Vercel limits for the team's plan (manual)
    - Objective: check and record in `docs/vercel-verification.md`: function `maxDuration` for the plan, exact request-body limit, memory, whether WAF rate limiting is available on the plan, and (from 2.1 and the smoke test) whether Lumen is reachable from a Vercel function. State each as verified, unknown or unavailable, with source and date. This task does not gate the Lumen adapter (2.10) or the local flow.
    - Status: depends on the team's account and plan; it constrains 7.1, 7.4 and 7.6.
    - Stream: A. Depends on: 1.5. Parallel: yes.
    - Done when: each limit is recorded with its source and date, or marked unknown.
    - _Requirements: 3.7, 14.5, 23.4; Open Items 7, 10, 11_
  - [ ] 7.4 Check the actual Vercel WAF configuration and test the abuse control
    - Objective: inspect the real Vercel project settings (not the plan documentation) and record what exists. If a rate-limiting rule on `POST /api/ocr` is configured, record its values and test that a burst is rejected (HTTP 429). If WAF rate limiting is unavailable, not configured or not tested, record exactly that. Requirement 14.5 may be reported as satisfied ONLY if the rule exists and the test passed; otherwise report it as NOT satisfied, name the residual risk (only the per-instance in-memory limiter, same-origin check, size cap and `OCR_DISABLED` kill switch remain) and ask the team to accept or fix it.
    - Stream: A. Depends on: 7.3, 7.5. Parallel: with 6.6, 8.1.
    - Done when: `docs/vercel-verification.md` states the true WAF status with test evidence or an explicit "not configured / not tested", and the 14.5 verdict (satisfied / not satisfied) is written down.
    - _Requirements: 14.5, 14.6_
    - Affected by decision: D4.
  - [ ] 7.5 Deploy the production build to Vercel and verify the configuration
    - Objective: with real credentials set only in the Vercel dashboard (never in files, never with `VITE_`), deploy the tested build and verify: the app loads over HTTPS, `/api/ocr` rejects GET with 405, headers are present, the placeholder 501 is gone, `/api/health` is removed (or replaced by a team-authorized safe version per D7, with no secret-configuration disclosure), the mock is refused on the production and preview deployments (set `OCR_PROVIDER=mock` temporarily in a preview to confirm refusal, then remove it), and the bundle check (7.2) passes on the deployed build output. This is the final production deployment; it is separate from, and does not replace, the early smoke test (1.5).
    - Stream: A (with B present for the walk-through). Depends on: 1.5, 4.10, 5.3, 7.1, 7.2, 7.6, 8.3. Parallel: no.
    - Done when: results are recorded in `docs/vercel-verification.md`; failures are listed, not hidden.
    - _Requirements: 1.4, 14.1, 14.2, 14.4, 23.4_
    - Affected by decisions: D5, D7.
  - [ ] 7.6 Reconcile configuration with verified Vercel limits
    - Objective: in `shared/config.ts`, replace PROVISIONAL timeout and rate-limit values with ones consistent with the verified `maxDuration` and plan limits from 7.3 (`OCR_TIMEOUT_MS` below `maxDuration`, margin for `OCR_CLIENT_TIMEOUT_MS`); mark each as verified with its source, or keep it PROVISIONAL with a note.
    - Stream: A (shared contract; the other developer reviews). Depends on: 2.9, 7.3. Parallel: with 7.1 (different files).
    - Done when: no value claims to be verified without a source; typecheck passes.
    - _Requirements: 24.1, 24.2, 3.7_
    - Affected by decision: D4.

- [ ] 8. Submission
  - [ ] 8.1 Public repository readiness and secrets audit
    - Objective: confirm `.gitignore` excludes `.env*` (except `.env.example`), search the working tree and git history for credential values, confirm `.env.example` has names only, confirm `.kiro/specs/resibowise-ph/` and docs are present for judging, and that commit history is meaningful. Report findings; do not stage or commit.
    - Stream: Both. Depends on: 7.5. Parallel: with 6.6, 7.4.
    - Done when: the audit result is written in `docs/submission-checklist.md`.
    - _Requirements: 14.2_
  - [ ] 8.2 Update the README with verified results
    - Objective: take the early draft (1.6) and replace each `TODO: verify` with verified facts only: how Lumen is used (from the verified contract), the verified local-dev approach, the deployed URL, the WAF status from 7.4 (stated as is), the oversize photo rejection, and test results from 8.3. Remove statements that could not be verified.
    - Stream: Both (one author). Depends on: 1.6, 2.11, 7.4, 7.5. Parallel: with 8.4.
    - Done when: a teammate follows it from a clean checkout; the steps work or the gaps are noted; no `TODO: verify` remains unless the item is genuinely unverified and listed as a known limitation.
    - _Requirements: 8.7, 10.6, 23.1_
  - [ ] 8.3 Full build, lint and test run (pre-deployment gate)
    - Objective: run `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test` and report actual results. Do not claim unexecuted tests as passed. Re-run after any later code change (including any optional enhancement).
    - Stream: Both. Depends on: 2.8, 3.2, 3.3, 3.5, 3.7, 3.9, 3.10, 3.14, 3.15, 3.16, 3.20, 4.10, 5.3, 6.1, 6.2, 6.3, 6.4. Parallel: with 8.5.
    - Done when: results are recorded in `docs/manual-test-log.md` exactly as produced.
    - _Requirements: 23.1_
  - [ ] 8.4 Verify the public deployment
    - Objective: open the public URL from a device and network that is not logged in to Vercel; confirm the core flow with a real Lumen receipt, and that the URL works for a judge.
    - Stream: Both. Depends on: 6.6, 7.5, 8.3. Parallel: with 8.2.
    - Done when: the date, URL and results are recorded in `docs/submission-checklist.md`.
    - _Requirements: 1.1, 12.1_
  - [ ] 8.5 Prepare the five-slide presentation
    - Objective: five slides: problem and Filipino household budget managers; solution and ResiboVerify; how Lumen OCR is used; architecture and Kiro specs; results, limitations and next steps. Use only verified facts and screenshots.
    - Stream: Both. Depends on: 5.3. Parallel: with 8.3.
    - Done when: the slide file exists and each claim maps to something recorded in the test log.
  - [ ] 8.6 Rehearse the five-minute demo
    - Objective: rehearse on the deployed app with a backup plan (pre-recorded run or screenshots for a Lumen outage), timing it under five minutes.
    - Stream: Both. Depends on: 8.4, 8.5. Parallel: no.
    - Done when: a timed run is recorded and the backup is ready.
  - [ ] 8.7 Final submission checks
    - Objective: confirm the repository is public, the deployed URL works, the specs and README are present, no secrets are exposed, the Requirement 14.5 verdict from 7.4 is stated truthfully, optional features do not break the core flow, and **every team member can explain the code and the architecture**. Check the submission before the 2:00 PM deadline unless the organizers say otherwise.
    - Stream: Both. Depends on: 7.4, 8.1, 8.2, 8.4, 8.6. Parallel: no.
    - Done when: every item in `docs/submission-checklist.md` is marked done or listed as an open issue.
    - _Requirements: 1.1, 14.2, 14.5_

- [ ] 9. Optional enhancements (outside the critical path; start only after the first deployed demo (7.5) works, and never ahead of core work; serialized because they edit shared core files)
  - [ ]* 9.1 Add transaction categories
    - Objective: optional `category` field, default list with custom entry, edit and clear, uncategorized treated as included in totals, category in search.
    - Stream: B. Depends on: 7.5. Parallel: no (edits core forms and lists).
    - Done when: core tests still pass and categories work in the form, history and search.
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  - [ ]* 9.2 Add a monthly budget
    - Objective: `settings` store in a later schema version; validated budget; used, remaining and over-budget indicators with text.
    - Stream: B. Depends on: 9.1 (serialized to avoid shared-file edits). Parallel: no.
    - Done when: validation and live updates work; existing data is not lost on the schema upgrade.
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_
  - [ ]* 9.3 Add the category spending chart
    - Objective: grouped totals with a text or table equivalent; group totals sum to the month total; no chart library unless the team approves it.
    - Stream: B. Depends on: 9.1, 9.2. Parallel: no.
    - Done when: the sum invariant holds in a test.
    - _Requirements: 18.1, 18.2, 18.3, 18.4_
  - [ ]* 9.4 Add the duplicate warning
    - Objective: pure comparison (case and whitespace-insensitive merchant, same date and amount) and a warning in ResiboVerify that can be acknowledged.
    - Stream: B. Depends on: 9.3 (serialized). Parallel: no.
    - Done when: a test confirms matching and re-evaluation on edit.
    - _Requirements: 17.1, 17.2, 17.3, 17.4_
    - Affected by Open Item 14 (matching rules).
  - [ ]* 9.5 Add optional receipt image retention
    - Objective: separate `receiptImages` store, downscale before storing if the team agrees, fall back to saving without the image with a message, and delete the image with the transaction.
    - Stream: B. Depends on: 9.4 (serialized). Parallel: no.
    - Done when: delete removes the image; quota failure saves without it and tells the user.
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
    - Affected by Open Item 12.
  - [ ]* 9.6 Add client-side image compression (Proposed Change PC-1)
    - Objective: downscale or re-encode oversized photos before upload so the derivative is sent and the preview shows what was sent.
    - Status: needs team decision D2 and a clarification of Requirement 2.6 first. Do not build before approval.
    - Stream: B. Depends on: 9.5 (serialized). Parallel: no.
    - Done when: an oversize photo is accepted as a derivative within the limit, and the size check applies to the derivative.
    - _Requirements: 2.6, 24.2_
  - [ ]* 9.7 Add receipt image zoom
    - Objective: zoom controls usable by touch and keyboard in ResiboVerify.
    - Stream: B. Depends on: 9.6 (serialized). Parallel: no.
    - Done when: zoom works by touch and keyboard.
    - _Requirements: 20.1, 20.2_
  - [ ]* 9.8 Add parser-based ambiguity warnings
    - Objective: warnings next to the total beyond the existing parser notes, based only on detectable parser conditions, never on confidence scores unless the verified contract provides them.
    - Stream: B. Depends on: 9.7 (serialized). Parallel: no.
    - Done when: warnings re-evaluate on edit and do not block saving.
    - _Requirements: 21.1, 21.2, 21.3, 21.4_
  - [ ]* 9.9 Add an offline notice
    - Objective: tell the user when offline that receipt processing needs a connection, while viewing, searching, editing and deleting continue to work.
    - Stream: B. Depends on: 9.8 (serialized). Parallel: no.
    - Done when: the notice shows when the browser reports offline, and local features still work.
    - _Requirements: 22.1, 22.2_

- [ ] 10. Checkpoint - Shared contracts frozen
  - After 1.2 and 1.4: both developers have reviewed `shared/types.ts`, `shared/config.ts`, the repository and provider interfaces. Ensure typecheck and tests pass, ask the user if questions arise.

- [ ] 11. Checkpoint - Core flow works locally
  - After 5.2: the flow works end to end with the mock (clearly labeled) and the mandatory tests written so far pass. Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Checkpoint - Real integration and deployment
  - After 5.3 and 7.5: real Lumen result recorded, deployment verified, WAF status stated truthfully (7.4). Ensure all tests pass, ask the user if questions arise.

## Notes

- **Critical path.** 2.1 (human, now) → 2.10 → 2.11 → 5.3 → 8.3 → 7.5 → 6.6 → 8.4 → 8.6 → 8.7, with the product spine feeding 5.3: 1.2 → 4.1 → 4.3 / 4.5 → 4.6 (needs 5.1 ← 3.19) → 5.2 ← 2.3 ← 3.13 (parser) and 4.7 / 4.9. This covers Real Lumen OCR → ResiboVerify → Confirm and save → IndexedDB → History → Dashboard → Deployment. Optional property tests and all Group C enhancements are placed after 8.7 so they cannot delay the first complete working demo.
- **Early deployment checkpoint.** Task 1.5 deploys the scaffold with the placeholder `/api/ocr` (HTTP 501, not Lumen) as soon as the scaffold, routing, placeholder API and bundle check exist. It de-risks Vercel hosting, routing and environment configuration early. It never counts as Lumen integration. The final production deployment (7.5) and real end-to-end test (6.6) are separate and still required.
- **CONFLICT C1 (RESOLVED November 13, 2026: the team accepted the prioritized testing plan below and its schedule risk; the mandatory real Lumen integration test 6.5 and deployed end-to-end test 6.6 are preserved).** The design's mandatory scope is 11 property tests (Properties 1, 2, 3, 4, 5, 6, 9, 12, 13, 14, 18), example tests 6.1–6.4, one real Lumen test (6.5) and one manual deployed end-to-end run (6.6), on top of the build, an unresolved Lumen contract and the 2:00 PM deadline for two developers. It may not fit. This plan keeps the full mandatory scope and writes each test immediately after its implementation (in the same or next wave) to avoid a test pile-up at the end. Decision D1 adopted the reduced mandatory testing plan. Priority if time runs short (accepted by the team): tests protecting money and dates and the OCR error surface first (Properties 1–6, 18, 12–14), then storage (9, 6.4), then 6.1–6.3; 6.5 and 6.6 are never dropped because they back the real-Lumen claim. No mandatory test is dropped without written team approval.
- Tasks marked with `*` are optional. Mandatory property tests are deliberately unmarked because the design's mandatory scope requires them. Optional-tier properties are 7, 8, 10, 11, 15, 16, 17, 19; their behaviors are still covered by the mandatory example tests where noted.
- Several tasks are not code-only (1.5, 2.1, 7.3, 7.4, 7.5, 8.x, 6.5, 6.6). They are included at the team's request and are done manually by the developers. A coding agent must not claim them complete without recorded evidence.
- **Ownership and shared files.** Ownership follows the Ownership section at the top (Stream A = CLAVITE, Stream B = BELLEN, Domain split as stated, Shared = both). `shared/types.ts` is edited only in 1.2. `shared/config.ts` is edited only by 1.2, 2.12, 2.9, 7.6 in separate waves. `server/ocr/handler.ts` is edited only by 2.3 then 2.4. `ResiboVerify.tsx` is edited only by 4.5 then 4.6. `package.json` is edited by 1.1, 1.4 and 7.2 in separate waves. `src/app/` is edited by 4.1, 5.1, 5.2 (and 4.10) in separate waves.
- **Lumen config honesty.** Verified vs. provisional vs. UNSET is tracked inside `shared/config.ts` comments (see Overview). Missing Lumen configuration yields `SERVER_MISCONFIGURED`, never a fake success.
- Resolved decisions (November 13, 2026, confirmed by BELLEN on behalf of BELLEN and CLAVITE) and tasks they affect: D1 adopt the reduced mandatory testing plan (1.4, 2.9, all test tasks); D2 no automatic image compression in the initial MVP, PC-1 stays optional (4.3, 9.6); D3 `vercel dev` is the initial local backend approach, subject to verification (1.3); D4 implement the documented abuse-protection approach, while actual rate-limit values and the Vercel WAF configuration still require verification and Requirement 14.5 is not claimed satisfied until tested (2.4, 2.12, 7.4, 7.6); D5 approve local/test-only mock OCR safeguards (2.2, 6.2, 7.5); D6 requirements, design and tasks approved by the team (all implementation); D7 approve a minimal temporary health endpoint for deployment smoke testing that returns basic service status only and MUST NOT disclose whether individual secret environment variables are configured; it is removed before final deployment unless the team authorizes a safe retained version (1.3, 1.5, 7.1, 7.5); D8 approve clearly labeled PROVISIONAL image format/size settings for local development and mock testing only, replaced by verified constraints before real Lumen integration (2.9, 2.12).
- Blocked chain: 2.1 → 2.10 → 2.11 → 5.3 → 6.5 → 7.5. If the Lumen contract never arrives, the team must report that Requirement 1.1 cannot be met. A mock result is never a substitute.
- If any optional task is built, re-run 8.3 and 8.4 afterwards.
- Deadline: the safe deadline is 2:00 PM unless the organizers confirm otherwise (Open Item 15).
- Wave placement of optional tests (wave 14) is conservative so they never delay the demo; a developer with spare capacity may run them earlier since they have no dependents.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["1.6", "2.2", "2.12", "3.1", "3.4", "3.17", "3.19", "4.1", "7.2"] },
    { "id": 3, "tasks": ["1.5", "2.9", "2.10", "3.2", "3.3", "3.5", "3.6", "3.8", "3.13", "3.20", "4.2", "4.3", "5.1", "6.2"] },
    { "id": 4, "tasks": ["2.3", "3.7", "3.9", "3.10", "3.14", "3.15", "3.16", "4.4", "4.5", "4.7", "4.9", "7.3"] },
    { "id": 5, "tasks": ["2.4", "2.8", "4.6", "6.1", "6.3", "7.1", "7.6"] },
    { "id": 6, "tasks": ["2.11", "4.8", "5.2", "6.4"] },
    { "id": 7, "tasks": ["4.10", "5.3", "6.5"] },
    { "id": 8, "tasks": ["8.3", "8.5"] },
    { "id": 9, "tasks": ["7.5"] },
    { "id": 10, "tasks": ["6.6", "7.4", "8.1"] },
    { "id": 11, "tasks": ["8.2", "8.4"] },
    { "id": 12, "tasks": ["8.6"] },
    { "id": 13, "tasks": ["8.7"] },
    { "id": 14, "tasks": ["2.5", "2.6", "2.7", "3.11", "3.12", "3.18", "3.21", "3.22"] },
    { "id": 15, "tasks": ["9.1"] },
    { "id": 16, "tasks": ["9.2"] },
    { "id": 17, "tasks": ["9.3"] },
    { "id": 18, "tasks": ["9.4"] },
    { "id": 19, "tasks": ["9.5"] },
    { "id": 20, "tasks": ["9.6"] },
    { "id": 21, "tasks": ["9.7"] },
    { "id": 22, "tasks": ["9.8"] },
    { "id": 23, "tasks": ["9.9"] }
  ]
}
```
