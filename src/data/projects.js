import manifest from './manifest.json'

const BASE = import.meta.env.BASE_URL

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
  pdf: `${BASE}Suzan-Aboul-Hesn-Portfolio.pdf`,
  portrait: img('about/portrait', 'Suzan Aboul Hesn'),
}

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

export const HERO_SLIDES = [
  { slug: 'stone-cottages', image: img('cottages/1'), label: 'Stone Cottages', place: 'Lebanon' },
  { slug: 'btekhney-mansion', image: img('mansion/1'), label: 'Btekhney Mansion', place: 'Lebanon' },
  { slug: 'modern-villa', image: img('villa/2'), label: 'Modern Villa', place: 'Lebanon' },
  { slug: 'bab-al-qaser', image: img('bab-al-qaser/1'), label: 'Bab Al Qaser', place: 'Abu Dhabi' },
  { slug: 'village-residence', image: img('village-residence/1'), label: 'Village Residence', place: 'Mount Lebanon' },
]

export const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]))
export const indexOf = (slug) => PROJECTS.findIndex((p) => p.slug === slug)
