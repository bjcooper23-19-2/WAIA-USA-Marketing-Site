# US enquiry source attribution

The US site keeps the existing WAIA Tally form and its hidden fields `s`, `product` and `enquiry_type`. It uses the current page's `s` query value to select a first-party handoff. No cookie, visitor ID or marketing source storage is added.

| Incoming URL value | Handoff route | Tally `s` value |
| --- | --- | --- |
| `ap` | `/go/see-waia/ap/` | `us_ap` |
| `gm` | `/go/see-waia/gm/` | `us_gm` |
| `19` | `/go/see-waia/19/` | `us_19` |
| `li` | `/go/see-waia/li/` | `us_li` |
| Missing, duplicate or invalid | `/go/see-waia/direct/` | `us_direct` |

`assets/js/source-attribution.js` rewrites only links to the dedicated `https://tally.so/r/objzGM` form. It preserves `enquiry_type=procurement` where present; all other enquiry types use `walkthrough`. `assets/js/tally-handoff.js` sends `product=WAIA`, that bounded enquiry type and the US-prefixed source. It never forwards arbitrary query parameters or the old content ID. Each route is `noindex, nofollow` and excluded from the sitemap.

The source tag is not propagated through internal navigation. A visitor who moves to another page without `?s=...` becomes `us_direct` at the next enquiry link. This still distinguishes US form submissions from UK ones, but does not promise multi-page campaign attribution. The source is not stored in `sessionStorage`, `localStorage` or a cookie.

Static CTA links and each handoff's `<noscript>` link carry `s=us_direct` or the route's `us_*` value, so the form remains usable without JavaScript. With no US Cloudflare Web Analytics token, the handoff forwards immediately. If a separate US token is configured at build time, it waits for the existing beacon request or a maximum of 1.5 seconds; analytics failures cannot trap the visitor. A handoff is a click, not evidence of a completed submission. Only Tally can confirm the submitted hidden-field values.

Run `node --test scripts/source-attribution.test.mjs` for accepted and rejected source values, procurement preservation, no storage, bounded forwarding and no-JavaScript fallbacks. After approved deployment, use the controlled submission checklist in `docs/us-launch.md` to verify the published Tally form actually records the `us_*` values.
