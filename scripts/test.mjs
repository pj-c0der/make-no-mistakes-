import { startVitest } from 'vitest/node';
import config from '../vitest.config.mjs';

// Load config directly and disable .env loading; no credential files are needed.
const vitest = await startVitest('test', [], { run: true, config: false }, {
  ...config,
  configFile: false,
  envFile: false,
});
await vitest.close();
