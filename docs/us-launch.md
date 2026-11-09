# US market-validation launch review

Prepared 9 November 2026 from US repository foundation commit `1d19f38aa3fcfc10069381feaba1f4160b6ad2f7`. This is a review and deployment handoff. No Cloudflare project, domain, Worker, Tally form, WAIA application or UK repository was changed.

## Route decisions

| Route | US change | Search decision |
| --- | --- | --- |
| `/` | American English lead focused on AI use, workflow impact, evidence strength and management decisions. Removed the UK-bound free-check offer and GBP price. | US self-canonical, in sitemap. |
| `/how-it-works/` | Clarified how reported use becomes workflow evidence and manager review. Product screenshots and method retained. | US self-canonical, in sitemap. |
| `/who-its-for/` | Refocused buyer-fit introduction on accountable US operations, people, finance and executive leaders. | US self-canonical, in sitemap. |
| `/see-waia/` | Walkthrough request now asks for a real management question and invites US procurement and data questions. | US self-canonical, in sitemap. |
| `/pricing/` | Removed the homepage GBP anchor and the page's GBP quote language. Price, currency, taxes and implementation remain subject to the signed Customer Order Form; no USD amount is claimed. | US self-canonical, in sitemap. |
| `/data-privacy/` | Retains the UK operator and product boundaries; explicitly directs buyers to review hosting, transfers and subprocessors before contracting. | US self-canonical, in sitemap. |
| `/terms/` | Retains the current UK company's contract wording, including England and Wales law. The introduction flags review for US buyers. Contract wording requires owner/legal approval before launch. | US self-canonical, in sitemap. |
| `/ai-use-statement/` | Retains the current product statement and makes the absence of US compliance certification explicit. | US self-canonical, in sitemap. |
| `/insights/` | US index links to the eight original UK articles. Regeneration preserves their original canonical URLs, metadata and structured data; article HTML is **not** in the Pages output. | US index self-canonical and in sitemap. Articles absent. |
| `/analytics-preferences/` | Preference text covers optional US Cloudflare analytics. | `noindex`, outside sitemap. |
| `/go/see-waia/{ap,gm,19,li,direct}/` | Keeps the same Tally form and hidden-field names, with US-prefixed `s` values. | `noindex, nofollow`, outside sitemap. |
| `/workplace-ai-visibility-check/*`, `/go/visibility-check/`, `/go/content/*` | Inherited UK flow excluded. Pages `_redirects` sends old US paths to `/see-waia/` with 302. | Not published or listed in sitemap. |
| `/404.html` | Regional language tag; noindex retained. | `noindex`. |

All published pages use `lang="en-US"`. Indexable pages use `https://waiausa.com` canonical and OG URLs. `robots.txt` points to the US sitemap. No UK GitHub Pages `CNAME` exists.

## Pre-deployment validation

- `node --test scripts/*.test.mjs`: 77 tests passed, including generated-file parity, metadata and structured data, static output boundaries, local links, basic heading/image/button/ID checks, lead attribution, and the retained Worker/Visibility Check unit tests.
- `node scripts/build-site.mjs`: generated 16 HTML pages and 28 referenced assets in a 2.7 MB `dist/`. The output contains no repository internals, source documents, test scripts, copied articles or UK check route.
- Read-only HTTP checks returned 200 for the linked Tally form, WAIA sign-in, five shared legal pages and eight original UK articles. The public Tally response lists the three expected hidden-field names. No enquiry was submitted.
- Browser review at 390 px and 1440 px found no horizontal overflow on the homepage, pricing or See WAIA; the mobile menu expanded, and loaded product images rendered. This is a basic visual and accessibility check, not a full WCAG audit. Cloudflare Pages redirects and actual submitted hidden-field values remain deployment checks.

## Insights generator finding

The foundation comparison showed a large line diff because the generator emits compact HTML while the committed UK files had been formatted and edited after generation. Inspection of regenerated HTML found that description, Open Graph, canonical and JSON-LD data were still present, though some appeared removed in a line-based diff because they had moved into compact tags. One computed reading-time label also differed. The US repository now commits the generated output and tests byte-for-byte regeneration, a second identical run, article metadata and structured data. The Pages build runs the generator before assembling `dist/` and publishes only the US index. UK article pages remain the canonical editorial source until separately approved US editions exist.

## Cloudflare Pages configuration

After PR review and approval, create a **new** Pages project connected to `bjcooper23-19-2/WAIA-USA-Marketing-Site`. Use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None / static HTML |
| Root directory | Repository root |
| Build command | `node scripts/build-site.mjs` |
| Build output directory | `dist` |
| Node version | 22, set by `.node-version` |
| Required build variables | None |
| Optional production build variable | `WAIA_US_WEB_ANALYTICS_TOKEN`: a **new US** Cloudflare Web Analytics property token, 32 lowercase hex characters |

