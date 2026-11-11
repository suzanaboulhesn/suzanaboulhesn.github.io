import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { PROFILE } from '../data/projects'
import { useScrollTo } from './Nav'

export default function Footer() {
  const ref = useRef(null)
  const scrollTo = useScrollTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const spread = useTransform(scrollYProgress, [0, 1], ['-0.06em', '-0.03em'])

  return (
    <footer className="footer" ref={ref}>
      <div className="footer__row">
        <span className="mono">© {new Date().getFullYear()} {PROFILE.name}</span>
        <span className="mono">Selected projects 2014 — 2025</span>
        <button className="mono footer__top" onClick={() => scrollTo('top')}>
          Back to top ↑
        </button>
      </div>
      <div className="footer__mark-wrap" aria-hidden="true">
        <motion.p className="footer__mark" style={{ y, letterSpacing: spread }}>
          Suzan <em>Aboul Hesn</em>
        </motion.p>
      </div>
    </footer>
  )
}
