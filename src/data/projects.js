import manifest from './manifest.js'

// Vite injects BASE_URL; the build-time prerender script runs this file in plain Node.
const BASE = (typeof import.meta.env !== 'undefined' && import.meta.env.BASE_URL) || '/'

/** Build an image record from an extracted key, e.g. "villa/1". */
export function img(key, caption = '', kind = 'render') {
  const m = manifest[key]
  if (!m) throw new Error(`Unknown image ${key}`)
  const smW = Math.min(960, m.w)
  return {
    key,
    src: `${BASE}work/${key}.webp`,
    sm: `${BASE}work/${key}-sm.webp`,
    w: m.w,
    h: m.h,
    smW,
    smH: Math.round((m.h * smW) / m.w),
    caption,
    kind, // 'render' | 'drawing'
  }
}

export const srcSet = (i) => `${i.sm} ${i.smW}w, ${i.src} ${i.w}w`

export const CATEGORIES = {
  residential: 'Residential',
  events: 'Exhibition & Events',
  sustainable: 'Sustainable Design',
  concept: 'Conceptual',
}

export const PROFILE = {
  name: 'Suzan Aboul Hesn',
  first: 'Suzan',
  last: 'Aboul Hesn',
  title: 'Architect',
  degree: 'M.Sc. Sustainable Architecture',
  email: 'sgaboulhesn@outlook.com',
  city: 'Abu Dhabi',
  timeZone: 'Asia/Dubai',
  country: 'United Arab Emirates',
  university: 'Notre Dame University – Louaize',
  pdf: `${BASE}Suzan-Aboul-Hesn-Portfolio.pdf`,
  portrait: { ...img('about/portrait', 'Suzan Aboul Hesn'), alt: 'Portrait of Suzan Aboul Hesn, architect in Abu Dhabi' },
  // Public profiles — shown in Contact/footer and fed to the structured data (sameAs).
  social: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/suzan-aboul-hesn-71117a446' },
    { label: 'Instagram', handle: '@suzan_green_designs', url: 'https://www.instagram.com/suzan_green_designs' },
    { label: 'GitHub', url: 'https://github.com/suzanaboulhesn' },
  ],
}
PROFILE.sameAs = PROFILE.social.map((s) => s.url)

export const STATEMENT =
  'I design places that hold their ground — stone houses that step down Lebanese hillsides, and stages built for Abu Dhabi’s biggest nights. Every project starts as a hand sketch and ends as an image you can almost walk into.'

export const BIO_LEAD =
  'I’m an architect based in Abu Dhabi, working between the stone villages of Mount Lebanon and the exhibition halls of the UAE.'

export const BIO =
  'My residential work — villas, apartments and mountain cottages — is shaped by steep terrain and local stone. Alongside it, I design booths, stages and ceremonies for Abu Dhabi institutions, and passive, low-carbon retrofits such as EBS 20 in Seville. I take each project from the first hand sketch through plans and shop drawings to photoreal visualisation, and in 2024 I completed a Master’s in Sustainable Architecture.'

export const TOOLS = ['AutoCAD', 'Rhinoceros', '3ds Max', 'V-Ray', 'Lumion', 'Adobe Photoshop', 'Hand sketching']

export const CAPABILITIES = [
  'Concept design',
  'Plans & shop drawings',
  '3D modelling',
  'Photoreal visualisation',
  'Exhibition & stage design',
  'Adaptive reuse',
  'Sustainable design',
]

export const EDUCATION = [
  { year: '2024', title: 'M.Sc. Sustainable Architecture', place: 'Master’s degree' },
  { year: '2018', title: 'Bachelor of Architecture', place: 'Notre Dame University – Louaize' },
]

const D = 'drawing'

