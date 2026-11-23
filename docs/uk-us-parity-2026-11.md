# UK-to-USA site parity, November 2026

## Source and scope

- UK `main`: `2bb9a24396f2c8ae9c0736783328d715bd3813c7` (merged PR #119, Evidence capitalization in the approved logo).
- Original US `main`: `0c6668d74c3c4d1ff32a491a4be627e790bbd935`.
- The UK `pages-build-deployment` run for that exact SHA completed successfully on 23 November 2026. The live UK homepage and pricing page show the current two-image hero and non-specific subscription pricing. Eight live UK journeys were captured beside the local US build. The UK repository had no open PRs when checked; unmerged work was not transferred.
- Risk class: **Protected**, because this change touches legal pages, enquiry routing and Visibility Check access. The intervention is a transfer of the current UK static implementation with a bounded US localization layer and the existing US `dist/` publishing boundary. Success means equivalent buyer presentation, working US handoffs, complete local article routes and no new service or unsupported claim.

## Public route inventory

The 24 indexable routes are `/`, `/how-it-works/`, `/who-its-for/`, `/pricing/`, `/see-waia/`, `/insights/`, all eight `/insights/<slug>/` articles, `/workplace-ai-visibility-check/`, `/data-privacy/`, `/terms/`, `/ai-use-statement/`, `/website-terms/`, `/privacy/`, `/cookies/`, `/data-processing-agreement/`, `/security/` and `/subprocessors/`.

The build also publishes noindex `/analytics-preferences/`, `/workplace-ai-visibility-check/start/`, `/workplace-ai-visibility-check/access/`, the five `/go/see-waia/<source>/` routes, `/go/visibility-check/`, `/go/content/2026-10-evidence-value/` and `/404.html`. US `/workplace-ai-visibility-check/check/` and `/results/` redirect to the existing UK pages. No US redemption endpoint is published. `robots.txt` points to the US sitemap, which lists only the 24 indexable pages.

The UK fonts, CSS, page compositions, genuine product screenshots, two-image homepage hero, logo lockups and Insights generator were transferred from the source commit. American English was applied to headings, copy, metadata, alt text and article Markdown. The generated article HTML remains byte-for-byte reproducible from that Markdown. Regional `hreflang` pairs remain on corresponding indexable pages. A UK-currency worked example in an Insight remains a clearly illustrative editorial example; the pricing page has no currency figure or band.

## Deliberate regional differences

- US canonicals, Open Graph URLs, structured-data URLs and sitemap entries use `waiausa.com`; the UK pages remain the `en-GB` regional alternatives. US pages use `lang="en-US"`.
- The existing Tally enquiry form receives `product=WAIA`, bounded `enquiry_type` and `s=us_ap`, `us_gm`, `us_19`, `us_li` or `us_direct`. Links have a no-JavaScript direct fallback. Source tags are not stored across pages.
- Optional Cloudflare analytics continues to use only `WAIA_US_WEB_ANALYTICS_TOKEN` in production. The UK token is absent. The existing objection remains available.
- Nineteen Point Two Ltd remains the UK operator. US legal introductions explain operator identity, contract review, hosting and transfer questions without claiming a US entity, US residency, certification or USD price. The DPA still identifies the UK-published versions referenced by signed Order Forms.
- The US Visibility Check landing and request page lead to the existing Tally request. The reviewed email links to `waia.co.uk/access/`, whose Worker and Apps Script remain the token authority. A well-formed token accidentally opened on the US `/access/` bridge is forwarded to the UK access page without redemption or analytics. The check and results stay on the UK origin so browser-tab results remain available. No UK backend, customer record or production setting was changed.

## Verification and evidence

`node scripts/build-site.mjs` built 35 public HTML files and 37 referenced assets in `dist/`. `node --test scripts/*.test.mjs` passed 78 tests. The suite covers generated article parity, metadata and structured data, the public-output boundary, local links, source attribution, analytics objection, and the inherited UK request/redemption/assessment logic. The build excludes `README.md`, `AGENTS.md`, source Markdown, scripts, automation and Worker source.

Browser review covered the homepage, How it works, Who it's for, Pricing, Insights, Visibility Check landing, See WAIA and Data & privacy at 320, 390, 768, 1280 and 1440 px. The US build had no persistent horizontal overflow, missing eager images or font failures. The mobile menu expanded, links were exposed, and keyboard focus was visibly outlined. The transferred styles include reduced-motion rules. One initial image-load reading and one initial UK overflow reading cleared on immediate recheck. The browser reported no console errors in the final local pass. The US start page and live UK start page both link to the same live Tally request form, which loaded. An invalid UK access token displayed the inactive-link error state without presenting a redemption action. Full-page captures and raw measurements are below and in [`us-metrics.json`](uk-us-parity-2026-11/us-metrics.json) and [`uk-metrics.json`](uk-us-parity-2026-11/uk-metrics.json).

| Page | Mobile UK / US | Desktop UK / US |
| --- | --- | --- |
| Home | [UK](uk-us-parity-2026-11/screenshots/uk-home-390.png) / [US](uk-us-parity-2026-11/screenshots/us-home-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-home-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-home-1440.png) |
| How it works | [UK](uk-us-parity-2026-11/screenshots/uk-how-it-works-390.png) / [US](uk-us-parity-2026-11/screenshots/us-how-it-works-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-how-it-works-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-how-it-works-1440.png) |
| Who it's for | [UK](uk-us-parity-2026-11/screenshots/uk-who-its-for-390.png) / [US](uk-us-parity-2026-11/screenshots/us-who-its-for-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-who-its-for-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-who-its-for-1440.png) |
| Pricing | [UK](uk-us-parity-2026-11/screenshots/uk-pricing-390.png) / [US](uk-us-parity-2026-11/screenshots/us-pricing-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-pricing-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-pricing-1440.png) |
| Insights | [UK](uk-us-parity-2026-11/screenshots/uk-insights-390.png) / [US](uk-us-parity-2026-11/screenshots/us-insights-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-insights-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-insights-1440.png) |
| Visibility Check | [UK](uk-us-parity-2026-11/screenshots/uk-workplace-ai-visibility-check-390.png) / [US](uk-us-parity-2026-11/screenshots/us-workplace-ai-visibility-check-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-workplace-ai-visibility-check-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-workplace-ai-visibility-check-1440.png) |
| See WAIA | [UK](uk-us-parity-2026-11/screenshots/uk-see-waia-390.png) / [US](uk-us-parity-2026-11/screenshots/us-see-waia-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-see-waia-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-see-waia-1440.png) |
| Data & privacy | [UK](uk-us-parity-2026-11/screenshots/uk-data-privacy-390.png) / [US](uk-us-parity-2026-11/screenshots/us-data-privacy-390.png) | [UK](uk-us-parity-2026-11/screenshots/uk-data-privacy-1440.png) / [US](uk-us-parity-2026-11/screenshots/us-data-privacy-1440.png) |

## Release checks that require the owner or a deployed preview

No production Tally form was submitted and no live token was redeemed. A controlled owner test should submit the US request form, review the draft/access email, open the UK link, redeem once, finish the seven questions, print/save a result, and confirm expiry or second-use rejection. It should also submit one controlled WAIA enquiry and inspect Tally's stored `product`, `enquiry_type` and `us_*` fields. The existing access form and its confirmation copy are UK-hosted and may retain UK spelling. Cloudflare Pages redirect behavior, the final domain response, preview noindex headers and any configured US analytics property require verification after an approved deployment. Legal and privacy wording is included for owner review before publication.

Human supervision: source selection and owner decisions were supplied in the brief; no routine design decisions were escalated. Rework: old route-exclusion tests were updated and one transient browser reading was rechecked. Escaped defects: none known before deployment; live submissions and hosted redirect behavior remain untested.
