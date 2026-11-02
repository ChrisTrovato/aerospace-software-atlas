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

**Deployment verification pending**

Verify the Git-connected Vercel deployment and the main website's `/softwares` route, including static assets and page refreshes.
