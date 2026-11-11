import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'motion/react'
import { HERO_SLIDES } from '../data/projects'
import { safeSession } from '../hooks'
import { EASE_IO } from '../ui'

// A small elevation drawing: ground, walls, roof, chimney, pointed-arch door and arched windows.
const PATHS = [
  'M8 150 H232',
  'M48 150 V82 H192 V150',
  'M38 84 L120 38 L202 84',
  'M160 62 V44 H174 V70',
  'M106 150 V120 Q106 102 120 94 Q134 102 134 120 V150',
  'M62 128 V104 Q62 94 71 90 Q80 94 80 104 V128 Z',
  'M160 128 V104 Q160 94 169 90 Q178 94 178 104 V128 Z',
  'M48 112 H192',
]

export default function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true)
  const countRef = useRef(null)
  const fast = useRef(safeSession('sah-seen') === '1').current

  useEffect(() => {
    let cancelled = false
    const duration = fast ? 0.5 : 1.3
    const counter = animate(0, 100, {
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, '0')
      },
    })
    const firstImage = new Promise((resolve) => {
      const im = new Image()
      im.onload = im.onerror = resolve
      im.src = HERO_SLIDES[0].image.sm
      setTimeout(resolve, 5000)
    })
    Promise.all([counter, firstImage]).then(() => {
      if (cancelled) return
      safeSession('sah-seen', '1')
      setVisible(false)
      onDone()
    })
    return () => {
      cancelled = true
      counter.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          role="status"
          aria-label="Loading portfolio"
          initial={{ transform: 'translateY(0%)' }}
          exit={{ transform: 'translateY(-100%)' }}
          transition={{ duration: 0.85, ease: EASE_IO }}
        >
          <div className="preloader__top mono">
            <span>Portfolio</span>
            <span>2014 — 2025</span>
          </div>
          <svg className="preloader__drawing" viewBox="0 0 240 160" aria-hidden="true">
            {PATHS.map((d, k) => (
              <motion.path
                key={k}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: fast ? 0.4 : 0.9, delay: (fast ? 0.02 : 0.06) * k, ease: [0.65, 0, 0.35, 1] }}
              />
            ))}
          </svg>
          <motion.p
            className="preloader__name"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: fast ? 0.05 : 0.25 }}
          >
            Suzan Aboul Hesn <em>— Architect</em>
          </motion.p>
          <div className="preloader__bottom mono">
            <span>Loading selected works</span>
            <span className="preloader__count" ref={countRef}>
              000
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
