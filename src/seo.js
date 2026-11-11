// Search & AI-engine metadata shared by the app (client-side head updates)
// and scripts/prerender.mjs (static HTML, sitemap, llms.txt).
import { BIO, BIO_LEAD, CAPABILITIES, CATEGORIES, EDUCATION, PROFILE, PROJECTS, TOOLS, projectPath } from './data/projects.js'

export const SITE = 'https://suzanaboulhesn.github.io'
export const abs = (path) => SITE + path

export const HOME_TITLE = 'Suzan Aboul Hesn — Architect in Abu Dhabi | Residential & Event Design'
export const HOME_DESCRIPTION =
  'Architect in Abu Dhabi (M.Sc. Sustainable Architecture). Villas and homes in Lebanon and the UAE, plus exhibition, stage and event design. Portfolio 2014–2025.'

export const KEYWORDS = [
  'Suzan Aboul Hesn',
  'architect Abu Dhabi',
  'architect UAE',
  'architect Lebanon',
  'residential architect',
  'villa design',
  'exhibition booth design Abu Dhabi',
  'stage design',
  'event design UAE',
  'sustainable architecture',
  'sustainable retrofit',
  'passive cooling design',
  'architectural visualisation',
  'adaptive reuse',
]

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

/** "June 2020" → "2020-06", "2019" → "2019", "June 2023 – June 2024" → "2023-06" */
export function isoDate(text) {
  const m = text.match(/([A-Za-z]+)\s+(\d{4})/)
  if (m && MONTHS.includes(m[1].toLowerCase())) return `${m[2]}-${String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0')}`
  return (text.match(/\d{4}/) || [''])[0]
}

export const countryCode = (location) =>
  /UAE|Emirates|Dubai|Abu Dhabi/.test(location) ? 'AE' : /Lebanon/.test(location) ? 'LB' : /Spain/.test(location) ? 'ES' : undefined

export const projectTitle = (p) => `${p.title}${p.subtitle ? ` — ${p.subtitle}` : ''} | Suzan Aboul Hesn, Architect`

export const projectDescription = (p) =>
  `${p.short} ${p.program}${p.area && !p.short.includes(p.area) ? ` (${p.area})` : ''} in ${p.location}, ${p.date}. ${CATEGORIES[p.category]} project by architect Suzan Aboul Hesn.`

export const projectUrl = (p) => abs(projectPath(p.slug))
export const ogImage = (p) => abs(`/og/${p.slug}.jpg`)

const PERSON_ID = `${SITE}/#suzan`
const WEBSITE_ID = `${SITE}/#website`

export function personLd() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PROFILE.name,
    givenName: PROFILE.first,
    familyName: PROFILE.last,
    jobTitle: 'Architect',
    description: `${BIO_LEAD} ${BIO}`,
    url: `${SITE}/`,
    image: abs(PROFILE.portrait.src),
    email: `mailto:${PROFILE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: PROFILE.city, addressCountry: 'AE' },
    workLocation: { '@type': 'Place', name: `${PROFILE.city}, ${PROFILE.country}` },
    alumniOf: { '@type': 'CollegeOrUniversity', name: PROFILE.university, sameAs: 'https://www.ndu.edu.lb' },
    hasCredential: EDUCATION.map((e) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: e.title,
      dateCreated: e.year,
      ...(e.place === PROFILE.university ? { recognizedBy: { '@type': 'CollegeOrUniversity', name: PROFILE.university } } : {}),
    })),
    knowsAbout: [
      'Architecture',
      'Residential architecture',
      'Villa design',
      'Exhibition design',
      'Stage design',
      'Event design',
      'Sustainable retrofit',
      'Passive cooling and natural ventilation',
      ...CAPABILITIES,
      ...TOOLS.filter((t) => t !== 'Hand sketching'),
    ],
    sameAs: PROFILE.sameAs,
  }
}

const websiteLd = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: 'Suzan Aboul Hesn — Architect',
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
})

export function homeLd(modified) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personLd(),
      websiteLd(),
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: `${SITE}/`,
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
        dateModified: modified,
        primaryImageOfPage: abs('/og.jpg'),
      },
      {
        '@type': 'ItemList',
        name: 'Selected projects by Suzan Aboul Hesn',
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: projectUrl(p), name: p.title })),
      },
    ],
  }
}

export function projectLd(p) {
  const url = projectUrl(p)
  const cc = countryCode(p.location)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#project`,
        name: p.subtitle ? `${p.title} — ${p.subtitle}` : p.title,
        headline: p.title,
        description: p.description.join(' '),
        url,
        genre: CATEGORIES[p.category],
        about: p.program,
        dateCreated: isoDate(p.date),
        locationCreated: { '@type': 'Place', name: p.location, ...(cc ? { address: { '@type': 'PostalAddress', addressCountry: cc } } : {}) },
        creator: { '@id': PERSON_ID, '@type': 'Person', name: PROFILE.name },
        ...(p.collaborator ? { contributor: { '@type': 'Organization', name: p.collaborator.replace(/ engineering consultancy$/i, '') } } : {}),
        image: p.images.map((im) => ({ '@type': 'ImageObject', contentUrl: abs(im.src), caption: im.alt, width: im.w, height: im.h })),
        keywords: [p.title, CATEGORIES[p.category], p.program, p.location, 'architecture', ...(p.tools || [])].join(', '),
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Suzan Aboul Hesn — Architect', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: CATEGORIES[p.category], item: `${SITE}/#index` },
          { '@type': 'ListItem', position: 3, name: p.title, item: url },
        ],
      },
    ],
  }
}

/** Client-side: keep <title>, description and canonical in sync with the open project. */
export function applyHead(p) {
  if (typeof document === 'undefined') return
  document.title = p ? projectTitle(p) : HOME_TITLE
  const set = (sel, attr, val) => document.head.querySelector(sel)?.setAttribute(attr, val)
  set('meta[name="description"]', 'content', p ? projectDescription(p) : HOME_DESCRIPTION)
  set('link[rel="canonical"]', 'href', p ? projectUrl(p) : `${SITE}/`)
}
