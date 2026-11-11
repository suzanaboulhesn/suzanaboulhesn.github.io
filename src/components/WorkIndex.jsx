import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { CATEGORIES, PROJECTS, bySlug } from '../data/projects'
import { useMedia, pad } from '../hooks'
import { EASE, useUI } from '../ui'
import { Eyebrow, Pic, SplitWords } from './primitives'

const FILTERS = [['all', 'All work'], ...Object.entries(CATEGORIES)]
const yearOf = (p) => parseInt(p.year, 10)

export default function WorkIndex() {
  const { openProject } = useUI()
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 })

  const list = useMemo(() => {
    const items = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
    return [...items].sort((a, b) => yearOf(b) - yearOf(a))
  }, [filter])

  const counts = useMemo(() => {
    const c = { all: PROJECTS.length }
    PROJECTS.forEach((p) => (c[p.category] = (c[p.category] || 0) + 1))
    return c
  }, [])

  const hp = hovered ? bySlug[hovered] : null

  return (
    <section className="windex section" id="index">
      <header className="windex__head">
        <Eyebrow n="07">Index</Eyebrow>
        <h2 className="display">
          <SplitWords text="All" /> <em><SplitWords text="projects" delay={0.1} /></em>
        </h2>
        <div className="filters" role="group" aria-label="Filter projects">
          {FILTERS.map(([key, label]) => (
            <button key={key} className={`filter ${filter === key ? 'is-active' : ''}`} onClick={() => setFilter(key)} aria-pressed={filter === key}>
              {filter === key && <motion.span layoutId="filter-pill" className="filter__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="filter__label">{label}</span>
              <sup className="mono">{pad(counts[key])}</sup>
            </button>
          ))}
        </div>
      </header>

      <div className="windex__cols mono" aria-hidden="true">
        <span>No.</span>
        <span>Project</span>
        <span>Discipline</span>
        <span>Location</span>
        <span>Year</span>
      </div>

      <ul
        className="windex__list"
        onPointerMove={(e) => {
          // flip the preview to the left of the pointer near the right edge
          const flip = e.clientX > window.innerWidth * 0.58
          x.set(flip ? e.clientX - 452 : e.clientX)
          y.set(e.clientY)
        }}
        onPointerLeave={() => setHovered(null)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, k) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <button
                className={`wrow ${hovered && hovered !== p.slug ? 'is-dim' : ''}`}
                onClick={() => openProject(p.slug)}
                onPointerEnter={() => fine && setHovered(p.slug)}
                data-cursor="View"
              >
                <span className="wrow__num mono">{pad(k + 1)}</span>
                <span className="wrow__title">
                  {p.title}
                  {p.subtitle && <i> — {p.subtitle}</i>}
                </span>
                <span className="wrow__cat">{CATEGORIES[p.category]}</span>
                <span className="wrow__loc">{p.location}</span>
                <span className="wrow__year mono">{p.year}</span>
                <span className="wrow__thumb" aria-hidden="true">
                  <Pic image={p.cover} sizes="96px" alt="" />
                </span>
                <span className="wrow__arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {fine && (
        <motion.div className="preview" style={{ x: sx, y: sy }} aria-hidden="true">
          <AnimatePresence>
            {hp && (
              <motion.div
                key={hp.slug}
                className="preview__card"
                initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(50% 50% 50% 50%)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Pic image={hp.cover} sizes="380px" alt="" />
                <span className="preview__tag mono">
                  {hp.location} · {hp.year}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
