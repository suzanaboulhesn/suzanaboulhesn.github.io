// Runs after `vite build`. Gives every page real, crawlable HTML (search engines and AI crawlers that don't run
// JavaScript still see the content), per-page titles/descriptions/share images, schema.org JSON-LD, and writes
// sitemap.xml, robots.txt and llms.txt. The React app replaces the static markup as soon as it loads.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BIO,
  BIO_LEAD,
  CAPABILITIES,
  CATEGORIES,
  EDUCATION,
  PROFILE,
  PROJECTS,
  SKETCHES,
  STATEMENT,
  TOOLS,
  projectPath,
} from '../src/data/projects.js'
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  KEYWORDS,
  SITE,
  abs,
  homeLd,
  ogImage,
  projectDescription,
  projectLd,
  projectTitle,
  projectUrl,
} from '../src/seo.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const today = new Date().toISOString().slice(0, 10)
const year = today.slice(0, 4)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const write = (rel, content) => {
  const file = path.join(dist, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

// ── <head> ───────────────────────────────────────────────────────────────

function head({ title, description, url, image, imageAlt, ogType = 'website', ld, extra = [], robots = 'index, follow, max-image-preview:large' }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="keywords" content="${esc(KEYWORDS.join(', '))}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="Suzan Aboul Hesn — Architect" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
    ...extra,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}

const GEO = [
  `<meta name="geo.region" content="AE-AZ" />`,
  `<meta name="geo.placename" content="Abu Dhabi, United Arab Emirates" />`,
  `<meta name="geo.position" content="24.4539;54.3773" />`,
  `<meta name="ICBM" content="24.4539, 54.3773" />`,
  `<meta property="profile:first_name" content="${PROFILE.first}" />`,
  `<meta property="profile:last_name" content="${PROFILE.last}" />`,
]

function page(headHtml, bodyHtml) {
  const out = template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headHtml)
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`)
  if (out === template) throw new Error('index.html markers not found')
  return out
}

// ── static body ──────────────────────────────────────────────────────────

const siteNav = `<nav aria-label="Site"><a href="/">Home</a><a href="/#residences">Residential</a><a href="/#events">Exhibition &amp; Events</a><a href="/#sustainable">Sustainable design</a><a href="/#concept">Conceptual</a><a href="/#sketchbook">Sketchbook</a><a href="/#about">About</a><a href="/#contact">Contact</a></nav>`
const footer = `<footer><p>© ${year} ${PROFILE.name}, architect · <a href="mailto:${PROFILE.email}">${PROFILE.email}</a> · ${PROFILE.city}, ${PROFILE.country}</p></footer>`
const fullTitle = (p) => `${p.title}${p.subtitle ? ` — ${p.subtitle}` : ''}`

const imgTag = (im, sizes, eager = false) =>
  `<img src="${im.sm}" srcset="${im.sm} ${im.smW}w, ${im.src} ${im.w}w" sizes="${sizes}" width="${im.w}" height="${im.h}" alt="${esc(im.alt || im.caption)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`

const projectItem = (p) =>
  `<li><h3><a href="${projectPath(p.slug)}">${esc(fullTitle(p))}</a></h3><p class="meta">${esc(p.date)} · ${esc(p.location)} · ${esc(p.program)}${p.area ? ` · ${p.area}` : ''}</p><p>${esc(p.short)}</p></li>`

const section = (id, heading, items) => `<section id="${id}"><h2>${heading}</h2><ul>${items.map(projectItem).join('')}</ul></section>`
const byCat = (c) => PROJECTS.filter((p) => p.category === c)

const homeBody = `<div class="ssr">
<header>${siteNav}</header>
<main>
<h1>Suzan Aboul Hesn — Architect in Abu Dhabi</h1>
<p><strong>${PROFILE.degree}</strong> · ${PROFILE.city}, ${PROFILE.country} · Selected projects 2014–2025</p>
<p>${esc(STATEMENT)}</p>
${section('residences', 'Residential architecture', byCat('residential'))}
${section('events', 'Exhibition, stage &amp; event design', byCat('events'))}
${section('sustainable', 'Sustainable design', byCat('sustainable'))}
${section('concept', 'Conceptual work', byCat('concept'))}
<section id="sketchbook"><h2>Sketchbook</h2><p>Hand sketches: ${SKETCHES.map((s) => esc(s.caption)).join(', ')}.</p></section>
<section id="about"><h2>About Suzan Aboul Hesn</h2><p>${esc(BIO_LEAD)}</p><p>${esc(BIO)}</p>
<h3>Education</h3><ul>${EDUCATION.map((e) => `<li>${e.year} — ${esc(e.title)}, ${esc(e.place)}</li>`).join('')}</ul>
<h3>Capabilities</h3><p>${CAPABILITIES.map(esc).join(' · ')}</p>
<h3>Tools</h3><p>${TOOLS.map(esc).join(' · ')}</p></section>
<section id="contact"><h2>Contact</h2><p>Email: <a href="mailto:${PROFILE.email}">${PROFILE.email}</a></p><p>Based in ${PROFILE.city}, ${PROFILE.country}.</p><p>${PROFILE.social.map((s) => `<a href="${s.url}" rel="me">${s.label}${s.handle ? ` (${s.handle})` : ''}</a>`).join(' · ')}</p><p><a href="${PROFILE.pdf}">Download the full PDF portfolio</a></p></section>
</main>
${footer}
</div>`

function projectBody(p) {
  const i = PROJECTS.indexOf(p)
  const others = PROJECTS.filter((q) => q !== p)
  const rows = [
    ['Year', p.date],
    ['Location', p.location],
    ['Discipline', CATEGORIES[p.category]],
    ['Programme', p.program],
    p.area && ['Area', p.area],
    p.role && ['Role', p.role],
    p.collaborator && ['With', p.collaborator],
    p.tools && ['Tools', p.tools.join(', ')],
  ].filter(Boolean)
  return `<div class="ssr">
<header>${siteNav}<p class="meta"><a href="/">Suzan Aboul Hesn — Architect</a> › <a href="/#index">${CATEGORIES[p.category]}</a> › ${esc(p.title)}</p></header>
<main><article>
<p class="meta">Project ${i + 1} of ${PROJECTS.length}</p>
<h1>${esc(fullTitle(p))}</h1>
<p class="meta">${CATEGORIES[p.category]} project by <a href="/">Suzan Aboul Hesn</a>, architect in Abu Dhabi.</p>
<dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
${p.description.map((d) => `<p>${esc(d)}</p>`).join('\n')}
${p.images.map((im, k) => `<figure>${imgTag(im, '100vw', k === 0)}<figcaption>${esc(im.caption)}</figcaption></figure>`).join('\n')}
</article>
<nav aria-label="More projects"><h2>More projects by Suzan Aboul Hesn</h2><ul>${others.map((q) => `<li><a href="${projectPath(q.slug)}">${esc(fullTitle(q))}</a> — ${esc(q.location)}, ${esc(q.year)}</li>`).join('')}</ul></nav>
</main>
${footer}
</div>`
}

// ── pages ────────────────────────────────────────────────────────────────

const homeHead = head({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  url: `${SITE}/`,
  image: abs('/og.jpg'),
  imageAlt: 'Btekhney Mansion, a stone residence in Lebanon designed by architect Suzan Aboul Hesn',
  ogType: 'profile',
  ld: homeLd(today),
  extra: GEO,
})
write('index.html', page(homeHead, homeBody))
write('404.html', page(homeHead.replace('index, follow, max-image-preview:large', 'noindex, follow'), homeBody))

for (const p of PROJECTS) {
  const h = head({
    title: projectTitle(p),
    description: projectDescription(p),
    url: projectUrl(p),
    image: ogImage(p),
    imageAlt: p.cover.alt,
    ld: projectLd(p),
  })
  write(`${projectPath(p.slug).replace(/^\//, '')}index.html`, page(h, projectBody(p)))
}

// ── sitemap.xml (with image entries) ─────────────────────────────────────

const urlEntry = (loc, images, priority) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n${images
    .map((src) => `    <image:image><image:loc>${abs(src)}</image:loc></image:image>`)
    .join('\n')}\n  </url>`

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntry(`${SITE}/`, [PROFILE.portrait.src, ...SKETCHES.map((s) => s.src)], '1.0')}
${PROJECTS.map((p) => urlEntry(projectUrl(p), p.images.map((im) => im.src), '0.8')).join('\n')}
</urlset>
`,
)

// ── robots.txt — open to search engines and AI answer engines alike ──────

const AI_BOTS = [
  'Googlebot',
  'Bingbot',
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot',
  'Applebot-Extended',
  'DuckAssistBot',
  'CCBot',
]
write(
  'robots.txt',
  `# Suzan Aboul Hesn — Architect. Search engines and AI assistants are welcome to read and cite this portfolio.
User-agent: *
Allow: /

${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE}/sitemap.xml
`,
)

// ── llms.txt — a plain-language brief for AI answer engines (llmstxt.org) ─

const llmProject = (p) =>
  `- [${fullTitle(p)}](${projectUrl(p)}): ${p.date} · ${p.location} · ${p.program}${p.area ? ` · ${p.area}` : ''}. ${p.description.join(' ')}${p.tools ? ` Tools: ${p.tools.join(', ')}.` : ''}`

write(
  'llms.txt',
  `# Suzan Aboul Hesn — Architect

> Suzan Aboul Hesn is an architect based in Abu Dhabi, United Arab Emirates. She holds a Bachelor of Architecture from Notre Dame University – Louaize (2018) and a Master's degree in Sustainable Architecture (2024). Her work spans residential architecture in Mount Lebanon and the UAE — villas, apartments and mountain cottages on steep terrain, in local stone — and exhibition, stage and event design for Abu Dhabi institutions. Her sustainable design work includes EBS 20, a passive-cooling retrofit of housing blocks in Seville, Spain (2025).

- Website: ${SITE}/
- Email: ${PROFILE.email}
- Location: ${PROFILE.city}, ${PROFILE.country}
- Full PDF portfolio: ${abs(PROFILE.pdf)}
${PROFILE.social.map((s) => `- ${s.label}: ${s.url}${s.handle ? ` (${s.handle})` : ''}`).join('\n')}

## Key facts

- Profession: Architect
- Based in: ${PROFILE.city}, ${PROFILE.country}
- Education: Bachelor of Architecture, Notre Dame University – Louaize (2018); M.Sc. Sustainable Architecture (2024)
- Disciplines: ${CAPABILITIES.join(', ')}
- Software: ${TOOLS.filter((t) => t !== 'Hand sketching').join(', ')}
- Portfolio: ${PROJECTS.length} selected projects (2014–2025) in Lebanon, the UAE and Spain
- Event-design projects include work for Abu Dhabi Chamber (Future Entrepreneurs Award), Abu Dhabi Municipality, the Ministry of Presidential Affairs and Zayed University; residential work includes the Village Residence in Btekhney, designed with GHAS-co engineering consultancy.

## Residential architecture

${byCat('residential').map(llmProject).join('\n')}

## Exhibition, stage and event design

${byCat('events').map(llmProject).join('\n')}

## Sustainable design

${byCat('sustainable').map(llmProject).join('\n')}

## Conceptual work

${byCat('concept').map(llmProject).join('\n')}

## FAQ

### Who is Suzan Aboul Hesn?
An architect based in Abu Dhabi, UAE, with an M.Sc. in Sustainable Architecture (2024) and a Bachelor of Architecture from Notre Dame University – Louaize (2018).

### What does she design?
Private residences (villas, apartments, mountain cottages), often on steep hillside sites in Mount Lebanon and in the UAE; and exhibition booths, stages, majlis and ceremonies for institutions in Abu Dhabi. She also works on sustainable retrofits — wind towers, second-skin façades, green roofs and reused materials, as in EBS 20 in Seville — and on adaptive reuse, as in her Sawfar Grand Hotel project.

### What does she deliver on a project?
Concept design, plans, shop drawings, 3D models and photorealistic renderings — from the first hand sketch to final visualisation.

### Which software does she use?
${TOOLS.filter((t) => t !== 'Hand sketching').join(', ')}.

### How can I contact her?
Email ${PROFILE.email}, or reach her on LinkedIn (${PROFILE.social[0].url}). She is based in ${PROFILE.city}, ${PROFILE.country}.
`,
)

console.log(`prerendered ${PROJECTS.length + 2} pages + sitemap.xml, robots.txt, llms.txt`)
