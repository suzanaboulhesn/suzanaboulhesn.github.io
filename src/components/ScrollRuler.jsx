import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'

/** A drafting-scale ruler on the right edge that tracks page progress. */
export default function ScrollRuler() {
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, (v) => `${v * 100}%`)
  const label = useRef(null)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (label.current) label.current.textContent = String(Math.round(v * 100)).padStart(3, '0')
  })
  return (
    <div className="ruler" aria-hidden="true">
      <div className="ruler__ticks">
        {Array.from({ length: 41 }, (_, k) => (
          <i key={k} className={k % 5 === 0 ? 'is-major' : ''} />
        ))}
      </div>
      <motion.div className="ruler__mark" style={{ top }}>
        <span ref={label}>000</span>
      </motion.div>
      <span className="ruler__scale">1:100</span>
    </div>
  )
}
