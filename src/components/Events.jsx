import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { PROJECTS } from '../data/projects'
import { pad } from '../hooks'
import { EASE, useUI } from '../ui'
import { Eyebrow, Pic, Reveal, SplitWords } from './primitives'

const LIST = PROJECTS.filter((p) => p.category === 'events')

export default function Events() {
  const { openProject } = useUI()
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  // The whole page dims to "stage lighting" while this section is centred on screen.
  useEffect(() => {
    document.documentElement.dataset.mode = inView ? 'dark' : 'light'
  }, [inView])

  const spot = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section className="events section" id="events" ref={ref} onPointerMove={spot}>
      <div className="events__spot" aria-hidden="true" />
      <header className="events__head">
        <Eyebrow n="03">Exhibition & Events</Eyebrow>
        <h2 className="display">
          <SplitWords text="Stages built for" /> <em><SplitWords text="the big night" delay={0.2} /></em>
        </h2>
        <Reveal as="p" className="events__intro" delay={0.2}>
          Booths, stages, majlis and ceremonies for Abu Dhabi institutions — designed in AutoCAD and Rhino and brought to life in
          Lumion, 3ds Max and V-Ray. Hover to open the curtains.
        </Reveal>
      </header>

      <div className="panels" role="list">
        {LIST.map((p, k) => {
          const isActive = k === active
          return (
            <div
              key={p.slug}
              role="listitem"
              className={`panel ${isActive ? 'is-active' : ''}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(k)}
            >
              <button
                className="panel__btn"
                onClick={() => (isActive ? openProject(p.slug) : setActive(k))}
                onFocus={(e) => e.currentTarget.matches(':focus-visible') && setActive(k)}
                data-cursor={isActive ? 'Open' : 'Expand'}
                aria-expanded={isActive}
                aria-label={isActive ? `Open ${p.title}` : `Show ${p.title}`}
              >
                <Pic image={p.cover} sizes="(min-width: 900px) 60vw, 100vw" className="panel__img" />
                <span className="panel__shade" />
                <span className="panel__num mono">E—{pad(k + 1)}</span>
                <span className="panel__vtitle">{p.title}</span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="panel__body"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                    >
                      <span className="mono panel__meta">
                        {p.date} · {p.location}
                      </span>
                      <span className="panel__title">{p.title}</span>
                      <span className="panel__sub">
                        {p.subtitle} — {p.short}
                      </span>
                      <span className="panel__cta mono">Open project ↗</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
