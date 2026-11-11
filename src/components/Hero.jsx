import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { HERO_SLIDES, PROFILE, srcSet } from '../data/projects'
import { useMedia, pad } from '../hooks'
import { EASE, useUI } from '../ui'
import { SplitChars } from './primitives'
import { useScrollTo } from './Nav'

const SLIDE_MS = 6500

/** CAD-style crosshair that follows the pointer across the hero with a live coordinate readout. */
function Crosshair({ area, label }) {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 600, damping: 40 })
  const sy = useSpring(y, { stiffness: 600, damping: 40 })
  const [on, setOn] = useState(false)
  const readout = useRef(null)

  useEffect(() => {
    const el = area.current
    if (!el) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      x.set(px)
      y.set(py)
      if (readout.current) {
        readout.current.textContent = `X ${pad(Math.round((px / r.width) * 1000), 4)}  ·  Y ${pad(Math.round((py / r.height) * 1000), 4)}`
      }
    }
    const enter = () => setOn(true)
    const leave = () => setOn(false)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [area, x, y])

  return (
    <motion.div className="crosshair" aria-hidden="true" animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.4 }}>
      <motion.i className="crosshair__h" style={{ y: sy }} />
      <motion.i className="crosshair__v" style={{ x: sx }} />
      <motion.div className="crosshair__tag mono" style={{ x: sx, y: sy }}>
        <span ref={readout}>X 0000 · Y 0000</span>
        <b>{label}</b>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const { ready, openProject } = useUI()
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const scrollTo = useScrollTo()
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const slide = HERO_SLIDES[i]

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const frame = useTransform(scrollYProgress, [0, 1], ['inset(0% 0% 0% 0%)', 'inset(6% 4% 0% 4%)'])

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setI((v) => (v + 1) % HERO_SLIDES.length), SLIDE_MS)
    return () => clearTimeout(t)
  }, [ready, i])

  return (
    <section className="hero" id="top" ref={ref} aria-label="Introduction">
      <motion.div className="hero__frame" style={{ clipPath: frame }}>
        <motion.div className="hero__media" style={{ y: mediaY, scale: mediaScale }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={slide.image.key}
              src={slide.image.sm}
              srcSet={srcSet(slide.image)}
              sizes="100vw"
              alt={`${slide.label}, ${slide.place}`}
              className="hero__img"
              initial={{ opacity: 0, scale: 1.14 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.6, ease: 'easeInOut' }, scale: { duration: 9, ease: 'linear' } }}
              draggable={false}
            />
          </AnimatePresence>
        </motion.div>
        <div className="hero__shade" />
        <div className="hero__grid" aria-hidden="true" />
      </motion.div>

      {fine && <Crosshair area={ref} label={slide.label} />}

      <motion.div className="hero__content" style={{ y: contentY, opacity: fade }}>
        <motion.p
          className="hero__eyebrow mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {PROFILE.title} <span>—</span> {PROFILE.degree} <span>—</span> {PROFILE.city}
        </motion.p>
        <h1 className="hero__title">
          <SplitChars text={PROFILE.first} show={ready} delay={0.1} />
          <SplitChars text={PROFILE.last} show={ready} delay={0.3} className="is-italic" />
        </h1>
        <motion.div
          className="hero__foot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        >
          <p className="hero__lede">
            Homes rooted in landscape and stone, and stages built for celebration — between Mount Lebanon and Abu Dhabi.
          </p>
          <button className="hero__scroll mono" onClick={() => scrollTo('statement')}>
            <span className="hero__scroll-line" aria-hidden="true" />
            Scroll to explore
          </button>
        </motion.div>
      </motion.div>

      <motion.div className="hero__slides-wrap" style={{ opacity: fade }}>
      <motion.ol
        className="hero__slides"
        aria-label="Featured projects"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 20 }}
        transition={{ duration: 1, ease: EASE, delay: 1.1 }}
      >
        {HERO_SLIDES.map((s, k) => (
          <li key={s.slug} className={k === i ? 'is-active' : ''}>
            <button onClick={() => (k === i ? openProject(s.slug) : setI(k))} data-cursor={k === i ? 'Open' : 'Show'}>
              <span className="mono">{pad(k + 1)}</span>
              <span className="hero__slide-label">{s.label}</span>
              <span className="hero__slide-place mono">{s.place}</span>
              <span className="hero__bar" aria-hidden="true">
                {k === i && ready && (
                  <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }} />
                )}
              </span>
            </button>
          </li>
        ))}
        <li className="hero__open">
          <button onClick={() => openProject(slide.slug)} data-cursor="Open">
            View {slide.label} <span aria-hidden="true">↗</span>
          </button>
        </li>
      </motion.ol>
      </motion.div>
    </section>
  )
}
