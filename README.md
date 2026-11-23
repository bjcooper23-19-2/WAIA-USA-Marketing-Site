# WAIA USA Marketing Site

This repository prepares the American English marketing site for `https://waiausa.com/`. It follows the approved UK site at `https://waia.co.uk/` while keeping the US domain, enquiry attribution, optional analytics property and legal context separate. Nineteen Point Two Ltd remains the UK operator. The application sign-in remains `https://app.waia.co.uk/login`.

The November 2026 parity implementation uses UK `main` commit `2bb9a24396f2c8ae9c0736783328d715bd3813c7` and US base commit `0c6668d74c3c4d1ff32a491a4be627e790bbd935`. See [the parity record](docs/uk-us-parity-2026-11.md) for route inventory, deliberate regional differences, visual evidence and remaining release checks. The [foundation record](docs/us-site-foundation.md) and [original launch review](docs/us-launch.md) remain historical context.

WAIA helps managers see where AI is used in recurring work, what changed across a workflow and which claims about value the evidence supports. The Open Wayfinder brand assets remain in `brand/`. This site does not claim US data residency, a US legal entity, US regulatory certification, customer outcomes or a USD price.

## Local build and checks

Use Node 22 or later. There are no package dependencies.

```sh
node scripts/build-site.mjs
node --test scripts/*.test.mjs
python3 -m http.server 4173 --directory dist
```

Open `http://127.0.0.1:4173/`. Cloudflare Pages runs `node scripts/build-site.mjs` and publishes `dist/`, never the repository root. The build includes only declared public pages and referenced assets. It excludes source Markdown, repository guidance, automation, Worker code, tests and private configuration. The UK Worker remains outside this deployment.

## Public routes

- `/`, `/how-it-works/`, `/who-its-for/`, `/pricing/`, `/see-waia/`
- `/insights/` and the eight generated article routes in `src/content/insights/`
- `/workplace-ai-visibility-check/` and `/workplace-ai-visibility-check/start/`
- `/data-privacy/`, `/terms/`, `/ai-use-statement/`
- `/privacy/`, `/cookies/`, `/website-terms/`, `/data-processing-agreement/`, `/security/`, `/subprocessors/`
- `/analytics-preferences/`, the five `/go/see-waia/{ap,gm,19,li,direct}/` handoffs, `/go/visibility-check/` and `/go/content/2026-10-evidence-value/`
- `/404.html`, `/robots.txt`, `/sitemap.xml`

The Insights generator reads the Markdown source and writes the index and eight article files in `insights/`. The build runs the generator. Tests compare regenerated output byte for byte with the committed files. US articles have US self-canonicals, UK regional alternates and US structured-data URLs. Their editorial claims and examples remain those of the approved UK source; only regional spelling and URLs change.

## Visibility Check

US visitors can request the existing Workplace AI Visibility Check from the localized landing and start pages. The dedicated Tally form and Apps Script still produce UK access links. Redemption, the seven-question assessment and results run on `waia.co.uk` under the existing UK Worker, token expiry and single-use rules. US `/check/` and `/results/` routes redirect there. A noindex US `/access/` bridge forwards a well-formed token to the UK access page without contacting a US API. No US Worker, database, Apps Script or secret is added. A real request, reviewed email and completed assessment remain an owner-operated live test; the repository does not submit production forms or redeem a live token.

## Enquiries and analytics

The approved Tally enquiry form remains `https://tally.so/r/objzGM`. Links carry `product=WAIA`, a bounded `enquiry_type` and a direct fallback of `s=us_direct`. `assets/js/source-attribution.js` maps current-page `s=ap`, `gm`, `19` and `li` to the corresponding first-party handoff; `assets/js/tally-handoff.js` sends `us_ap`, `us_gm`, `us_19`, `us_li` or `us_direct`. It does not store source tags in the browser. See [source attribution](docs/source-attribution.md).

The optional `WAIA_US_WEB_ANALYTICS_TOKEN` injects a separate 32-character US Cloudflare Web Analytics token for production builds only. Without it, no beacon loads. A saved analytics objection suppresses it when enabled. The UK property is never copied. Cloudflare Pages, DNS, Tally settings and the WAIA application are not configured by this repository.
