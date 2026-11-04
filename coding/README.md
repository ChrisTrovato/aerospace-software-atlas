# The Coding Field Guide

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