The optional token is public browser configuration, not a secret. Leave it unset until a separate US property and its privacy notice have been reviewed. The build omits the token on non-`main` preview branches. Cloudflare Pages also [adds `X-Robots-Tag: noindex` to preview deployments by default](https://developers.cloudflare.com/pages/configuration/preview-deployments/). The build output includes `_redirects`, `robots.txt`, `sitemap.xml`, `404.html`, 16 HTML pages and only referenced assets. It excludes `.git`, docs, Markdown sources, tests, automation, Worker source and unused images/scripts. The Pages project must publish `dist`, never the repository root.

For `waiausa.com`, add the apex domain through the new Pages project's **Custom domains → Set up a domain** flow. Cloudflare's [custom-domain instructions](https://developers.cloudflare.com/pages/configuration/custom-domains/) require the apex to be a zone on the same account with Cloudflare nameservers; Pages creates the needed DNS record after domain setup. Verify certificate issuance and HTTPS before inviting visitors. Decide separately whether `www.waiausa.com` should be attached and redirected. No DNS change is included here. The three temporary redirects are generated into `dist/_redirects` using [Pages' documented syntax](https://developers.cloudflare.com/pages/configuration/redirects/).

## Integrations and launch boundaries

- **Enquiry:** The current `https://tally.so/r/objzGM` form remains the destination. Its public form response lists hidden fields named `s`, `product` and `enquiry_type`; a controlled submission is still needed to verify stored values. `product=WAIA` and `enquiry_type=walkthrough` or `procurement` are unchanged. The `s` field receives `us_ap`, `us_gm`, `us_19`, `us_li` or `us_direct`. The fallback HTML link carries `us_direct` without JavaScript. The source code is taken from the current URL and not stored; navigation without the query tag becomes `us_direct`.
- **Sign-in:** All sign-in links still point to `https://app.waia.co.uk/login`. The login endpoint returned HTTP 200 during review. This is the current application; no US application host is claimed or configured.
- **Analytics:** The inherited UK Web Analytics token was removed. Without a US token no beacon loads and handoffs proceed without waiting. If enabled later, the existing browser objection suppresses the beacon. The shared company Cookie and Privacy Notices need owner review for this new domain and any US analytics use.
- **Visibility Check:** The inherited dedicated Tally request form `GxPbRz`, Apps Script `Code.gs` and Worker source remain for reference but are not in `dist/`. `Code.gs` still generates `waia.co.uk` access links and its form/Sheet/webhook configuration is UK-bound. The US `wrangler.jsonc` has no route and cannot attach to the UK zone from this repository. To offer a US check later, approve a separate form and access email, configure its Sheet and Apps Script (`SHEET_ID`, `WEBHOOK_SECRET`, `TALLY_FORM_ID`, `PROXY_SECRET`), set a US access URL, then configure a separate Worker route at `waiausa.com/api/visibility-check/redeem` with `APPS_SCRIPT_REDEMPTION_URL` and `APPS_SCRIPT_PROXY_SECRET`. Test one-use, expiry, failure and email-review paths before adding any public CTA. No US API is promised now.

## Owner decisions before publication

1. Approve US market availability, contract wording and whether England and Wales law, the current Order Form, DPA and shared legal notices are suitable for US buyers. Confirm currency, tax treatment, invoicing and any US-specific commercial terms in writing. The site makes no USD price or US entity claim.
2. Confirm actual hosting locations, subprocessors and international transfer terms with the operator. Do not add a US residency claim without evidence.
3. Confirm the Tally form's `s`, `product` and `enquiry_type` hidden fields capture the new `us_*` values in a controlled test submission. Its current public title still uses “organisation”; review form wording, privacy link and confirmation copy for US visitors.
4. Decide whether to enable a separate US Web Analytics property and update the linked privacy/cookie materials. Leave the token unset until that is done.
5. Confirm the UK-hosted application sign-in is the intended customer destination. Keep the Visibility Check off the US site until its separate backend and reviewed email journey exist.
6. Approve the finished copy, product screenshots, current legal documents, sitemap and launch timing before merging or deploying.

## Smoke test after an approved deployment

- Confirm HTTPS at `https://waiausa.com/`; open home, How it works, Who it's for, Pricing, See WAIA, Insights, Privacy, Terms and AI use statement at desktop and mobile widths. Check menu, keyboard focus, screenshots and 404 behavior.
- Check `robots.txt`, `sitemap.xml`, each public canonical and OG URL. Confirm Insights article URLs are not served from the US output and index cards open the UK originals. Confirm `/workplace-ai-visibility-check/` redirects to `/see-waia/` and no US `/api/visibility-check/redeem` journey is advertised.
- Open `/?s=gm` and `/?s=ap`; click See WAIA and confirm the first-party handoff and Tally URLs carry `s=us_gm` and `s=us_ap` plus the existing `product` and `enquiry_type` fields. Repeat direct and procurement paths. Make one controlled submission and verify Tally records the expected hidden fields; do not infer submission success from a click-through alone.
- Confirm the current WAIA sign-in and shared legal links load. If a US analytics token was configured, confirm only the US property receives page views, and the saved objection stops the beacon.
- Check the Pages build log for the expected command and output path. Verify private repository paths such as `/README.md`, `/src/content/insights/` and `/scripts/` are unavailable.
