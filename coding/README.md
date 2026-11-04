# The Coding Field Guide

## Version 2: Coding Academy

The same six public addresses now open a long-term learning workspace, with the original field guides retained in the sidebar.

- 82 substantial lessons, 328 authored exercises, 164 recall cards, 27 project briefs with 108 milestones, 80 glossary entries, and 30 curated resources.
- About 56,000 words in the complete downloadable workbook. The self-contained HTML handbook is readable offline after downloading.
- Search across lessons, exercises, projects, glossary, and resources; filter by language, type, stage, and saved items.
- A prerequisite-aware next-lesson suggestion, one primary language, an optional practice rhythm, focus timer, and activity history.
- Exercise scratchpads with autosave, self-reported completion, progressive hints, worked explanations, and test cases.
- Project milestone tracking, project notes, and downloadable README briefs.
- A recall queue with a transparent interval heuristic, not a personalized or clinically validated memory algorithm.
- Twelve deterministic numeric practice generators. Parameter variations are not represented as distinct authored lessons; these check numbers, not submitted program code.
- An editable journal, six exploration lenses, four synthetic CSV datasets, cross-language comparisons, and study playbooks.
- A dedicated Why tab (`#why`), with five source-linked language histories, timelines, aerospace examples, tradeoffs, learning priorities, and direct curriculum links. Deep-link a language with `#why?lang=cpp` (or python, matlab, c, bash).
- Light and dark themes, responsive layouts, keyboard-accessible controls, and local progress export/import.

### Academy source

`academy/*.json` holds the five original curricula. `academy-build.mjs` checks dependencies, creates the combined data and offline exports, and wraps the six pages. `academy.js` owns browser interactions, `academy-views.mjs` renders views, `academy-engine.mjs` validates/migrates/merges progress, and `drills.mjs` implements numeric exercises. `toolkit.mjs` contains datasets and supporting learning materials. `academy.css` defines the workspace presentation.

Use the same build/test/check commands below. `tests/academy.test.mjs` covers date boundaries, legacy migration, merge semantics, prerequisite recommendations, filters, review scheduling, deterministic drill answers, dataset boundaries, and curriculum contracts.

### Persistence and portability

Version 2 uses `coding-academy-v2` in localStorage. It imports original recorded practice days without inventing study minutes and preserves the original readiness data. Existing version 1 data remains in its original key. There is no account, backend database, cloud sync, or remote code runner. All code editors are scratchpads; programs run in the learner's own language environment.

The backup UI previews counts before merging. Unique entries are retained; newer timestamps win for a matching record ID. Current preferences are retained. Unreadable stored state is not silently replaced: the UI offers a recovery download, and a valid import retains a recovery copy before resuming persistence. Export backups regularly and before moving devices. Clearing site data can remove local progress.

### Content and verification limits

The curriculum is original educational material grounded in linked primary documentation, reviewed in November 2026. Mathematics prerequisites and model limits are included in the lessons. Examples do not establish operational or flight readiness. No physical hardware is required for the initial pathways.

Python examples were syntax-checked; selected arithmetic answers were independently verified. Bash examples passed Git Bash syntax checks. C/C++ snippets were manually reviewed because no compiler was available in the authoring environment; MATLAB runtime execution and third-party scientific Python package execution were also unavailable. The website and its JavaScript practice models have separate automated/browser checks; those are not a claim that every educational snippet was executed.

Version 2 verification: 39 automated tests passed; static asset/privacy checks passed. Browser checks covered exercise and project persistence, search filters, numeric answer feedback, recall scheduling, journal creation/editing, backup preview/merge, next-lesson advancement, theme persistence, and mobile layout across nine workspace views. Production smoke checks are recorded in the release receipt.

---

A six-page aerospace programming learning hub built for a learner keeping robotics, rovers, propulsion analysis, spacecraft, and habitats open as possible directions.

Live entry point: [christrovato.com/coding_learning_main](https://www.christrovato.com/coding_learning_main).

Routes: `/coding_python`, `/coding_Cplusplus`, `/coding_matlab`, `/coding_C`, `/coding_bash`.

The guide includes language-specific investment cases, difficulty and nuance, staged learning sequences, five illustrative interactive demos, 30 curated resources, and local practice/readiness tracking with JSON backup. Resources and ecosystem references were checked November 4, 2026. Cost labels describe access models, not current prices. No purchase is required to begin.

The examples teach civilian robotics, data analysis, thermal modeling, embedded representation, and reproducibility. Browser demos are JavaScript illustrations; displayed Python/C++/MATLAB/C/Bash snippets are separate examples for the appropriate environment. The first-order thermal model, timing budget, status byte, and sample measurements are simplified learning models.

## Source and build

- `content.mjs`: language guides, project examples, mission narratives, source references.
- `resources.json`: resource selection, cost categories, provider links, research caveats.
- `build.mjs`: renders fully readable HTML for all six routes into `dist/`.
- `styles.css`, `app.js`, `engine.mjs`, `icon.svg`: presentation, browser behavior, and pure logic.
- `../tests/coding.test.mjs`: model boundaries, backup normalization/merge, and route/content checks.

From the repository root:

```sh
node build.mjs
node --test tests/*.test.mjs
node check.mjs
node coding/serve.mjs
```

Preview: `http://127.0.0.1:8754/coding_learning_main`.

The original 116-tool Software Atlas remains at `/softwares` on the main domain. Coding HTML and assets are additive, with explicit Vercel rewrites in `vercel.json`. The main christrovato Vercel project proxies only the six coding routes and `/coding_assets/*` to the Software Atlas deployment. Existing main-site routes are retained.

Progress uses `localStorage` key `coding-field-guide-v1` on the current origin. It does not sync with an account or server. Import validates recognized fields and merges positive readiness checks and unique study days. No private conversation exports or account information are published.

Recommendations reflect reviewed conversation context and a current aerospace direction. Earlier electrical-engineering advice and shifting academic timelines were treated as historical context. History access was bounded; the content does not claim an exhaustive account archive review.

AI-assisted research, writing, design, and implementation by Codex, with source review, automated checks, browser interaction checks, and responsive visual inspection. See the repository work log for release verification.
