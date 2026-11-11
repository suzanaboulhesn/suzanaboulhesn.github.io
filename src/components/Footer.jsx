import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { PROFILE } from '../data/projects'
import { useScrollTo } from './Nav'

export default function Footer() {
  const ref = useRef(null)
  const scrollTo = useScrollTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])

  return (
    <footer className="footer" ref={ref}>
      <div className="footer__row">
        <span className="mono">© {new Date().getFullYear()} {PROFILE.name}</span>
        <span className="mono footer__social">
          {PROFILE.social.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener me">
              {s.label}
            </a>
          ))}
        </span>
        <button className="mono footer__top" onClick={() => scrollTo('top')}>
          Back to top ↑
        </button>
      </div>
      <div className="footer__mark-wrap" aria-hidden="true">
        <motion.p className="footer__mark" style={{ y }}>
          Suzan <em>Aboul Hesn</em>
        </motion.p>
      </div>
    </footer>
  )
}
