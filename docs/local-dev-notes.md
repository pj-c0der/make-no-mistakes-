# Task 1.3: backend local development

The frontend foundation is Task 1.1. CLAVITE owns this API scaffold. Task 1.1
verification was confirmed by CLAVITE in the implementation conversation on
13 November 2026. The OCR endpoint is a placeholder, not a Lumen integration.

## Start the approved workflow (D3)

Use an already installed Vercel CLI from the repository root:

```powershell
vercel dev --local --listen 3000
```

Current Vercel documentation supports `--local` without account login or project
linking. An existing linked project can use `vercel dev --listen 3000`. Do not run
the bare `vercel` deployment command. Review project-linking or environment-download
prompts before proceeding; do not overwrite existing environment files.

Use `http://localhost:3000` for both the SPA and `/api/*`. The existing Vite command
uses port 5173 internally. Plain `npm run dev` starts only the frontend and does not
provide these API functions. Keep the current hash-router URLs, including `/#/`.

No Vercel CLI package was added. If `vercel` is not installed, arrange CLI setup
separately. The proxy alternative documented below is not installed automatically.

## Environment files

Keep the existing local `.env` unchanged. `.env.example` lists approved server-side
names with empty values; the scaffold does not need credentials or read environment
variables. Vite/Vercel development commands may load local environment files during
normal execution. Do not print their contents or prefix secrets with `VITE_`.
Verify environment loading later without echoing values. Do not download or replace
local environment configuration as part of this task.

```powershell
git check-ignore .env .env.local
git ls-files -- .env .env.local
```

The first command should list ignored filenames. The second should have no output.
These commands inspect Git metadata, not credential contents.

## Check the local responses

After a developer starts `vercel dev`, run in another terminal:

```powershell
curl.exe -i -X POST http://localhost:3000/api/ocr
curl.exe -i http://localhost:3000/api/ocr
curl.exe -i http://localhost:3000/api/health
curl.exe -i http://localhost:3000/
curl.exe -i http://localhost:3000/history
curl.exe -i http://localhost:3000/api/missing
```

- OCR returns HTTP 501 and `{"ok":false,"error":{"code":"NOT_IMPLEMENTED"}}`
  for every method, without processing an upload or calling Lumen.
- Health returns HTTP 200 and only `{"status":"ok"}`. It checks no dependencies
  or configuration. Per D7, remove it in Task 7.1 before production unless the team
  explicitly approves a safe retained endpoint.
- `/` and direct frontend paths should serve the SPA. Current client navigation
  uses hash routes; a server rewrite does not change the frontend router.
- `/api/missing` must remain an API 404, rather than return the SPA HTML. Static
  assets should retain their correct content types.

## Offline checks

With the foundation dependencies already installed:

```powershell
npm.cmd run lint
node node_modules/typescript/bin/tsc --noEmit
node node_modules/typescript/bin/tsc --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext --lib ES2022,DOM --skipLibCheck api/ocr.ts api/health.ts
node --test tests/api-scaffold.test.mjs
```

The direct tests use Node 24's native TypeScript support and start no server. They
check the placeholder responses, absence of upstream fetches, empty example
values, and the SPA fallback's API-path exclusion pattern. They do not read the
local `.env`. Pattern tests do not prove actual Vercel routing. There is no npm
test script yet; runner configuration belongs to Task 1.4.

The standard frontend build command is `npm.cmd run build`; Vite normally loads
local `.env` files. The following PowerShell check uses the unchanged Vite settings
with Vite 6's `envFile: false` option, so credential files stay unopened. Setting
`__dirname` supplies the existing configuration's directory when Node imports it
directly; `configFile: false` avoids reloading it through the configuration bundler.

```powershell
@'
globalThis.__dirname = process.cwd();
const { default: config } = await import('./vite.config.ts');
const { build } = await import('vite');
await build({ ...config, configFile: false, envFile: false });
'@ | node --input-type=module
```

Do not use newer Vite documentation's `envDir: false` option with installed Vite 6:
its `envDir` setting expects a directory string. No frontend configuration was
modified for these checks.

Verification on 13 November 2026:

- Direct scaffold tests, frontend TypeScript, explicit API TypeScript and lint:
  passed.
- Production build through the Vite API above: passed (38 modules transformed).
- The npm build script was attempted with an isolated-env temporary configuration;
  its TypeScript step passed, but Vite's configuration bundler failed with sandbox
  access denied while resolving the configuration. The temporary file was removed.
- Git metadata confirms `.env` and `.env.local` are ignored and untracked. No local
  credential file was opened. The example contains only approved empty variables.

## Troubleshooting and verification status

- PowerShell may block `npm.ps1`; use `npm.cmd` without changing execution policy.
- A frontend HTML response from `/api/ocr` indicates the wrong server or routing
  configuration. Use the Vercel origin, not Vite alone.
- If ports 3000 or 5173 are occupied, stop your own conflicting process or choose
  another Vercel listen port. Do not change frontend-owned files without BELLEN.
- The Vite proxy plus a local Node runner is the approved fallback if the primary
  workflow cannot be used. It requires coordination for Vite changes and any runner
  dependency; no fallback runner or proxy was implemented in Task 1.3.
- `vercel dev`, live SPA/API routing, and deployed behavior are **not verified** in
  this environment: the CLI is absent and the task plan requires developers to
  start dev servers manually. Run the local checks above before claiming them.
- No real Lumen request or deployment is part of this scaffold. Real integration
  and the replacement of HTTP 501 belong to later approved tasks.

References (checked 13 November 2026):

- [Vercel Node.js Web handlers](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel local development](https://vercel.com/docs/cli/dev)
- [Vercel rewrite configuration](https://vercel.com/docs/project-configuration/vercel-json#rewrites)
- [Vite environment loading](https://vite.dev/config/shared-options.html#envdir)
