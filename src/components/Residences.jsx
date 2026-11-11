import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { PROJECTS } from '../data/projects'
import { useMedia, pad } from '../hooks'
import { useUI } from '../ui'
import { Eyebrow, Pic, SplitWords } from './primitives'

const LIST = PROJECTS.filter((p) => p.category === 'residential')

function Card({ p, k, progress, horizontal }) {
  const { openProject } = useUI()
  // inner parallax: image drifts against the track direction
  const imgX = useTransform(progress, [0, 1], horizontal ? ['4%', '-12%'] : ['0%', '0%'])
  return (
    <article className={`rcard ${k % 2 ? 'is-tall' : 'is-wide'}`}>
      <button className="rcard__btn" onClick={() => openProject(p.slug)} data-cursor="View" aria-label={`Open ${p.title}`}>
        <div className="rcard__media">
          <motion.div className="rcard__img" style={{ x: imgX }}>
            <Pic image={p.cover} sizes="(min-width: 900px) 50vw, 85vw" />
          </motion.div>
          <span className="rcard__badge mono">R—{pad(k + 1)}</span>
        </div>
        <div className="rcard__meta">
          <h3 className="rcard__title">{p.title}</h3>
          <p className="rcard__sub mono">
            {p.location} · {p.year}
          </p>
          <p className="rcard__short">{p.short}</p>
        </div>
      </button>
    </article>
  )
}

export default function Residences() {
  const horizontal = useMedia('(min-width: 900px)')
  const section = useRef(null)
  const track = useRef(null)
  const dist = useRef(0)
  const [height, setHeight] = useState(null)
  const counter = useRef(null)

  useLayoutEffect(() => {
    if (!horizontal) {
      setHeight(null)
      return
    }
    const measure = () => {
      const t = track.current
      if (!t) return
      dist.current = Math.max(0, t.scrollWidth - window.innerWidth)
      setHeight(dist.current + window.innerHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [horizontal])

  const isH = useRef(horizontal)
  isH.current = horizontal
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => (isH.current ? -v * dist.current : 0))

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!counter.current) return
    const idx = Math.min(LIST.length, Math.max(1, Math.ceil(v * LIST.length)))
    counter.current.textContent = pad(idx)
  })

  return (
    <section
      className={`resi ${horizontal ? 'is-horizontal' : ''}`}
      id="residences"
      ref={section}
      style={horizontal && height ? { height } : undefined}
    >
      <div className="resi__sticky">
        <header className="resi__head">
          <Eyebrow n="02">Residential</Eyebrow>
          <h2 className="display">
            <SplitWords text="Homes shaped by" /> <em><SplitWords text="slope, stone" delay={0.18} /></em>{' '}
            <SplitWords text="& light" delay={0.3} />
          </h2>
          <p className="resi__count mono" aria-hidden="true">
            <span ref={counter}>01</span> / {pad(LIST.length)}
          </p>
        </header>

        <motion.div className="resi__track" ref={track} style={{ x }}>
          {LIST.map((p, k) => (
            <Card key={p.slug} p={p} k={k} progress={scrollYProgress} horizontal={horizontal} />
          ))}
          <div className="resi__end">
            <p className="mono">Seven homes · Lebanon & UAE</p>
            <p className="resi__end-big">
              Next — <em>exhibitions & events</em>
            </p>
          </div>
        </motion.div>

        {horizontal && (
          <div className="resi__progress" aria-hidden="true">
            <motion.i style={{ scaleX: scrollYProgress }} />
          </div>
        )}
      </div>
    </section>
  )
}
