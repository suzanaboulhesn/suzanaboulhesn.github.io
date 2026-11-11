import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useClock } from '../hooks'
import { PROFILE } from '../data/projects'
import { EASE, EASE_IO, useUI } from '../ui'

export const LINKS = [
  { id: 'residences', label: 'Residential' },
  { id: 'events', label: 'Events' },
  { id: 'sustainable', label: 'Sustainable' },
  { id: 'sketchbook', label: 'Sketchbook' },
  { id: 'index', label: 'Index' },
  { id: 'about', label: 'About' },
]

export function useScrollTo() {
  const lenis = useLenis()
  return (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Nav() {
  const { ready } = useUI()
  const time = useClock(PROFILE.timeZone)
  const scrollTo = useScrollTo()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(v > prev && v > 240)
  })

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollTo(id), open ? 450 : 0)
  }

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: '-120%' }}
        animate={{ y: ready && (!hidden || open) ? '0%' : '-120%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <a href="#top" className="nav__brand" onClick={go('top')} aria-label="Suzan Aboul Hesn — back to top">
          <span className="nav__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 21V11c0-4 3-7 7-9 4 2 7 5 7 9v10" />
              <path d="M9 21v-7c0-2 1.3-3.4 3-4 1.7.6 3 2 3 4v7" />
            </svg>
          </span>
          <span className="nav__name">Suzan Aboul Hesn</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <span className="nav__clock mono" title="Local time in Abu Dhabi">
            Abu Dhabi <b>{time}</b>
          </span>
          <a href="#contact" className="nav__cta" onClick={go('contact')}>
            Contact
          </a>
          <button className="nav__menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu">
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: EASE_IO }}
          >
            <nav aria-label="Menu">
              {[...LINKS, { id: 'contact', label: 'Contact' }].map((l, k) => (
                <div className="menu__mask" key={l.id}>
                  <motion.a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + k * 0.05 }}
                  >
                    <span className="mono">0{k + 1}</span> {l.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <div className="menu__foot mono">
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <span className="menu__social">
                {PROFILE.social.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener me">
                    {s.label}
                  </a>
                ))}
              </span>
              <span>Abu Dhabi — {time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
