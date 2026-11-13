import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { afterEach } from 'vitest';
import { numRuns } from './helpers/property';

fc.configureGlobal({ numRuns });
afterEach(cleanup);
