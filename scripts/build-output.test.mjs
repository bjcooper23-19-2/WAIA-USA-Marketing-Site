import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const htmlFiles = async (directory) => {
  const found = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith(".html")) found.push(file);
    }
  }
  await walk(directory);
  return found.sort();
};
const build = (env = {}) =>
  execFileSync(process.execPath, ["scripts/build-site.mjs"], {
    cwd: root,
    env: { ...process.env, CF_PAGES_BRANCH: "main", WAIA_US_WEB_ANALYTICS_TOKEN: "", ...env },
    encoding: "utf8",
  });

test("Insights regeneration is byte-for-byte repeatable and retains metadata", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "waia-insights-"));
  try {
    await mkdir(path.join(temporary, "scripts"));
    await cp(path.join(root, "scripts/build-insights.mjs"), path.join(temporary, "scripts/build-insights.mjs"));
    await mkdir(path.join(temporary, "src/content"), { recursive: true });
    await cp(path.join(root, "src/content/insights"), path.join(temporary, "src/content/insights"), { recursive: true });
    const run = () => execFileSync(process.execPath, ["scripts/build-insights.mjs"], { cwd: temporary });
    run();
    const first = new Map();
    for (const file of await htmlFiles(path.join(temporary, "insights"))) {
      const relative = path.relative(temporary, file);
      const html = await readFile(file, "utf8");
      first.set(relative, html);
      assert.equal(html, await readFile(path.join(root, relative), "utf8"), `${relative} differs from committed output`);
      assert.match(html, /<meta name="description" content="[^"]+"/);
      assert.match(html, /<meta property="og:url" content="https:\/\//);
      const structured = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
      assert.ok(structured, `${relative} lost structured data`);
      const data = JSON.parse(structured[1]);
      assert.equal(data["@context"], "https://schema.org");
      if (relative === "insights/index.html") {
        assert.match(html, /rel="canonical" href="https:\/\/waiausa.com\/insights\/"/);
        assert.equal(data.hasPart.length, 8);
        assert.match(html, /href="\/insights\/ai-adoption-is-rising-is-it-working\/"/);
      } else {
        assert.match(html, /rel="canonical" href="https:\/\/waiausa.com\/insights\//);
        assert.match(html, /hreflang="en-GB" href="https:\/\/waia.co.uk\/insights\//);
        assert.equal(data["@type"], "Article");
      }
    }
    assert.equal(first.size, 9);
    run();
    for (const [relative, html] of first) {
      assert.equal(await readFile(path.join(temporary, relative), "utf8"), html, `${relative} changed on a second run`);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("Pages output contains only supported US routes and working local links", async () => {
  build();
  const files = await htmlFiles(dist);
  assert.equal(files.length, 35);
  assert.equal(await readFile(path.join(dist, "CNAME"), "utf8").then(() => true, () => false), false);
  assert.equal(await readFile(path.join(dist, "workplace-ai-visibility-check/index.html"), "utf8").then(() => true, () => false), true);
  assert.equal(await readFile(path.join(dist, "insights/ai-adoption-vs-ai-effectiveness/index.html"), "utf8").then(() => true, () => false), true);
  assert.equal(await readFile(path.join(dist, "workplace-ai-visibility-check/check/index.html"), "utf8").then(() => true, () => false), false);
  for (const privatePath of ["README.md", "AGENTS.md", "scripts/build-site.mjs", "src/content/insights/ai-adoption-vs-ai-effectiveness.md", "automation/visibility-check-access/Code.gs", "cloudflare/visibility-check-redemption/worker.mjs"]) {
    assert.equal(await readFile(path.join(dist, privatePath)).then(() => true, () => false), false, privatePath);
  }
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  assert.doesNotMatch(sitemap, /waia.co.uk|\/workplace-ai-visibility-check\/(?:start|access|check|results)\//);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 24);
  assert.match(await readFile(path.join(dist, "robots.txt"), "utf8"), /https:\/\/waiausa.com\/sitemap.xml/);
  assert.match(await readFile(path.join(dist, "_redirects"), "utf8"), /\/workplace-ai-visibility-check\/check\/ https:\/\/waia.co.uk\/workplace-ai-visibility-check\/check\/ 302/);
  for (const file of files) {
    const relative = path.relative(dist, file);
    const html = await readFile(file, "utf8");
    assert.match(html, /<html\s+lang="en-US"/);
    assert.doesNotMatch(html, /9fa2711aed53428980734989cf03178a/);
    if (relative === "pricing/index.html") assert.doesNotMatch(html, /£|GBP|\$[0-9]/);
    if (!relative.startsWith("go/")) {
      assert.equal((html.match(/<h1\b/g) || []).length, 1, `${relative} needs one h1`);
    }
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${relative} has duplicate IDs`);
    for (const image of html.match(/<img\b[^>]*>/g) || []) {
      assert.match(image, /\balt="[^"]*"/, `${relative} has an image without alt text`);
    }
    for (const button of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) || []) {
      const label = button.replace(/<[^>]+>/g, "").trim();
      assert.ok(label || /aria-label="[^"]+"/.test(button), `${relative} has an unlabeled button`);
    }
    if (!["404.html", "analytics-preferences/index.html", "workplace-ai-visibility-check/start/index.html", "workplace-ai-visibility-check/access/index.html"].includes(relative) && !relative.startsWith("go/")) {
      const route = relative === "index.html" ? "/" : `/${relative.slice(0, -"index.html".length)}`;
      assert.match(html, new RegExp(`rel="canonical"\\s+href="https://waiausa\\.com${route}"`));
      assert.match(sitemap, new RegExp(`https://waiausa\\.com${route.replaceAll("/", "\\/")}`));
    } else {
      assert.match(html, /name="robots" content="noindex/);
    }
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = new URL(match[1].replaceAll("&amp;", "&"), `https://waiausa.com/${relative}`);
      if (target.origin !== "https://waiausa.com") continue;
      const dest = target.pathname.endsWith("/") ? `${target.pathname.slice(1)}index.html` : target.pathname.slice(1);
      const local = path.join(dist, dest);
      assert.equal(await readFile(local).then(() => true, () => false), true, `${relative} links to missing ${target.pathname}`);
    }
  }
  const analytics = await readFile(path.join(dist, "assets/js/analytics.js"), "utf8");
  assert.doesNotMatch(analytics, /9fa2711aed53428980734989cf03178a/);
  for (const stylesheet of ["homepage.css", "editorial-pages.css"]) {
    const cssPath = path.join(dist, "assets/css", stylesheet);
    const css = await readFile(cssPath, "utf8");
    for (const [, reference] of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const asset = path.resolve(path.dirname(cssPath), reference);
      assert.equal(await readFile(asset).then(() => true, () => false), true, `${stylesheet} refers to missing ${reference}`);
    }
  }
});

test("US analytics token is injected only for production builds", async () => {
  const token = "b".repeat(32);
  build({ WAIA_US_WEB_ANALYTICS_TOKEN: token });
  assert.match(await readFile(path.join(dist, "index.html"), "utf8"), new RegExp(`data-waia-us-token="${token}"`));
  build({ CF_PAGES_BRANCH: "codex/us-market-validation", WAIA_US_WEB_ANALYTICS_TOKEN: token });
  assert.doesNotMatch(await readFile(path.join(dist, "index.html"), "utf8"), /data-waia-us-token/);
  build();
});