export const PROJECTS = [
  // ───────────────────────── Residential
  {
    slug: 'modern-villa',
    title: 'Modern Villa',
    category: 'residential',
    year: '2024',
    date: 'December 2024',
    location: 'Lebanon',
    program: 'Private family villa',
    short: 'Interlocking volumes, timber louvres and a cantilevered terrace.',
    description: [
      'A two-storey family villa composed as a set of interlocking volumes: a pale stone-clad mass, a cantilevered box that frames the upper terrace, and warm timber louvres that filter light into the living spaces.',
      'The car port tucks beneath the overhang so the street elevation stays calm and sculptural, while full-height glazing opens the upper floor to the garden.',
    ],
    cover: img('villa/1', 'Front elevation'),
    images: [img('villa/1', 'Front elevation'), img('villa/2', 'Corner view — cantilevered terrace')],
  },
  {
    slug: 'stone-cottages',
    title: 'Stone Cottages',
    category: 'residential',
    year: '2023 — 24',
    date: 'June 2023 – June 2024',
    location: 'Lebanon',
    program: 'Mountain cottages',
    short: 'A cluster of stone and timber cottages set among the pines.',
    description: [
      'A cluster of single-storey mountain cottages set among pines. Each one is built in rough-cut local stone under a terracotta hip roof, with a timber-lined porch, a brick chimney and planted terraces that step down with the land.',
      'The cottages are arranged around shared lawns and a sun deck so each keeps its privacy while the group reads as a small village.',
    ],
    cover: img('cottages/1', 'Cottage with timber porch'),
    images: [
      img('cottages/1', 'Cottage with timber porch'),
      img('cottages/2', 'Two cottages on the slope'),
      img('cottages/3', 'Shared lawn and sun deck'),
    ],
  },
  {
    slug: 'btekhney-mansion',
    title: 'Btekhney Mansion',
    category: 'residential',
    year: '2023',
    date: 'June 2023',
    location: 'Btekhney, Lebanon',
    program: 'Private residence',
    short: 'A contemporary reading of the Lebanese stone house.',
    description: [
      'A multi-level stone mansion that reinterprets the traditional Lebanese house: a pointed-arch entrance, triple arcades, carved balustrades and a timber oriel window, crowned by a red-tile roof with a glazed lantern.',
      'The house descends its hillside through stepped terraces and an external stair, so every level opens onto the landscape.',
    ],
    cover: img('mansion/1', 'Entrance elevation'),
    images: [
      img('mansion/1', 'Entrance elevation'),
      img('mansion/2', 'Pointed-arch entrance'),
      img('mansion/3', 'Arcaded façade'),
      img('mansion/4', 'Hillside view'),
      img('mansion/5', 'Roof lantern and terraces'),
    ],
  },
  {
    slug: 'dubai-hills-villa',
    title: 'Dubai Hills Villa',
    category: 'residential',
    year: '2020',
    date: 'June 2020',
    location: 'Dubai Hills, UAE',
    area: '500 m²',
    program: '5-bedroom villa',
    short: 'A 500 m² family home for a couple starting a new family.',
    tools: ['AutoCAD', '3ds Max', 'V-Ray', 'Rhinoceros', 'Adobe Photoshop'],
    description: [
      'Part of the Dubai Hills development, this 500 m², five-bedroom villa was designed for a new couple starting a family.',
      'A symmetrical, classically proportioned façade with arched windows and a central balcony fronts a plan that keeps family living on the ground floor (300 m²) and private bedroom suites above (260 m²).',
    ],
    cover: img('dubai-hills/1', 'Front elevation render'),
    images: [
      img('dubai-hills/1', 'Front elevation render'),
      img('dubai-hills/2', 'Elevation drawing', D),
      img('dubai-hills/3', '3D cut-plan', D),
      img('dubai-hills/4', 'Ground floor — 300 m²', D),
      img('dubai-hills/5', 'First floor — 260 m²', D),
    ],
  },
  {
    slug: 'village-residence',
    title: 'Village Residence',
    category: 'residential',
    year: '2019',
    date: 'May 2019',
    location: 'Btekhney, Mount Lebanon',
    area: '850 m²',
    program: '7-bedroom villa',
    role: 'Conceptual design, plans & rendered images',
    collaborator: 'GHAS-co engineering consultancy',
    short: 'An 850 m² villa woven into a 20-metre slope.',
    description: [
      'The Village Residence is an 850 m², seven-bedroom villa in Btekhney, Mount Lebanon. It had to be integrated into a steep slope with a 20-metre level difference, which was the project’s great challenge.',
      'Working with GHAS-co engineering consultancy, my roles included the conceptual design, plans and rendered images.',
    ],
    cover: img('village-residence/1', 'Garden elevation'),
    images: [
      img('village-residence/1', 'Garden elevation'),
      img('village-residence/2', 'Arched lower ground and pool'),
      img('village-residence/3', 'Entrance court'),
      img('village-residence/4', 'Elevation', D),
      img('village-residence/5', 'Elevation', D),
      img('village-residence/6', 'Section through the slope', D),
    ],
  },
  {
    slug: 'chbeniyeh-apartments',
    title: 'Chbeniyeh Apartments',
    category: 'residential',
    year: '2019',
    date: '2019',
    location: 'Chbanieh, Mount Lebanon',
    program: 'Apartment building',
    short: 'From shop drawings to the final rendered image.',
    tools: ['AutoCAD', 'Rhinoceros', '3ds Max', 'V-Ray', 'Adobe Photoshop'],
    description: [
      'A residential apartment building in Chbanieh, Mount Lebanon.',
      'Shop drawings were produced in AutoCAD 2D. The massing was modelled in Rhinoceros, rendered in 3ds Max with V-Ray, and finished in Photoshop with greenery and human figures.',
    ],
    cover: img('chbeniyeh/1', 'Street elevation at dusk'),
    images: [
      img('chbeniyeh/1', 'Street elevation at dusk'),
      img('chbeniyeh/2', 'Aerial view'),
      img('chbeniyeh/3', 'Cut plan view — 3ds Max & Photoshop'),
      img('chbeniyeh/4', 'Elevation 1', D),
      img('chbeniyeh/5', 'Elevation 2', D),
    ],
  },
  {
    slug: 'btekhney-hills-villa',
    title: 'Btekhney Hills Villa',
    category: 'residential',
    year: '2019',
    date: 'June 2019',
    location: 'Btekhney, Lebanon',
    program: 'Hillside villa',
    short: 'Terraces on a steep slope, without high garden walls.',
    description: [
      'Sections show the steep slope — the great challenge of this project, where high garden walls were not to be accepted. The house and its outbuildings instead step down the hill as a series of terraces.',
      'The renderings have a cartoonish, collage-like character that was chosen by the client.',
    ],
    cover: img('btekhney-hills/1', 'Villa and pergola'),
    images: [
      img('btekhney-hills/1', 'Villa and pergola'),
      img('btekhney-hills/2', 'Aerial view down the slope'),
      img('btekhney-hills/3', 'Site section', D),
      img('btekhney-hills/4', 'Site section', D),
    ],
  },

  // ───────────────────────── Exhibition & events
  {
    slug: 'abu-dhabi-chamber',
    title: 'Abu Dhabi Chamber',
    subtitle: 'Future Entrepreneurs Award',
    category: 'events',
    year: '2020',
    date: 'June 2020',
    location: 'Abu Dhabi, UAE',
    program: 'Stage, booths & kiosks',
    short: 'Stages, kiosks and booths for the Future Entrepreneurs Award.',
    tools: ['AutoCAD', 'Lumion', 'Rhinoceros', 'Adobe Photoshop'],
    description: [
      'Abu Dhabi Chamber organises the Future Entrepreneurs Award — a platform that embraces and encourages the innovative projects and creative ideas of the next generation of young entrepreneurs in the UAE.',
      'The commission covered the full event family: the main stage, kiosks, reception counters and exhibition booths.',
    ],
    cover: img('ad-chamber/1', 'Exhibition booth'),
    images: [
      img('ad-chamber/1', 'Exhibition booth'),
      img('ad-chamber/2', 'Main stage'),
      img('ad-chamber/3', 'Stage — screens and lighting'),
      img('ad-chamber/4', 'Stage and audience'),
      img('ad-chamber/5', 'Reception counter'),
      img('ad-chamber/6', 'Photo backdrop'),
      img('ad-chamber/7', 'Booth — perspective'),
      img('ad-chamber/8', 'Booth — aerial'),
      img('ad-chamber/9', 'Line drawings', D),
    ],
  },
  {
    slug: 'abu-dhabi-municipality',
    title: 'Abu Dhabi Municipality',
    subtitle: 'Exhibition booths',
    category: 'events',
    year: '2020',
    date: 'June 2020',
    location: 'Abu Dhabi, UAE',
    program: 'Modular booths',
    short: 'A family of booths in different sizes, broken into a kit of parts.',
    tools: ['AutoCAD', 'Lumion', 'Rhinoceros', 'Adobe Photoshop'],
    description: [
      'Booths of different sizes designed to be used by Abu Dhabi Municipality: a suspended canopy, timber-clad media walls and a geometric screen that can be rebuilt at different scales.',
      'Exploded axonometrics break each booth down into its kit of parts.',
    ],
    cover: img('adm-booths/1', 'Main booth'),
    images: [
      img('adm-booths/1', 'Main booth'),
      img('adm-booths/2', 'Booth with geometric screen'),
      img('adm-booths/3', 'Wide view'),
      img('adm-booths/4', 'Exploded axonometric', D),
    ],
  },
  {
    slug: 'bab-al-qaser',
    title: 'Bab Al Qaser',
    subtitle: 'Event & hospitality design',
    category: 'events',
    year: '2020',
    date: 'June 2020',
    location: 'Abu Dhabi, UAE',
    program: 'Majlis, lounge & dining',
    short: 'Majlis, lounges and lantern-lit dining with arched screens.',
    tools: ['AutoCAD', 'Lumion', 'Rhinoceros', 'Adobe Photoshop'],
    description: [
      'Hospitality and majlis spaces for an event at Bab Al Qaser, layered with pointed-arch lattice screens, warm cove lighting and lantern-lit dining tables.',
      'Planning drawings set out the seating for banquets, lounges and the majlis stage.',
    ],
    cover: img('bab-al-qaser/1', 'Majlis stage'),
    images: [
      img('bab-al-qaser/1', 'Majlis stage'),
      img('bab-al-qaser/2', 'Dining hall'),
      img('bab-al-qaser/5', 'Waterfront dining lounge'),
      img('bab-al-qaser/4', 'Majlis'),
      img('bab-al-qaser/6', 'Seating layouts', D),
    ],
  },
  {
    slug: 'presidential-affairs',
    title: 'Ministry of Presidential Affairs',
    subtitle: 'Martyr’s Day & National Day',
    category: 'events',
    year: '2020',
    date: 'June 2020',
    location: 'Abu Dhabi, UAE',
    program: 'Ceremony & stage',
    short: 'A one-night celebration with stage, branding and video mapping.',
    tools: ['AutoCAD', '3ds Max', 'V-Ray', 'Rhinoceros', 'Adobe Photoshop'],
    description: [
      'A one-night event celebrating Martyr’s Day, coinciding with the 44th National Day of the UAE — with breathtaking effects and a multimedia show.',
      'The design commemorates the courage and sacrifice of the nation’s martyrs and celebrates the national spirit through the branding, decoration and video mapping.',
    ],
    cover: img('presidential/1', 'Ceremony ground'),
    images: [
      img('presidential/1', 'Ceremony ground'),
      img('presidential/2', 'Stage and seating'),
      img('presidential/3', 'Video-mapped façade'),
    ],
  },
  {
    slug: 'zayed-university',
    title: 'Zayed University',
    subtitle: 'Ceremony stage',
    category: 'events',
    year: '2022',
    date: 'April 2022',
    location: 'UAE',
    program: 'Stage design',
    short: 'Angular light-edged frames and gold geometric screens.',
    tools: ['AutoCAD', '3ds Max', 'V-Ray', 'Rhinoceros', 'Adobe Photoshop'],
    description: [
      'A ceremony stage built from angular, light-edged frames carrying three screens, wrapped in gold geometric patterns, with broad stairs and a ramp leading up to the podium.',
    ],
    cover: img('zayed/1', 'Stage'),
    images: [img('zayed/1', 'Stage'), img('zayed/2', 'Stage — option A'), img('zayed/3', 'Stage — option B')],
  },
  {
    slug: 'adm-pavilion',
    title: 'ADM Pavilion',
    subtitle: 'ADM 2021',
    category: 'events',
    year: '2023',
    date: 'April 2023',
    location: 'Abu Dhabi, UAE',
    program: 'Exhibition pavilion',
    short: 'Sweeping perforated ribbons around an illuminated core.',
    description: [
      'An exhibition pavilion defined by sweeping perforated ribbons that arc over the stand, wrapping a white central volume with an illuminated world-map wall, digital kiosks and reception counters.',
    ],
    cover: img('adm-2021/1', 'Pavilion overview'),
    images: [
      img('adm-2021/1', 'Pavilion overview'),
      img('adm-2021/2', 'Aerial view'),
      img('adm-2021/3', 'Entrance'),
      img('adm-2021/4', 'Reception and kiosks'),
      img('adm-2021/5', 'Ribbon canopy'),
    ],
  },

  // ───────────────────────── Sustainable design
  {
    slug: 'ebs-20-seville',
    title: 'EBS 20',
    subtitle: 'Embracing Breathable Spaces',
    category: 'sustainable',
    year: '2025',
    date: '2025',
    location: 'Seville, Spain',
    program: 'Sustainable housing retrofit & public space',
    short: 'Seville housing blocks retrofitted to breathe — wind towers, a second skin, green roofs and a community piazza.',
    description: [
      'A proposal to bring sustainable materials, passive strategies and inclusive spaces into a Seville neighbourhood, responding to the city’s climate and cultural needs.',
      'The existing interior stairs are demolished and their vacated cores become wind towers. Using the stack effect, they draw cooler air from the open ground floor and release warm air through operable, ventilated skylights — reducing reliance on air conditioning. New external stairs are built from local straw panels, and the demolished concrete is reused as aggregate in terrazzo tiles.',
      'A second skin follows the sun path: 100 cm deep walkable winter gardens on horizontal louvres to the south and southwest, 40–60 cm operable perforated aluminium mesh to the east and west, and better-insulated walls to the north. Balconies are removed to cut thermal bridging, and the insulated wall build-up reaches a U-value of 0.55.',
      'Low one- and two-storey buildings make way for kids’ play areas, an open market and sports courts. Green roofs on lightweight timber frames, water features drawn from Andalusian tradition, permeable paving that harvests rainwater for irrigation, cycling tracks and native planting — jacaranda, Prunus cerasifera and Rosa canina — complete a community-first landscape.',
    ],
    cover: img('ebs-20/1', 'Courtyard façade with the new external stairs'),
    images: [
      img('ebs-20/1', 'Courtyard façade with the new external stairs'),
      img('ebs-20/2', 'Open ground floor and shaded market'),
      img('ebs-20/10', 'Wind-tower core and straw-panel stair'),
      img('ebs-20/3', 'Vertical garden façade'),
      img('ebs-20/4', 'Green walls around the courtyard'),
      img('ebs-20/13', 'Piazza — water channel and art wall'),
      img('ebs-20/14', 'Piazza — the new external stair'),
      img('ebs-20/15', 'Piazza — shaded market stalls'),
      img('ebs-20/16', 'Piazza — play area and cycling track'),
      img('ebs-20/11', 'Site axonometric — water feature, kids’ area, market place, sloped areas', D),
      img('ebs-20/12', 'Section A — building type C', D),
      img('ebs-20/5', 'Plans — building types A, B and C', D),
      img('ebs-20/8', 'Design strategies — demolition and massing', D),
      img('ebs-20/7', 'Site analysis — figure ground, heights, sun path, greenery', D),
      img('ebs-20/9', 'Site plan and wall section (U-value 0.55)', D),
      img('ebs-20/6', 'Community programme — hand-painted vignettes', D),
    ],
  },

  // ───────────────────────── Conceptual
  {
    slug: 'sawfar-grand-hotel',
    title: 'Sawfar Grand Hotel',
    subtitle: 'Adaptive reuse',
    category: 'concept',
    year: '2018',
    date: 'February 2018',
    location: 'Sawfar, Mount Lebanon',
    program: 'Filmmaking practice facility',
    short: 'Turning a living phantom into a stage — the visitor becomes a performer.',
    description: [
      'The Sawfar Grand Hotel, once a destination for wealthy Arab travellers, is now a living phantom.',
      'The proposal inserts a filmmaking practice facility into the ruin. My project turns the visitor into a performer: offered a script, they can decide whether to follow it or not.',
      'Lightweight glass volumes on a blue steel frame plug into the old stone walls, while a hand-drawn storyboard choreographs the route through the building.',
    ],
    cover: img('sawfar/1', 'New frame against the old hotel'),
    images: [
      img('sawfar/1', 'New frame against the old hotel'),
      img('sawfar/2', 'Aerial view'),
      img('sawfar/3', 'The corridor — scripted scene'),
      img('sawfar/4', 'Circulation diagram', D),
      img('sawfar/5', 'Ground floor plan', D),
      img('sawfar/6', 'Storyboard', D),
    ],
  },
]

