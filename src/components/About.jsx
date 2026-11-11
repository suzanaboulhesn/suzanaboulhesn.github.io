import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { CAPABILITIES, EDUCATION, PROFILE, TOOLS } from '../data/projects'
import { wrap } from '../hooks'
import { Eyebrow, Pic, Reveal, SplitWords } from './primitives'

/** Infinite ticker whose speed and direction follow scroll velocity. */
export function Marquee({ items, baseVelocity = -2.2 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    baseX.set(baseX.get() + move)
  })

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee__track" style={{ x }}>
        {[0, 1].map((r) => (
          <div className="marquee__group" key={r}>
            {items.map((t) => (
              <span key={t} className="marquee__item">
                {t}
                <svg viewBox="0 0 20 20" className="marquee__glyph">
                  <path d="M3 18V9.5C3 5.5 6 2.7 10 1.5c4 1.2 7 4 7 8V18" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const archY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <section className="about section" id="about" ref={ref}>
      <div className="about__grid">
        <div className="about__figure">
          <motion.div className="about__arch-line" style={{ y: archY }} aria-hidden="true" />
          <motion.div
            className="about__portrait"
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)' }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div style={{ y: imgY }} className="about__portrait-img">
              <Pic image={PROFILE.portrait} sizes="(min-width: 900px) 36vw, 90vw" alt="Portrait of Suzan Aboul Hesn" />
            </motion.div>
          </motion.div>
          <p className="about__caption mono">{PROFILE.city} · {PROFILE.degree}</p>
        </div>

        <div className="about__body">
          <Eyebrow n="07">About</Eyebrow>
          <h2 className="display">
            <SplitWords text="Hello, I’m" /> <em><SplitWords text="Suzan." delay={0.15} /></em>
          </h2>
          <Reveal as="p" className="about__lead">
            I’m an architect based in Abu Dhabi, working between the stone villages of Mount Lebanon and the exhibition halls of the
            UAE.
          </Reveal>
          <Reveal as="p" delay={0.08}>
            My residential work — villas, apartments and mountain cottages — is shaped by steep terrain and local stone. Alongside
            it, I design booths, stages and ceremonies for Abu Dhabi institutions. I take each project from the first hand sketch
            through plans and shop drawings to photoreal visualisation, and in 2024 I completed a Master’s in Sustainable
            Architecture.
          </Reveal>

          <div className="about__cols">
            <Reveal className="about__col" delay={0.1}>
              <h3 className="mono">Education</h3>
              <ul className="timeline">
                {EDUCATION.map((e) => (
                  <li key={e.year}>
                    <span className="mono">{e.year}</span>
                    <span>
                      <b>{e.title}</b>
                      <small>{e.place}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="about__col" delay={0.16}>
              <h3 className="mono">Capabilities</h3>
              <ul className="taglist">
                {CAPABILITIES.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="about__col" delay={0.22}>
              <h3 className="mono">Tools</h3>
              <ul className="taglist">
                {TOOLS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
      <Marquee items={[...TOOLS, ...CAPABILITIES]} />
    </section>
  )
}
