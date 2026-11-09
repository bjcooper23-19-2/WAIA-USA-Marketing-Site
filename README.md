# WAIA USA Marketing Site

This repository prepares the separate US marketing site for `https://waiausa.com/`. It starts from the UK WAIA marketing site at source commit `424d63113ecb1b2483be9ca07ed52b0a984e632a`; see [the foundation record](docs/us-site-foundation.md). Nineteen Point Two Ltd remains the UK operator. The application sign-in still points to `https://app.waia.co.uk/login`.

WAIA helps managers see where AI is used in recurring work, what changed across a workflow, and which claims about value the evidence supports. The Open Wayfinder brand assets and visual system remain in `brand/`. This site does not claim US data residency, US regulatory certification, customer results, a US legal entity, or a USD price.

## Local build and checks

Use Node 22 or later. There are no package dependencies.

```sh
node scripts/build-site.mjs
node --test scripts/*.test.mjs
python3 -m http.server 4173 --directory dist
```

Open `http://127.0.0.1:4173/`. The repeatable build writes only public routes and referenced assets into `dist/`; `dist/` is ignored by Git. Never set the Cloudflare Pages output directory to the repository root.

The Insights source remains in `src/content/insights/`. `node scripts/build-insights.mjs` regenerates the index and eight article files in `insights/`. The Node suite compares every regenerated file byte for byte with the committed output and checks metadata and structured data. The US build publishes only the index. Its cards link to the original articles at `waia.co.uk`, avoiding a second public copy of unchanged articles.

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Product and evidence-led proposition |
| `/how-it-works/` | Operating model, evidence strength and review |
| `/who-its-for/` | Buyer fit and management accountability |
| `/pricing/` | Enquiry-led scope and commercial terms |
| `/see-waia/` | Walkthrough request |
| `/insights/` | US editorial index linking to original UK articles |
| `/data-privacy/` | Product data boundaries and legal links |
| `/terms/` | Current Nineteen Point Two Ltd WAIA terms |
| `/ai-use-statement/` | Current product and AI use statement |
| `/analytics-preferences/` | Saved Cloudflare analytics objection; noindex |
| `/go/see-waia/{ap,gm,19,li,direct}/` | Noindex Tally handoffs |

The copied Workplace AI Visibility Check remains in the repository for reference but is excluded from `dist/`. Its existing Apps Script issues UK access links and the UK Worker is attached to `waia.co.uk`. Requests for the omitted US routes redirect to `/see-waia/` until a separate US flow is configured and tested. The public site has no `/api/visibility-check/redeem` endpoint.

## Enquiries and analytics

The existing Tally form remains the enquiry destination. Its hidden fields `product`, `enquiry_type`, and `s` are preserved. US submissions use `s=us_ap`, `us_gm`, `us_19`, `us_li`, or `us_direct`; source tags are taken only from the current URL and are never stored in the browser. A direct fallback carries `us_direct` even without JavaScript. An approved channel tag can be lost after internal navigation; the lead still retains the US origin through `us_direct`. No new tracking service is used.

The inherited UK Cloudflare Web Analytics token was removed. The optional build variable `WAIA_US_WEB_ANALYTICS_TOKEN` accepts a separate 32-character US property token. With no token, no beacon loads and Tally handoffs continue immediately. The variable is ignored on preview branches. See [US launch and deployment notes](docs/us-launch.md) for exact Pages settings, approval decisions and smoke tests.

No Cloudflare project, custom domain, Worker or Tally form setting is changed by this repository.
