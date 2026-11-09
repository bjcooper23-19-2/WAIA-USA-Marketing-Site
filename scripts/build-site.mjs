import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
const branch = process.env.CF_PAGES_BRANCH;
const token = branch && branch !== "main" ? "" : process.env.WAIA_US_WEB_ANALYTICS_TOKEN || "";
if (token && !/^[a-f0-9]{32}$/.test(token)) {
  throw new Error("WAIA_US_WEB_ANALYTICS_TOKEN must be a 32-character lowercase hex token");
}

// Keep the publishing boundary explicit. In particular, the existing UK
// Visibility Check needs a separate US Worker and Apps Script configuration.
const pages = [
  "index.html",
  "404.html",
  "how-it-works/index.html",
  "who-its-for/index.html",
  "pricing/index.html",
  "see-waia/index.html",
  "insights/index.html",
  "data-privacy/index.html",
  "terms/index.html",
  "ai-use-statement/index.html",
  "analytics-preferences/index.html",
  ...["ap", "gm", "19", "li", "direct"].map(
    (source) => `go/see-waia/${source}/index.html`,
  ),
];

process.chdir(root);
await import("./build-insights.mjs");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const references = new Set();
const addReferences = (content) => {
  for (const match of content.matchAll(/\/assets\/[A-Za-z0-9._/-]+/g)) {
    references.add(match[0].slice(1));
  }
};

for (const page of pages) {
  let html = await readFile(path.join(root, page), "utf8");
  if (token) {
    html = html.replaceAll(
      'src="/assets/js/analytics.js"',
      `src="/assets/js/analytics.js" data-waia-us-token="${token}"`,
    );
  }
  addReferences(html);
  const destination = path.join(output, page);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

const copied = new Set();
while (references.size) {
  const asset = references.values().next().value;
  references.delete(asset);
  if (copied.has(asset)) continue;
  if (!asset.startsWith("assets/") || asset.split("/").includes("..")) {
    throw new Error(`Unsafe asset reference: ${asset}`);
  }
  const source = path.join(root, asset);
  const destination = path.join(output, asset);
  const content = await readFile(source);
  if (asset.endsWith(".css")) addReferences(content.toString("utf8"));
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  copied.add(asset);
}

for (const file of ["robots.txt", "sitemap.xml"]) {
  await copyFile(path.join(root, file), path.join(output, file));
}

await writeFile(
  path.join(output, "_redirects"),
  [
    "/workplace-ai-visibility-check/ /see-waia/ 302",
    "/workplace-ai-visibility-check/* /see-waia/ 302",
    "/go/visibility-check/ /see-waia/ 302",
    "/go/content/* /see-waia/ 302",
    "",
  ].join("\n"),
);

console.log(`Built ${pages.length} public pages and ${copied.size} assets in dist/`);
