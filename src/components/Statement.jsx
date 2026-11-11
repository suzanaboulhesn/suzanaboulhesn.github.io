import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useScroll, useTransform } from 'motion/react'
import { Eyebrow, Reveal } from './primitives'
import { PROJECTS } from '../data/projects'

const TEXT =
  'I design places that hold their ground — stone houses that step down Lebanese hillsides, and stages built for Abu Dhabi’s biggest nights. Every project starts as a hand sketch and ends as an image you can almost walk into.'
const EMPHASIS = new Set(['ground', 'hillsides,', 'nights.', 'sketch'])

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const em = EMPHASIS.has(children)
  return (
    <motion.span className={em ? 'statement__em' : undefined} style={{ opacity }}>
      {children}{' '}
    </motion.span>
  )
}

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('en')
      },
    })
    return () => c.stop()
  }, [inView, to])
  return (
    <span className="stat__num" aria-label={`${to}${suffix}`}>
      <span ref={ref} aria-hidden="true">
        0
      </span>
      {suffix && <small aria-hidden="true">{suffix}</small>}
    </span>
  )
}

const STATS = [
  { to: PROJECTS.length, label: 'Selected projects, 2014 — 2025' },
  { to: 850, suffix: 'm²', label: 'Largest residence — the Village Residence' },
  { to: 20, suffix: 'm', label: 'Level difference resolved on a single hillside site' },
  { to: PROJECTS.filter((p) => p.category === 'events').length, label: 'Exhibition & event commissions in the UAE' },
]

export default function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = TEXT.split(' ')
  return (
    <section className="statement section" id="statement">
      <div className="statement__grid">
        <Eyebrow n="01">Approach</Eyebrow>
        <p className="statement__text" ref={ref}>
          {words.map((w, k) => (
            <Word key={k} progress={scrollYProgress} range={[k / words.length, (k + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
      <div className="stats">
        {STATS.map((s, k) => (
          <Reveal className="stat" key={s.label} delay={k * 0.08}>
            <Counter to={s.to} suffix={s.suffix} />
            <p className="stat__label">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
