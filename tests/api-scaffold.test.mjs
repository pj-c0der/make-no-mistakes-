import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { URL } from "node:url";

import health from "../api/health.ts";
import ocr from "../api/ocr.ts";

test("OCR placeholder rejects every HTTP method without an upstream call", async (t) => {
  const upstream = t.mock.method(globalThis, "fetch", () => {
    throw new Error("The scaffold must not make upstream requests");
  });

  for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]) {
    const response = ocr.fetch(new globalThis.Request("http://localhost/api/ocr", { method }));

    assert.equal(response.status, 501);
    assert.match(response.headers.get("content-type"), /^application\/json\b/);
    assert.deepEqual(await response.json(), {
      ok: false,
      error: { code: "NOT_IMPLEMENTED" },
    });
  }

  assert.equal(upstream.mock.callCount(), 0);
});

test("health returns only basic status", async () => {
  const response = health.fetch();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^application\/json\b/);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("environment example contains only the approved empty server variables", async () => {
  const example = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  const entries = example.split(/\r?\n/).filter((line) => line && !line.startsWith("#"));

  assert.deepEqual(entries, [
    "LUMEN_API_KEY=",
    "LUMEN_API_SECRET=",
    "LUMEN_BASE_URL=",
    "OCR_PROVIDER=",
    "LOCAL_MOCK_OCR=",
    "OCR_DISABLED=",
  ]);
});

test("SPA fallback policy excludes API paths and accepts frontend paths", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const [rewrite] = config.rewrites;
  const pattern = rewrite.source.match(/^\/:path\((.*)\)$/);

  assert.equal(config.rewrites.length, 1);
  assert.equal(rewrite.destination, "/index.html");
  assert.ok(pattern);

  // Checks the configured pattern; actual Vercel routing still needs a smoke test.
  const fallback = new RegExp(`^/(?:${pattern[1]})$`);
  for (const path of ["/", "/history", "/dashboard", "/apiary"]) {
    assert.equal(fallback.test(path), true, path);
  }
  for (const path of ["/api", "/api/", "/api/ocr", "/api/health", "/api/missing"]) {
    assert.equal(fallback.test(path), false, path);
  }
});
