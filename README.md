# Suzan Aboul Hesn — Architecture Portfolio

Source for **https://suzanaboulhesn.github.io**, an interactive version of the PDF portfolio (selected projects 2014–2025).

Built with [Vite](https://vite.dev) + React, [Motion](https://motion.dev) for animation, [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling and [Yet Another React Lightbox](https://yet-another-react-lightbox.com) for the zoomable galleries. GitHub Actions builds and deploys the site to GitHub Pages on every push to `main`.

## What's on the page

- **Hero**: crossfading render slideshow with a CAD-style crosshair that reads out coordinates.
- **Approach**: a statement that lights up word by word as you scroll, plus animated figures.
- **Residential**: a pinned, horizontally scrolling gallery of the seven homes (swipeable on phones).
- **Exhibition & Events**: the page dims to "stage lighting"; panels expand on hover.
- **Sawfar Grand Hotel**: the adaptive-reuse thesis, with a magnifying loupe over the storyboard.
- **Sketchbook**: hand sketches on a drafting table that visitors can drag around.
- **Index**: every project, filterable, with a preview that follows the cursor.
- **About / Contact**: portrait, education, tools, copy-to-clipboard email and the full PDF download.

Every project opens in a full-screen sheet with its own shareable link, e.g. `https://suzanaboulhesn.github.io/#/work/dubai-hills-villa`.

## Edit the content

All text lives in [`src/data/projects.js`](src/data/projects.js): project titles, dates, locations, descriptions, image captions, the profile, education and tools. Change it, then run `./publish.ps1` again.

Images are in `public/work/<project>/` as WebP, in two sizes (`1.webp` up to 2400px wide, `1-sm.webp` up to 960px). To add an image, export both sizes, add the file names to `src/data/manifest.json` with their width and height, and reference them with `img('<project>/<n>', 'Caption')` in `projects.js`.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## Publish

See the header of [`publish.ps1`](publish.ps1). Once the `suzanaboulhesn` GitHub account exists and `gh` is logged in as it, `./publish.ps1` creates the repository, turns on Pages and pushes.
