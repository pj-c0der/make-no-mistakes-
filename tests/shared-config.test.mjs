import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { CONFIG, VERIFIED_LIMITS, effectiveMaxBytes } from '../shared/config.ts';

const originalAppCap = CONFIG.MAX_IMAGE_BYTES;
const originalExternalCaps = { ...VERIFIED_LIMITS };

afterEach(() => {
  CONFIG.MAX_IMAGE_BYTES = originalAppCap;
  delete VERIFIED_LIMITS.lumenMaxBytes;
  delete VERIFIED_LIMITS.platformMaxBodyBytes;
  Object.assign(VERIFIED_LIMITS, originalExternalCaps);
});

for (const [name, lumenMaxBytes, platformMaxBodyBytes] of [
  ['without external caps', undefined, undefined],
  ['with a Lumen cap', 2048, undefined],
  ['with a platform cap', undefined, 1024],
  ['with both external caps', 2048, 1024],
]) {
  test(`UNSET application cap fails closed ${name}`, () => {
    CONFIG.MAX_IMAGE_BYTES = 0;
    Object.assign(VERIFIED_LIMITS, { lumenMaxBytes, platformMaxBodyBytes });

    assert.equal(effectiveMaxBytes(), 0);
  });
}

for (const [name, appCap, lumenMaxBytes, platformMaxBodyBytes, expected] of [
  ['application cap alone', 4096, undefined, undefined, 4096],
  ['stricter application cap', 512, 2048, 1024, 512],
  ['stricter Lumen cap', 4096, 512, 1024, 512],
  ['stricter platform cap', 4096, 2048, 512, 512],
]) {
  test(`configured limits respect the ${name}`, () => {
    CONFIG.MAX_IMAGE_BYTES = appCap;
    Object.assign(VERIFIED_LIMITS, { lumenMaxBytes, platformMaxBodyBytes });

    assert.equal(effectiveMaxBytes(), expected);
  });
}
