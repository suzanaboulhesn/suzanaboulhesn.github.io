import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { useMedia } from '../hooks'

/**
 * Keeps the native pointer and adds a small label beside it ("View", "Open", "Drag"…)
 * over elements with data-cursor. Positioned straight from the pointer — no trailing lag.
 */
export default function Cursor() {
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const [label, setLabel] = useState('')
  const last = useRef('')
  if (label) last.current = label

  useEffect(() => {
    if (!fine) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => setLabel(e.target.closest?.('[data-cursor]')?.dataset.cursor || '')
    const leave = () => setLabel('')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [fine, x, y])

  if (!fine) return null

  return (
    <motion.div className="cursor-tag" aria-hidden="true" style={{ x, y }}>
      <motion.span
        initial={false}
        animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.6 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {last.current}
      </motion.span>
    </motion.div>
  )
}
