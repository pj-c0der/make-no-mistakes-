# Task 1.4 — Testing foundation

## Commands

Use a Node version supported by jsdom 31: `^22.22.2 || ^24.15.0 || >=26`.
Verification here used Node 24.22.0. On PowerShell, use `npm.cmd` if execution
policy prevents running `npm.ps1`.

```sh
npm run test
npm run typecheck
npm run lint
npm run build
```

The installed testing dependencies are pinned in `package.json` and
`package-lock.json`: Vitest 3.2.7, fast-check 4.10.2, React Testing Library
16.3.3, DOM Testing Library 10.4.2, user-event 14.6.10, fake-indexeddb 6.2.8,
and jsdom 31.0.0. Their installed versions match both files.

## Configuration

`vitest.config.mjs` uses jsdom, the React plugin, frontend/shared import aliases,
explicit Vitest imports, and one worker. It discovers TypeScript tests under
`src`, `shared`, `server`, `api`, and `tests`.

`scripts/test.mjs` starts Vitest in single-run mode through its
[documented programmatic API](https://v3.vitest.dev/advanced/api/). It imports
the testing configuration directly and passes Vite's `envFile: false` inline
option. Test execution does not need local environment files or OCR credentials.
The test script also runs the existing Node tests for the API scaffold and
shared configuration; those tests remain unchanged.

`tests/setup.ts` installs fake IndexedDB, cleans up React renders after each
test, and sets fast-check's global iteration count. Import `numRuns` (50) or
`indexedDbNumRuns` (25) from `tests/helpers/property.ts`. IndexedDB property
tests should explicitly pass `{ numRuns: indexedDbNumRuns }` to `fc.assert`.
The shared constants provide one place to request a longer deliberate run.

The foundation smoke tests exercise Vitest, fast-check, a test-only React
component with user-event, and an isolated IndexedDB round trip. They do not
implement application features or make network requests.

`tsconfig.test.json` adds test and API/server type checking to the existing
application/shared TypeScript check. Application build and development scripts
are preserved.

## Verification on 2026-11-13

- `npm.cmd run test`: passed; 4 Vitest tests and 12 existing Node tests
  (4 scaffold and 8 shared configuration regressions).
- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed with zero warnings.
- `npm.cmd run build -- --config scripts/build-verification.config.mjs`:
  TypeScript passed; Vite configuration bundling failed because esbuild could
  not read a parent directory in this sandbox. The temporary configuration
  redirected environment loading to an absent test directory and was removed.
- An equivalent production build using the existing `vite.config.ts` through
  Vite's API passed (38 modules), with `configFile: false` and `envFile: false`.
  The normal CLI build still needs verification in the local terminal.
- Graphify refresh could not run because the `graphify` command is unavailable
  in this environment; no graph-based conclusions were used.

The environment-file-free API verification command used here was:

```powershell
@'
globalThis.__dirname = process.cwd();
const { default: config } = await import('./vite.config.ts');
const { build } = await import('vite');
await build({ ...config, configFile: false, envFile: false });
'@ | node --input-type=module
```

The temporary `__dirname` supplies the existing configuration's CommonJS-style
path reference when importing it directly. It does not change application code.

Security findings and required release review are tracked separately in
[security-review.md](./security-review.md). Passing tests do not resolve those
findings.
