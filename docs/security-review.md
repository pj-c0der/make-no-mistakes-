# Task 1.4 — Security remediation review

Review date: 2026-11-13. No dependency upgrades, audit fixes, overrides, or warning
suppression were applied during this task.

## Evidence and limits

The developer's successful installation reported **15 vulnerable packages: 8
moderate, 5 high, and 2 critical**. A fresh audit from this agent failed because
the npm audit endpoint was unreachable in the execution environment. These
aggregate counts are therefore reported, not independently reproduced.

The installed manifest, lockfile, and package metadata were checked. Cached npm
advisories identified investigation targets; the official sources below verify
the principal critical/high findings and patch candidates. Cached findings may
be stale, and parent packages can inherit severity from one vulnerable child.
Do not equate package counts with the number of distinct advisories or treat
this report as a complete fresh audit.

## Findings and proposed changes

| Installed dependency | Scope | Finding and proposed remediation |
| --- | --- | --- |
| `tinypool@1.1.1`, via `vitest@3.2.7` | Development/test workers and CI | Critical prototype-pollution-to-code-execution gadgets. The two advisories require a preceding prototype pollution condition. Patches are 2.1.1 and 2.1.2 respectively, so **2.1.2 is required for both**. See [worker options advisory](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) and [run options advisory](https://github.com/advisories/GHSA-85c8-ppgw-ccpr). |
| `vitest@3.2.7` | Development tooling | Its declared `tinypool` range is `^1.1.1`; forcing 2.1.2 crosses that range. Review a separately approved migration to **Vitest 4.1.12** instead. Its [published package metadata](https://registry.npmjs.org/vitest/4.1.12) has no tinypool dependency, supports Vite 6, and accepts Node 24. This is a major upgrade requiring migration checks, not an automatic fix. Also review the [mock redirect](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) and [manual mock injection](https://github.com/advisories/GHSA-qxg6-89mg-rqv8) findings. |
| `vite@6.0.1` | Development server/build tooling | High Windows launch-editor issue; [official advisory](https://github.com/advisories/GHSA-587h-7wmj-h5pm) fixes the 6.x line at 6.4.4. Review **6.4.6**, a published same-major candidate. Its [metadata](https://registry.npmjs.org/vite/6.4.6) uses esbuild `^0.25.0`, outside the installed 0.24.2 [esbuild advisory range](https://github.com/advisories/GHSA-67mh-4wv8-2f99). Re-audit all Vite findings after resolution. |
| `postcss@8.4.49` | Development CSS/build tooling | High source-map traversal and subsequent incomplete fixes. Review pinned **8.5.23** for direct and compatible transitive instances. See the [high advisory](https://github.com/advisories/GHSA-r28c-9q8g-f849), [follow-up fix](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), and [published metadata](https://registry.npmjs.org/postcss/8.5.23). |
| `braces@3.0.3`, through CSS/glob tooling | Development tooling | High uncontrolled recursion/stack exhaustion. The [official advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists **no patched version**. Review parent dependency replacements/updates or a documented applicability decision; do not invent a safe braces version. |
| `react-router-dom@6.28.0`, `react-router@6.28.0`, `@remix-run/router@1.21.0` | Production dependencies | High open-redirect XSS in the router dependency, [fixed at router 1.23.2](https://github.com/advisories/GHSA-2w69-qvjg-hvjx). Coordinate with BELLEN on **react-router-dom 6.30.4**, whose [metadata](https://registry.npmjs.org/react-router-dom/6.30.4) pins react-router 6.30.4 and router 1.23.3. This addresses that high finding; it is not a claim that every current router advisory is resolved. |

The current application is a client-side SPA. SSR-specific router paths may be
inapplicable, while redirects still require review of attacker-controlled input.
Review newer router [backslash redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6)
and [SSR deserialization](https://github.com/advisories/GHSA-337j-9hxr-rhxg)
advisories before claiming the 6.x candidate clears the entire audit. Cached
moderate findings also involve lint/glob/selector tooling; use a fresh audit to
identify each installed instance and its supported remediation.

Development-only dependencies are not automatically shipped in the browser
bundle, but worker execution and build tooling can compromise a developer or CI
process. Production router dependencies are separately present. The affected
dependency classifications therefore include **both development and production**;
actual exploitability depends on the vulnerable path's prerequisites.

## Required follow-up, separately authorized

1. From a network-enabled local terminal, run `npm audit --json` and
   `npm audit --omit=dev --json`; retain the reports locally for review without
   environment files. Use `npm explain tinypool`, `npm explain braces`, and
   `npm explain @remix-run/router` to map parent paths. Compare the fresh reports
   with the installed lockfile rather than relying on this cached snapshot.
2. CLAVITE and BELLEN approve a dependency remediation task. Review same-major
   Vite 6.4.6, PostCSS 8.5.23, and frontend router 6.30.4 first. Resolve every
   duplicate affected lockfile instance; do not hand-edit the lockfile.
3. Review Vitest 4.1.12 as an explicit major migration. Adapt the programmatic
   runner/configuration to its documented API and verify jsdom/Node support.
   Do not force tinypool 2.x underneath Vitest 3 without an independently reviewed
   compatibility justification. The existing setup remains vulnerable until
   that dependency path is removed or safely patched.
4. Resolve the no-patch braces finding through parent updates or replacement,
   and review all remaining audit entries. Keep untrusted code/content out of
   development tooling and do not expose development servers publicly while
   remediation is pending; these precautions do not close the findings.
5. Re-run the complete tests, typecheck, lint, production build, and both audit
   commands. Smoke-test frontend routing after any router update. Review
   lockfile changes and document any accepted applicability exception.

**Release blockers:** unresolved critical and high findings require explicit
team security review and remediation or a documented, evidence-based exception
before release. This task does not approve such an exception. No major upgrade
or remediation outside Task 1.4 has been performed.
