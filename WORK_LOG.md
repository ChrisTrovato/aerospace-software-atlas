# Work log

**November 2, 2026 — Initial atlas implementation**

- Prepared 116 software profiles covering engineering applications, languages, libraries, frameworks, and development environments. Profiles include purpose, prerequisites, a beginner project, learning priority, access and platform notes, alternatives, and public sources.
- Added 20 engineering pathways, four proposed learning phases spanning 2026–2035, a glossary, and curriculum/employer examples. The guide distinguishes broad foundations from tools that depend on a specialty, course, project, or employer.
- Implemented a static catalog with tool details, pathway and roadmap views, filtering, comparison, and a personal learning list. Progress and notes remain in browser storage, with JSON export/import for backups and no login.
- Added a catalog build script, local server, automated tests, content checks, and standalone Vercel configuration. The intended public route is `/softwares` on the main website and requires a separate domain-path proxy.
- Documented the public source snapshot and access date. Software availability and requirements should be rechecked when the content is updated.

**Local verification**

- Catalog build and schema checks pass for 116 profiles and 20 pathways.
- All 19 automated tests pass, covering filters, imports, escaping, public data, and references.
- Browser checks cover filtering, profile navigation, notes, reload persistence, status changes, backup export/import, three-tool comparison limits, keyboard skip navigation, and a 390-pixel responsive layout.
- Corrected import validation, stale auto-save controls, and skip-link routing during review.

**Deployment verification**

- Published the source to `ChrisTrovato/aerospace-software-atlas` on GitHub.
- Deployed committed source through the Vercel API to `https://aerospace-software-atlas.vercel.app`.
- Added and promoted a single scoped rewrite for `/softwares` on the main portfolio project.
- Verified `https://www.christrovato.com/softwares`, catalog data loading, filtering, direct tool navigation, and a tool-page refresh in the browser.
- Aligned recommended pathway tools with catalog specialty tags so counts and filters agree.
- Automatic Git deployments remain unconfigured: the Vercel Git integration returned repository-access errors. Direct deployment succeeded without changing Git integration permissions.


## November 4, 2026 — Coding Field Guide

Added a six-page programming learning hub with five language guides, 30 provider-linked resources, four mission narratives, five illustrative interactive demos, and local study/readiness progress with validated JSON backup. The existing Software Atlas content is preserved.

Validation: 27 automated tests passed, including the original 19 atlas checks. Static content and asset audit passed. Chrome checks covered all five demo results, all six mobile routes without page-level overflow, resource filtering, mission switching, session duration/focus, local persistence, and export/import restoration. Desktop and mobile visuals inspected. Public routing is scoped to the coding pages and shared coding assets.
