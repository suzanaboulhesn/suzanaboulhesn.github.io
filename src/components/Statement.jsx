import { useEffect, useRef } from 'react'
import { animate, motion, useInView } from 'motion/react'
import { Eyebrow, Reveal } from './primitives'
import { PROJECTS, STATEMENT as TEXT } from '../data/projects'
const EMPHASIS = new Set(['ground', 'hillsides,', 'nights.', 'sketch'])

// Words light up once, staggered, when the paragraph enters — no work on every scroll frame.
const WORD = {
  hidden: { opacity: 0.14 },
  shown: (k) => ({ opacity: 1, transition: { duration: 0.5, delay: 0.15 + k * 0.035, ease: 'easeOut' } }),
}

function Word({ children, k }) {
  return (
    <motion.span className={EMPHASIS.has(children) ? 'statement__em' : undefined} variants={WORD} custom={k}>
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
  const words = TEXT.split(' ')
  return (
    <section className="statement section" id="statement">
      <div className="statement__grid">
        <Eyebrow n="01">Approach</Eyebrow>
        <motion.p
          className="statement__text"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '0px 0px -25% 0px' }}
        >
          {words.map((w, k) => (
            <Word key={k} k={k}>
              {w}
            </Word>
          ))}
        </motion.p>
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
