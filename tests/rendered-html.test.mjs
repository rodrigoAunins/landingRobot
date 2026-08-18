import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Robot LED Eventos", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /<title>Robot LED Eventos \| Animación para fiestas<\/title>/i);
  assert.match(html, /Número 1 en fiestas/);
  assert.match(html, /Un personaje para/);
  assert.match(html, /Consultá tu/);
  assert.match(html, /Capital y área metropolitana/);
  assert.match(html, /Pocos cupos|Elegí una fecha/);
  assert.match(html, /Quiero contratar sus servicios/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps editable commercial data centralized", async () => {
  const [page, content, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /characters\.map/);
  assert.match(page, /testimonials\.map/);
  assert.match(content, /export type Character/);
  assert.match(content, /whatsappMessage: "¡Quiero contratar sus servicios!"/);
  assert.match(content, /isPlaceholder: true/);
  assert.match(content, /export const quoteMonths/);
  assert.match(content, /tucuman: 180000, santiago: 190000/);
  assert.match(content, /2026-08-30/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
