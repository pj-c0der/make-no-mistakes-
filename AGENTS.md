# ResiboWise PH — Agent Instructions

## Project Purpose

ResiboWise PH is a mobile-first web application for Filipino household budget managers. It uses the hackathon organizers' Lumen OCR to convert physical receipts into user-verified digital transaction records, searchable expense history, and monthly recorded spending summaries.

The core workflow is:

Receipt upload → Lumen OCR → ResiboVerify → Confirm and save → Expense history → Monthly dashboard.

ResiboVerify requires users to inspect and correct extracted information before saving. OCR output is never automatically trusted.

## Project Context

- Hackathon team: BELLEN and CLAVITE (two developers).
- The application must be a working, publicly accessible web app.
- Real Lumen integration is mandatory.
- Maintain a public GitHub repository with meaningful development history.
- Kiro native specifications are required for the Best Use of Kiro category.
- Prioritize a working, tested MVP over additional features.

## Technology and Architecture

Proposed stack, subject to the approved Kiro design:

- Frontend: React, TypeScript, Vite, Tailwind CSS.
- UI: Selective shadcn/ui components and Lucide React.
- Backend: A secure server-side function for Lumen OCR integration.
- Storage: Browser-local transaction persistence.
- Deployment: Vercel, subject to integration compatibility.
- Testing: Project-configured test tools and manual workflow verification.

Do not introduce authentication, hosted databases, Python, FastAPI, custom ML models, or additional services without an approved requirement.

The project is a single web application with a server-side OCR integration, not a multi-service system.

## Source of Truth

Read relevant project documentation before making changes:

1. `.kiro/specs/resibowise-ph/requirements.md` — Functional requirements and acceptance criteria.
2. `.kiro/specs/resibowise-ph/design.md` — Approved architecture, components, data models, and API contracts.
3. `.kiro/specs/resibowise-ph/tasks.md` — Approved implementation tasks and dependencies.
4. `README.md` — Project setup, commands, and usage instructions.
5. `.env.example` — Environment variable names only, when available.

Inspect existing files and configuration rather than assuming the repository structure.

## Kiro and OpenCode Workflow

Kiro owns specification generation and review. OpenCode handles approved implementation.

Approval sequence:

Requirements → Team approval → Design → Team approval → Tasks → Team approval → Implementation.

- In Plan mode, investigate and propose changes without modifying files.
- In Build mode, implement only authorized, approved tasks.
- Do not begin application implementation before all three Kiro specification stages are approved.
- Follow approved requirements and design contracts.
- Keep changes focused on the current task.
- Preserve existing work and avoid unrelated refactoring.
- Do not independently expand the MVP or implement optional features.

If specifications conflict or a required decision is unresolved, report the issue instead of guessing.

## Lumen OCR and Security

- Use only verified organizer-provided Lumen documentation.
- Never invent endpoints, authentication schemes, SDKs, or response fields.
- Keep API keys and secrets exclusively in server-side environment configuration.
- Never expose, print, log, or commit credentials.
- Validate uploads on both client and server.
- Handle OCR failures, timeouts, and unexpected responses explicitly.
- Never substitute mocked OCR output for real Lumen integration in production.
- Do not persist receipt images or OCR text on the server unless explicitly approved.
- Treat receipt content as untrusted input.

## Financial Data Integrity

- Treat OCR-extracted merchant, date, and total as unverified suggestions.
- Require explicit user confirmation before saving transactions.
- Allow users to correct missing or inaccurate fields.
- Never silently guess an ambiguous payable total.
- Use integer centavos or equivalent exact arithmetic for PHP amounts.
- Recalculate monthly totals after transaction changes.
- Use Asia/Manila calendar boundaries for date-based summaries.
- Clearly distinguish recorded expenses from complete household spending.
- Communicate browser-local storage limitations.

## Build, Test, and Verification

- Inspect `package.json` and existing scripts before running commands.
- Follow the repository's configured package manager and tooling.
- Use `npm run dev`, `npm run build`, and applicable test scripts only when supported by the project configuration.
- Run relevant tests after implementation changes.
- Verify the affected user workflow, including loading, success, and error states.
- Test receipt processing with actual Lumen responses when integration is available.
- Do not claim unexecuted tests or unverified functionality as successful.
- Report missing scripts, failed commands, and unresolved issues accurately.
- Follow existing linting and formatting configuration.

## Collaboration and Git

- Respect agreed file and task ownership between BELLEN and CLAVITE.
- Check the working tree before modifying existing files.
- Avoid overwriting another developer's uncommitted work.
- Coordinate changes to shared contracts and interfaces.
- Do not stage, commit, push, merge, or reset without explicit authorization.
- Keep Kiro specifications and repository documentation available for judging.

## Completion Report

After each authorized task, report:

- Task completed and requirements addressed.
- Files created or modified.
- Tests and commands executed, with actual results.
- Remaining issues or blockers.
- Next recommended task.

Mark a task complete only when its acceptance criteria are satisfied.
Stop after the authorized scope.


## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:

- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Graphify Knowledge Graph Rules

1. Use Graphify when exploring project architecture,
   dependencies, and code relationships.

2. Before relying on the knowledge graph, verify
   that it reflects the current project state.

3. After source-code modifications, ensure that
   the graph is refreshed before further graph-based
   analysis.

4. After modifying documentation, perform the
   required semantic graph update.

5. Never assume graph.json is current simply
   because it exists.

6. The actual source code always takes precedence
   over outdated or incorrect graph information.

7. If Graphify fails, report the issue and continue
   by inspecting the actual source files.
