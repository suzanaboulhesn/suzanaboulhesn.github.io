import { bySlug } from '../data/projects'
import { useUI } from '../ui'
import { Eyebrow, Reveal, RevealPic, SplitWords, Magnetic } from './primitives'
import Loupe from './Loupe'

const P = bySlug['sawfar-grand-hotel']
const [render, aerial, corridor, , , storyboard] = P.images

export default function Concept() {
  const { openProject, openLightbox } = useUI()
  const open = (img) => () => openLightbox(P.images, P.images.indexOf(img))
  return (
    <section className="concept section" id="concept">
      <div className="concept__grid">
        <div className="concept__text">
          <div className="concept__sticky">
            <Eyebrow n="05">Conceptual · {P.date}</Eyebrow>
            <h2 className="display">
              <SplitWords text="Sawfar" /> <em><SplitWords text="Grand Hotel" delay={0.15} /></em>
            </h2>
            <Reveal as="p" className="concept__kicker mono" delay={0.1}>
              Adaptive reuse · {P.location}
            </Reveal>
            <Reveal as="blockquote" className="concept__quote" delay={0.15}>
              “Turn the visitor into a performer — offered a script, they can decide to follow it or not.”
            </Reveal>
            <Reveal as="p" className="concept__body" delay={0.2}>
              {P.description[0]} {P.description[1].replace('My project turns', 'The project turns')}
            </Reveal>
            <Reveal delay={0.25}>
              <Magnetic>
                <button className="btn" onClick={() => openProject(P.slug)} data-cursor="Open">
                  Explore the project <span aria-hidden="true">↗</span>
                </button>
              </Magnetic>
            </Reveal>
          </div>
        </div>
        <div className="concept__images">
          <RevealPic image={render} sizes="(min-width: 900px) 55vw, 100vw" onClick={open(render)} />
          <div className="concept__pair">
            <RevealPic image={corridor} sizes="(min-width: 900px) 25vw, 50vw" onClick={open(corridor)} className="is-portrait" />
            <div className="concept__note">
              <p className="mono">The corridor — a scripted scene</p>
              <p>The visitor moves through the ruin as if through a film set, along a route choreographed frame by frame in a hand-drawn storyboard.</p>
            </div>
          </div>
          <RevealPic image={aerial} sizes="(min-width: 900px) 55vw, 100vw" onClick={open(aerial)} />
        </div>
      </div>

      <div className="concept__board">
        <div className="concept__board-head">
          <p className="mono">Storyboard — hand-drawn, 16 frames</p>
          <p className="mono concept__hint">Hover to inspect · click to zoom</p>
        </div>
        <Reveal y={40}>
          <Loupe image={storyboard} onOpen={open(storyboard)} />
        </Reveal>
      </div>
    </section>
  )
}
