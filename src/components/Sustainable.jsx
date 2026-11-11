import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { COMMUNITY, STRATEGIES, bySlug } from '../data/projects'
import { pad } from '../hooks'
import { EASE, useUI } from '../ui'
import { Eyebrow, Magnetic, Pic, Reveal, RevealPic, SplitWords } from './primitives'

const P = bySlug['ebs-20-seville']

const FACTS = [
  { n: '0.55', unit: '', label: 'U-value of the insulated wall build-up' },
  { n: '100', unit: 'cm', label: 'Walkable second skin, south & southwest' },
  { n: '40–60', unit: 'cm', label: 'Operable perforated mesh, east & west' },
]

export default function Sustainable() {
  const { openProject, openLightbox } = useUI()
  const [active, setActive] = useState(0)
  const s = STRATEGIES[active]

  return (
    <section className="sustain section" id="sustainable">
      <header className="sustain__head">
        <Eyebrow n="04">Sustainable design · {P.date}</Eyebrow>
        <h2 className="display">
          <SplitWords text="Buildings that" /> <em><SplitWords text="breathe" delay={0.15} /></em>
        </h2>
        <div className="sustain__intro">
          <Reveal as="p" className="mono sustain__kicker">
            EBS 20 — Embracing Breathable Spaces · {P.location}
          </Reveal>
          <Reveal as="p" delay={0.1}>
            A retrofit of existing housing blocks in a Seville neighbourhood: sustainable materials, passive cooling and inclusive
            public space, shaped by the city’s climate and culture.
          </Reveal>
        </div>
      </header>

      <RevealPic image={P.images[1]} sizes="100vw" onClick={() => openLightbox(P.images, 1)} className="sustain__hero" />

      <dl className="sustain__facts">
        {FACTS.map((f, k) => (
          <Reveal key={f.label} className="sustain__fact" delay={k * 0.08}>
            <dt>
              {f.n}
              {f.unit && <small>{f.unit}</small>}
            </dt>
            <dd>{f.label}</dd>
          </Reveal>
        ))}
      </dl>

      <div className="explorer">
        <div className="explorer__stage">
          <div className="explorer__frame">
            <AnimatePresence mode="wait" initial={false}>
              <motion.button
                key={active}
                className={`explorer__img ${s.image.kind === 'drawing' ? 'is-drawing' : ''}`}
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                transition={{ duration: 0.45, ease: EASE }}
                onClick={() => openLightbox(STRATEGIES.map((x) => x.image), active)}
                data-cursor="Zoom"
                aria-label={`Enlarge: ${s.image.caption}`}
              >
                <Pic image={s.image} sizes="(min-width: 900px) 46vw, 100vw" />
              </motion.button>
            </AnimatePresence>
          </div>
          <p className="explorer__cap mono">
            <span>
              {pad(active + 1)} / {pad(STRATEGIES.length)}
            </span>{' '}
            {s.image.caption}
          </p>
        </div>

        <div className="explorer__side">
          <p className="mono explorer__label">Passive strategies — select one</p>
          <ol className="explorer__list">
            {STRATEGIES.map((x, k) => {
              const on = k === active
              return (
                <li key={x.title} className={on ? 'is-active' : ''}>
                  <button onClick={() => setActive(k)} aria-expanded={on}>
                    <span className="mono">{pad(k + 1)}</span>
                    <span className="explorer__title">{x.title}</span>
                    <span className="explorer__plus" aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className="explorer__text"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <p>{x.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="community">
        <div className="community__head">
          <Reveal as="p" className="mono">
            Community programme
          </Reveal>
          <Reveal as="p" className="community__note" delay={0.08}>
            Painted by hand: the low buildings make way for bicycle tracks, water features, open areas, play spaces and green
            roofs.
          </Reveal>
        </div>
        <div className="community__row" data-lenis-prevent-touch>
          {COMMUNITY.map((c, k) => (
            <motion.button
              key={c.key}
              className="vignette"
              onClick={() => openLightbox(COMMUNITY, k)}
              data-cursor="View"
              aria-label={`Enlarge: ${c.caption}`}
              initial={{ opacity: 0, y: 50, rotate: k % 2 ? 8 : -8 }}
              whileInView={{ opacity: 1, y: 0, rotate: k % 2 ? 2 : -2 }}
              whileHover={{ y: -12, rotate: 0, scale: 1.05, transition: { duration: 0.35, ease: EASE } }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: EASE, delay: k * 0.07 }}
            >
              <Pic image={c} sizes="(min-width: 900px) 15vw, 42vw" />
            </motion.button>
          ))}
        </div>
      </div>

      <Reveal className="sustain__cta">
        <Magnetic>
          <button className="btn" onClick={() => openProject(P.slug)} data-cursor="Open">
            Explore EBS 20 <span aria-hidden="true">↗</span>
          </button>
        </Magnetic>
      </Reveal>
    </section>
  )
}