export const SKETCHES = [
  img('sketches/s1', 'The filmmaking hotel', D),
  img('sketches/s2', 'Framed void', D),
  img('sketches/s3', 'Cluster study', D),
  img('sketches/s4', 'Site gesture', D),
  img('sketches/s5', 'Structural rhythm', D),
  img('sketches/s6', 'Stacked volumes', D),
  img('sketches/s7', 'Ramped section', D),
  img('sketches/s8', 'Cladding tolerance detail', D),
  img('sketches/s9', 'Glass screen detail', D),
]

// EBS 20 — the passive strategies, each paired with its diagram from the boards.
export const STRATEGIES = [
  {
    title: 'Wind towers',
    text: 'Old stairwells become natural cooling towers. The stack effect pulls cool air in from the shaded ground floor and lets warm air out through operable, ventilated skylights.',
    image: img('ebs-20/d-wind', 'Wind tower — stack-effect section', D),
  },
  {
    title: 'Second-skin façade',
    text: 'Depth follows the sun: 100 cm walkable winter gardens to the south and southwest, 40–60 cm operable perforated mesh to the east and west, insulation to the north.',
    image: img('ebs-20/d-skin', 'Second skin', D),
  },
  {
    title: 'Straw-panel eco-stairs',
    text: 'New external stairs in local straw panels — light, breathable, affordable and low-carbon — placed outside the wind towers.',
    image: img('ebs-20/14', 'The new external stair'),
  },
  {
    title: 'Reused concrete, insulated walls',
    text: 'Concrete from the demolished stairs becomes terrazzo aggregate. Insulated wall layers (U-value 0.55) and removed balconies cut heat gain and thermal bridging.',
    image: img('ebs-20/d-wall', 'Wall composition', D),
  },
  {
    title: 'Open ground floor',
    text: 'Lifting the ground floor opens a shaded public space for the community and feeds fresh air to the wind towers.',
    image: img('ebs-20/d-ground', 'Open ground floor', D),
  },
  {
    title: 'Green roofs',
    text: 'Lightweight timber structures carry native plants for cooling and food production.',
    image: img('ebs-20/d-roof', 'Green roof', D),
  },
  {
    title: 'Evaporative cooling',
    text: 'Water features and shaded piazzas inspired by the Andalusian tradition cool the air between the blocks.',
    image: img('ebs-20/d-water', 'Water features', D),
  },
  {
    title: 'Permeable paving & native planting',
    text: 'Cycling tracks in permeable stone paving harvest rainwater for irrigation; jacaranda, Prunus cerasifera and Rosa canina give shade.',
    image: img('ebs-20/11', 'Site axonometric', D),
  },
]

