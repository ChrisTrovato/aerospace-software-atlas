# Aerospace Software Atlas

Also includes **[The Coding Field Guide](https://www.christrovato.com/coding_learning_main)**: six connected pages for Python, C++, MATLAB, C, and Bash/Linux, with 30 learning resources, practical aerospace examples, interactive demonstrations, and local practice tracking. [Coding source and maintenance guide](coding/README.md).

A public learning guide with 116 software profiles, 20 engineering pathways, and a suggested 2026–2035 progression. Explore CAD, scientific computing, simulation, robotics, avionics, systems engineering, and technical communication through small, practical projects.

Live site: [christrovato.com/softwares](https://www.christrovato.com/softwares)
Repository: [ChrisTrovato/aerospace-software-atlas](https://github.com/ChrisTrovato/aerospace-software-atlas)

The priorities are educational recommendations, not universal degree or employer requirements. Dates are proposed learning windows. Sources and access notes reflect a **November 2, 2026** research snapshot; verify current licenses, eligibility, platform requirements, course offerings, and job postings before acting on them.

The learning list, experience statuses, and notes are stored in this browser's `localStorage`. There is no login or server-side progress store. Use **Export my list** to make a JSON backup before changing browsers, devices, website origins, or clearing browser data. **Import a backup** merges recognized tools into the current list. Experience statuses are self-reported notes, not certifications.

To build the catalog and run the local site, use Node.js from the repository root:

```sh
node build.mjs
node serve.mjs
```

Open [the local atlas](http://127.0.0.1:8648/softwares). The server uses port 8648 by default; set `PORT` to choose another port.

Run the automated checks before publishing:

```sh
node --test tests/*.test.mjs
node check.mjs
```

`research/*.json` holds the software profiles. `build.mjs` combines them into `dist/data.json`; edit the research files rather than that generated file. `dist/editorial.json` contains the pathways, roadmap, glossary, and contextual evidence. The remaining files in `dist/` provide the static interface.

The project is configured for a standalone Vercel static deployment with `node build.mjs` as its build command and `dist` as its output directory. The main website proxies `/softwares` and its asset requests to `https://aerospace-software-atlas.vercel.app`. This route is managed in the main portfolio project on Vercel. The current release was deployed from committed source through the Vercel API; automatic Git deployments are not configured because the Vercel Git integration could not access this repository.

Before release, verify the catalog, pathway links, filters, comparison view, progress persistence, backup export/import, mobile layout, and the final domain path in a browser. See `WORK_LOG.md` for implementation and release status.
# Coding Academy expansion

The coding paths now include a complete study workspace: 82 lessons, 328 exercises, 164 recall cards, 27 projects, 80 glossary entries, and downloadable handbooks. Start at [Coding Academy](https://www.christrovato.com/coding_learning_main). See [the coding source guide](coding/README.md) for content, persistence, verification, and maintenance details.
