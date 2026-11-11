import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { SKETCHES } from '../data/projects'
import { useMedia } from '../hooks'
import { EASE, useUI } from '../ui'
import { Eyebrow, Pic, Reveal, SplitWords } from './primitives'

// Hand-placed positions on the drafting table (percent of board), widths in % and a slight rotation.
const LAYOUT = [
  { x: 3, y: 6, w: 23, r: -4 },
  { x: 29, y: 2, w: 17, r: 3 },
  { x: 49, y: 8, w: 21, r: -2 },
  { x: 74, y: 3, w: 22, r: 4 },
  { x: 6, y: 52, w: 25, r: 2 },
  { x: 33, y: 44, w: 22, r: -5 },
  { x: 57, y: 50, w: 19, r: 3 },
  { x: 78, y: 46, w: 16, r: -3 },
  { x: 45, y: 74, w: 14, r: 6 },
]

function Sketch({ s, k, z, board, onFront, onOpen }) {
  const dragged = useRef(false)
  const pos = LAYOUT[k]
  return (
    <motion.button
      className="sk"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pos.w}%`, zIndex: z, rotate: pos.r }}
      drag
      dragConstraints={board}
      dragElastic={0.12}
      dragTransition={{ power: 0.25, timeConstant: 220 }}
      whileHover={{ scale: 1.03 }}
      whileDrag={{ scale: 1.07, rotate: 0, boxShadow: '0 30px 60px -20px rgba(0,0,0,.35)' }}
      onPointerDown={onFront}
      onDragStart={() => (dragged.current = true)}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false
          return
        }
        onOpen()
      }}
      data-cursor="Drag"
      aria-label={`Sketch: ${s.caption}. Click to enlarge.`}
    >
      <motion.span
        className="sk__inner"
        initial={{ opacity: 0, y: 80, rotate: pos.r * 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 + k * 0.07 }}
      >
        <Pic image={s} sizes="25vw" />
        <span className="sk__cap mono">{s.caption}</span>
      </motion.span>
    </motion.button>
  )
}

export default function Sketchbook() {
  const desk = useMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)')
  const { openLightbox } = useUI()
  const board = useRef(null)
  const [stack, setStack] = useState(() => SKETCHES.map((_, k) => k))
  const front = (k) => setStack((s) => [...s.filter((i) => i !== k), k])

  return (
    <section className="sketchbook section" id="sketchbook">
      <header className="sketchbook__head">
        <Eyebrow n="06">Sketchbook</Eyebrow>
        <h2 className="display">
          <SplitWords text="Thinking" /> <em><SplitWords text="by hand" delay={0.15} /></em>
        </h2>
        <Reveal as="p" className="sketchbook__intro" delay={0.15}>
          Every project starts on paper — massing gestures, structural rhythms and the cladding tolerances that make a façade
          buildable. {desk ? 'Drag the sketches around the table; click one to look closer.' : 'Swipe through, tap to look closer.'}
        </Reveal>
      </header>

      {desk ? (
        <div className="board" ref={board}>
          <span className="board__north mono" aria-hidden="true">
            N ↑
          </span>
          <span className="board__scale mono" aria-hidden="true">
            <i /> Drag to rearrange
          </span>
          {SKETCHES.map((s, k) => (
            <Sketch
              key={s.key}
              s={s}
              k={k}
              z={stack.indexOf(k) + 1}
              board={board}
              onFront={() => front(k)}
              onOpen={() => openLightbox(SKETCHES, k)}
            />
          ))}
        </div>
      ) : (
        <div className="sk-row" data-lenis-prevent-touch>
          {SKETCHES.map((s, k) => (
            <button key={s.key} className="sk-row__item" onClick={() => openLightbox(SKETCHES, k)} aria-label={`Sketch: ${s.caption}`}>
              <Pic image={s} sizes="70vw" />
              <span className="mono">{s.caption}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