export const COMMUNITY = [
  img('ebs-20/c-bike', 'Bicycle tracks', D),
  img('ebs-20/c-water', 'Water features', D),
  img('ebs-20/c-open', 'Open areas', D),
  img('ebs-20/c-kids', 'Kids’ areas', D),
  img('ebs-20/c-roof', 'Green roof', D),
  img('ebs-20/c-sit', 'Sitting green areas', D),
]

export const HERO_SLIDES = [
  { slug: 'stone-cottages', image: img('cottages/1'), label: 'Stone Cottages', place: 'Lebanon' },
  { slug: 'btekhney-mansion', image: img('mansion/1'), label: 'Btekhney Mansion', place: 'Lebanon' },
  { slug: 'modern-villa', image: img('villa/2'), label: 'Modern Villa', place: 'Lebanon' },
  { slug: 'bab-al-qaser', image: img('bab-al-qaser/1'), label: 'Bab Al Qaser', place: 'Abu Dhabi' },
  { slug: 'village-residence', image: img('village-residence/1'), label: 'Village Residence', place: 'Mount Lebanon' },
]

// Descriptive alt text (accessibility + image search): "Dubai Hills Villa — Elevation drawing, Dubai Hills, UAE"
for (const p of PROJECTS) {
  for (const im of [p.cover, ...p.images]) im.alt = `${p.title} — ${im.caption}, ${p.location}`
}
for (const s of SKETCHES) s.alt = `Hand sketch by Suzan Aboul Hesn — ${s.caption}`
for (const s of STRATEGIES) s.image.alt = `EBS 20, Seville — ${s.title}: ${s.image.caption}`
for (const c of COMMUNITY) c.alt = `EBS 20, Seville — hand-painted community vignette: ${c.caption}`

export const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]))
export const indexOf = (slug) => PROJECTS.findIndex((p) => p.slug === slug)
export const projectPath = (slug) => `${BASE}projects/${slug}/`
