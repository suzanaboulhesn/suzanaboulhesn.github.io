import { motion, useInView, useMotionValue, useSpring } from 'motion/react'
import { useRef } from 'react'
import { srcSet } from '../data/projects'
import { EASE } from '../ui'

/** Letters rise out of a mask. `show` gates the animation (e.g. after the preloader). */
export function SplitChars({ text, show = true, delay = 0, stagger = 0.035, className = '' }) {
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, k) => (
        <span className="split__mask" key={k} aria-hidden="true">
          <motion.span
            className="split__char"
            initial={{ y: '115%' }}
            animate={show ? { y: '0%' } : { y: '115%' }}
            transition={{ duration: 1.15, ease: EASE, delay: delay + k * stagger }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/**
 * Words rise when scrolled into view. The un-transformed wrapper is what's observed,
 * so the trigger is reliable even though each word starts clipped out of its mask.
 */
export function SplitWords({ text, className = '', delay = 0 }) {
  const words = text.split(' ')
  return (
    <motion.span
      className={`split ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, k) => (
        <span className="split__mask" key={k} aria-hidden="true">
          <motion.span
            className="split__char"
            variants={{
              hidden: { y: '115%' },
              show: { y: '0%', transition: { duration: 1, ease: EASE, delay: delay + k * 0.06 } },
            }}
          >
            {w}
            {k < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Fade-and-rise on enter. */
export function Reveal({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Responsive <img> using the small + large WebP renditions. */
export function Pic({ image, sizes = '100vw', className, alt, eager = false, ...rest }) {
  return (
    <img
      className={className}
      src={image.sm}
      srcSet={srcSet(image)}
      sizes={sizes}
      width={image.w}
      height={image.h}
      alt={alt ?? image.alt ?? image.caption ?? ''}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      {...rest}
    />
  )
}

/** Image that wipes in from the bottom with a slow settle. */
export function RevealPic({ image, sizes, className = '', onClick, cursor = 'View' }) {
  // A paper-coloured cover slides away and the image settles — both pure CSS transform transitions
  // (compositor-only), triggered once when the image scrolls into view.
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      ref={ref}
      className={`reveal-pic ${seen ? 'is-in' : ''} ${className}`}
      onClick={onClick}
      data-cursor={onClick ? cursor : undefined}
      aria-label={onClick ? `Enlarge: ${image.caption}` : undefined}
    >
      <span className="reveal-pic__inner">
        <Pic image={image} sizes={sizes} />
      </span>
      <span className="reveal-pic__cover" aria-hidden="true" />
    </Comp>
  )
}

/** Element that leans toward the pointer. */
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} className={className} style={{ x: sx, y: sy, display: 'inline-block' }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.div>
  )
}

export function Eyebrow({ n, children }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow__n">({n})</span> <span className="eyebrow__rule" aria-hidden="true" /> {children}
    </p>
  )
}
