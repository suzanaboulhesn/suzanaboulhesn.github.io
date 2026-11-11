import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { CATEGORIES, PROJECTS, indexOf } from '../data/projects'
import { pad } from '../hooks'
import { EASE, EASE_IO, useUI } from '../ui'
import { Pic } from './primitives'

function Meta({ project: p }) {
  const rows = [
    ['Year', p.date],
    ['Location', p.location],
    ['Discipline', CATEGORIES[p.category]],
    ['Programme', p.program],
    p.area && ['Area', p.area],
    p.role && ['Role', p.role],
    p.collaborator && ['With', p.collaborator],
    p.tools && ['Tools', p.tools.join(' · ')],
  ].filter(Boolean)
  return (
    <dl className="meta">
      {rows.map(([k, v], i) => (
        <motion.div
          key={k}
          className="meta__row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.05 }}
        >
          <dt className="mono">{k}</dt>
          <dd>{v}</dd>
        </motion.div>
      ))}
    </dl>
  )
}

function Body({ project: p, scroller }) {
  const { openProject, openLightbox } = useUI()
  const hero = useRef(null)
  const idx = indexOf(p.slug)
  const next = PROJECTS[(idx + 1) % PROJECTS.length]
  const { scrollYProgress } = useScroll({ container: scroller, target: hero, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const gallery = p.images.slice(1)

  return (
    <motion.article
      className="sheet__article"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="sheet__hero" ref={hero}>
        <button className="sheet__hero-btn" onClick={() => openLightbox(p.images, 0)} data-cursor="Zoom" aria-label={`Enlarge: ${p.cover.caption}`}>
          <motion.div
            className="sheet__hero-img"
            style={{ y: heroY, scale: heroScale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <Pic image={p.images[0]} sizes="100vw" eager />
          </motion.div>
        </button>
        <div className="sheet__hero-shade" />
        <div className="sheet__titles">
          <motion.p
            className="mono"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {pad(idx + 1)} / {pad(PROJECTS.length)} — {CATEGORIES[p.category]}
          </motion.p>
          <h1 className="sheet__title">
            <span className="split__mask">
              <motion.span
                className="split__char"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
              >
                {p.title}
              </motion.span>
            </span>
            {p.subtitle && (
              <span className="split__mask sheet__subtitle">
                <motion.em
                  className="split__char"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.62 }}
                >
                  {p.subtitle}
                </motion.em>
              </span>
            )}
          </h1>
        </div>
      </header>

      <div className="sheet__intro">
        <Meta project={p} />
        <div className="sheet__desc">
          {p.description.map((para, i) => (
            <motion.p
              key={i}
              className={i === 0 ? 'is-lead' : ''}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.6 + i * 0.08 }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="sheet__gallery">
          {gallery.map((im, i) => (
            <motion.figure
              key={im.key}
              className={`gimg ${im.kind === 'drawing' ? 'is-drawing' : ''}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: scroller, once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, ease: EASE, delay: (i % 2) * 0.08 }}
            >
              <button onClick={() => openLightbox(p.images, i + 1)} data-cursor="Zoom" aria-label={`Enlarge: ${im.caption}`}>
                <Pic image={im} sizes="(min-width: 900px) 46vw, 100vw" />
              </button>
              <figcaption className="mono">
                <span>{pad(i + 2)}</span> {im.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      )}

      <button className="sheet__next" onClick={() => openProject(next.slug)} data-cursor="Next">
        <span className="sheet__next-img">
          <Pic image={next.cover} sizes="100vw" alt="" />
        </span>
        <span className="sheet__next-shade" />
        <span className="sheet__next-text">
          <span className="mono">Next project</span>
          <span className="sheet__next-title">
            {next.title} <span aria-hidden="true">→</span>
          </span>
        </span>
      </button>
    </motion.article>
  )
}

export default function ProjectSheet({ project }) {
  const { closeProject, lightboxOpen } = useUI()
  const scroller = useRef(null)
  const closeBtn = useRef(null)
  const lbRef = useRef(lightboxOpen)
  lbRef.current = lightboxOpen

  // Remember what had focus, move focus into the dialog, restore on close.
  useEffect(() => {
    const prev = document.activeElement
    closeBtn.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape' && !lbRef.current) closeProject()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.({ preventScroll: true })
    }
  }, [closeProject])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [project.slug])

  return (
    <motion.div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ transform: 'translateY(100%)' }}
      animate={{ transform: 'translateY(0%)' }}
      exit={{ transform: 'translateY(100%)' }}
      transition={{ duration: 0.8, ease: EASE_IO }}
    >
      <div className="sheet__bar">
        <button ref={closeBtn} className="sheet__close" onClick={closeProject} data-cursor="Close">
          <span>Close</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>
      <div className="sheet__scroll" ref={scroller} data-lenis-prevent>
        <AnimatePresence mode="wait">
          <Body key={project.slug} project={project} scroller={scroller} />
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
