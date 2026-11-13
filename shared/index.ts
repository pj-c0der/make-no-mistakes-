/**
 * ResiboWise PH — shared contracts barrel.
 *
 * Single public entry point for both the browser client (src/) and the
 * Vercel function (api/ + server/). Import from `@shared/*` or this barrel.
 *
 * Contract freeze status: NOT frozen until both BELLEN (frontend) and
 * CLAVITE (backend) have reviewed. Changes require both developers'
 * agreement (AGENTS.md shared-contract rules).
 */

export * from './types';
export * from './config';
export * from './money';
export * from './dates';
export * from './validation';
export * from './receiptParser';
export * from './selectors';
export * from './draft';