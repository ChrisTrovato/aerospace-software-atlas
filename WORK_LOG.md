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
# Coding Academy v2 — November 2026

Expanded the six coding routes into a shared long-term learning workspace. Added five original curricula with 82 lessons, 328 exercises, 164 recall cards, 27 project briefs/108 milestones, and 80 glossary entries. Added searchable/filterable content, prerequisites and next-lesson suggestions, autosaved scratchpads, project tracking, recall scheduling, editable journal, synthetic datasets, exploration lenses, study playbooks, offline handbook/workbook, theme switching, and progress backup migration/merge/recovery.

Validated 39 automated tests and the static asset/privacy audit. Browser checks verified draft and project persistence, search, numeric practice feedback, recall scheduling, journal editing, backup preview/merge, next-lesson advancement, dark theme persistence, and nine mobile view layouts. Python/Bash examples received syntax checks; C/C++ and MATLAB runtime execution was unavailable, as documented in the coding README. The original Software Atlas remains preserved.

## November 5, 2026 — Consistent focus and readiness guidance

Added one shared learning plan to both the Coding Academy and Software Atlas. It prioritizes Python plus one CAD package, introduces C++ after independent small-program fundamentals, ties MATLAB to coursework and C to embedded projects, and treats Bash/Linux as supporting practice from the start. Added five temporary Python readiness checks, five overlapping stages, and twelve expandable software-family checkpoints. Updated Today, Curriculum, Why, catalog cards, profiles, navigation, and calendar roadmap prompts. Preserved existing progress keys, lesson IDs, resources, and all 116 software profiles. Corrected the local preview server’s trailing-slash Atlas route.

Validation: 42 automated tests and the public-content/asset audit pass. Chrome verified reversible readiness outcomes, cross-site navigation, catalog filtering, supporting-tool labels, and Academy/Atlas layouts at 390px without page overflow. No browser console errors observed during the final preview checks.
