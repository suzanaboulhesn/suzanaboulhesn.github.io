# Suzan Aboul Hesn — Architecture Portfolio

Source for **https://suzanaboulhesn.github.io**, an interactive version of the PDF portfolio (selected projects 2014–2025).

Built with [Vite](https://vite.dev) + React, [Motion](https://motion.dev) for animation, [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling and [Yet Another React Lightbox](https://yet-another-react-lightbox.com) for the zoomable galleries. GitHub Actions builds and deploys the site to GitHub Pages on every push to `main`.

## What's on the page

- **Hero**: crossfading render slideshow with a CAD-style crosshair that reads out coordinates.
- **Approach**: a statement that lights up word by word as you scroll, plus animated figures.
- **Residential**: a pinned, horizontally scrolling gallery of the seven homes (swipeable on phones).
- **Exhibition & Events**: the page dims to "stage lighting"; panels expand on hover.
- **Sustainable design (EBS 20, Seville)**: an explorer for the passive strategies, plus her hand-painted community vignettes.
- **Sawfar Grand Hotel**: the adaptive-reuse thesis, with a magnifying loupe over the storyboard.
- **Sketchbook**: hand sketches on a drafting table that visitors can drag around.
- **Index**: every project, filterable, with a preview that follows the cursor.
- **About / Contact**: portrait, education, tools, copy-to-clipboard email and the full PDF download.

Every project opens in a full-screen sheet with its own page and shareable link, e.g. `https://suzanaboulhesn.github.io/projects/dubai-hills-villa/` (old `#/work/...` links redirect).

## Edit the content

All text lives in [`src/data/projects.js`](src/data/projects.js): project titles, dates, locations, descriptions, image captions, the profile, education and tools. Change it, then run `./publish.ps1` again.

Images are in `public/work/<project>/` as WebP, in two sizes (`1.webp` up to 2400px wide, `1-sm.webp` up to 960px). To add an image, export both sizes, add the file names to `src/data/manifest.js` with their width and height, and reference them with `img('<project>/<n>', 'Caption')` in `projects.js`.

## Search engines & AI assistants (SEO / GEO)

`npm run build` runs [`scripts/prerender.mjs`](scripts/prerender.mjs) after Vite. It writes real HTML for the home page and every project at `/projects/<slug>/` (crawlers that don't run JavaScript still see all the text), with per-page titles, descriptions, share images (`public/og/`) and schema.org JSON-LD for Suzan and each project. It also generates `sitemap.xml` (with images), `robots.txt` (open to AI crawlers) and `llms.txt` (a plain-language brief for AI answer engines). Titles and descriptions live in [`src/seo.js`](src/seo.js); add her LinkedIn/Behance/Instagram URLs to `PROFILE.sameAs` in `projects.js`.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## Publish

See the header of [`publish.ps1`](publish.ps1). Once the `suzanaboulhesn` GitHub account exists and `gh` is logged in as it, `./publish.ps1` creates the repository, turns on Pages and pushes.
