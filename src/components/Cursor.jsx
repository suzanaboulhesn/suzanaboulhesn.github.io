import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMedia } from '../hooks'

/**
 * Two layers: an inverting dot + ring (mix-blend difference, readable on any background),
 * and a solid label bubble for elements with data-cursor="Label".
 */
export default function Cursor() {
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 })
  const [label, setLabel] = useState('')
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)
  const lastLabel = useRef('')
  if (label) lastLabel.current = label

  useEffect(() => {
    if (!fine) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor], a, button, [role="button"], .yarl__root')
      if (t?.classList?.contains('yarl__root') && !t.dataset.cursor) {
        setHover(false)
        setLabel('')
        return
      }
      setHover(!!t)
      setLabel(t?.dataset?.cursor || '')
    }
    const leave = () => setVisible(false)
    const pd = () => setDown(true)
    const pu = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', pd)
    window.addEventListener('pointerup', pu)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', pd)
      window.removeEventListener('pointerup', pu)
    }
  }, [fine, x, y])

  if (!fine) return null

  return (
    <>
      <div className="cursor cursor--blend" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
        <motion.div className="cursor__dot" style={{ x, y }} animate={{ scale: label ? 0 : down ? 0.5 : 1 }} />
        <motion.div
          className="cursor__ring"
          style={{ x: rx, y: ry }}
          animate={{ scale: label ? 0.3 : hover ? 1.7 : down ? 0.8 : 1, opacity: label ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        />
      </div>
      <div className="cursor" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
        <motion.div
          className="cursor__label"
          style={{ x: rx, y: ry }}
          initial={false}
          animate={{ scale: label ? (down ? 0.88 : 1) : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          {lastLabel.current}
        </motion.div>
      </div>
    </>
  )
}
