# US site repository foundation

This repository starts from `bjcooper23-19-2/WAIA-Marketing-Site` at
`424d63113ecb1b2483be9ca07ed52b0a984e632a` (`main`, fetched on
9 November 2026). Its Git history was carried over by setting the new
repository's `main` branch to that commit, then committing the US foundation
changes on top. The source repository was not changed.

The source tree was copied in full, including the static pages, CSS,
JavaScript, images, Open Wayfinder brand assets and guidance, Insights
Markdown sources and generator, test scripts, automation and Worker source,
and project documentation. The sole source file removed here is `CNAME`,
which specified `waia.co.uk` for the UK's GitHub Pages deployment.

The copied site still contains UK URLs, legal and commercial content,
integration settings, and deployment references. Those are source material
for a later US review and rewrite; this foundation does not configure
Cloudflare Pages or deploy `waiausa.com`.

## Initialisation method

1. Fetched the latest source `main` into an empty local checkout.
2. Set local `main` to the fetched source commit, retaining its ancestry.
3. Removed `CNAME` and added this record.
4. Ran the existing Insights generator and Node test suite. The generator
   completed, but changed nine committed Insights HTML files. A line-based
   diff appeared to remove index metadata and structured data, so those files
   were restored to keep this foundation an exact copy outside the two
   intentional changes. Later inspection found the metadata still present in
   compact generated markup; see `docs/us-launch.md` for the resolution.
5. Pushed the resulting `main` branch to the empty US repository.
