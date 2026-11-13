/** Shared default for property tests; edit here for an explicitly longer run. */
export const numRuns = 50;
/** IndexedDB properties use the approved lower iteration budget. */
export const indexedDbNumRuns = Math.min(numRuns, 25);
