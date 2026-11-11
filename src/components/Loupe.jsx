import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useMedia } from '../hooks'
import { Pic } from './primitives'

/** Drawing/board with a magnifying loupe that follows the pointer (desktop). Click opens the lightbox. */
export default function Loupe({ image, zoom = 2.6, size = 220, onOpen, sizes = '100vw' }) {
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const wrap = useRef(null)
  const pos = useRef(null)
  const lens = useRef(null)
  const [on, setOn] = useState(false)

  const move = (e) => {
    if (!fine || !lens.current) return
    const r = wrap.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    pos.current.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`
    lens.current.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`
    lens.current.style.backgroundPosition = `${-(x * zoom - size / 2)}px ${-(y * zoom - size / 2)}px`
  }

  return (
    <button
      ref={wrap}
      className="loupe"
      onPointerMove={move}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onClick={onOpen}
      data-cursor="Zoom"
      aria-label={`Enlarge: ${image.caption}`}
    >
      <Pic image={image} sizes={sizes} />
      {fine && (
        <span ref={pos} className="loupe__pos" aria-hidden="true" style={{ width: size, height: size }}>
          <motion.span
            ref={lens}
            className="loupe__lens"
            style={{ backgroundImage: on ? `url(${image.src})` : undefined }}
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }}
            transition={{ duration: 0.25 }}
          />
        </span>
      )}
    </button>
  )
}
