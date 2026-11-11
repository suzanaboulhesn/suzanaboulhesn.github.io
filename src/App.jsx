import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react'
import { ReactLenis, useLenis } from 'lenis/react'
import { UIContext } from './ui'
import { bySlug } from './data/projects'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import ScrollRuler from './components/ScrollRuler'
import Hero from './components/Hero'
import Statement from './components/Statement'
import Residences from './components/Residences'
import Events from './components/Events'
import Concept from './components/Concept'
import Sketchbook from './components/Sketchbook'
import WorkIndex from './components/WorkIndex'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectSheet from './components/ProjectSheet'
import Gallery from './components/Gallery'

const parseHash = () => {
  const m = window.location.hash.match(/^#\/work\/([\w-]+)/)
  return m && bySlug[m[1]] ? m[1] : null
}

/** Pauses smooth scrolling of the page while an overlay owns the screen. */
function ScrollLock({ locked }) {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }, [lenis, locked])
  return null
}

export default function App() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [slug, setSlug] = useState(parseHash)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const sync = () => setSlug(parseHash())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const openProject = useCallback((s) => {
    if (parseHash() !== s) window.history.pushState(null, '', `#/work/${s}`)
    setSlug(s)
  }, [])

  const closeProject = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search)
    setSlug(null)
  }, [])

  const openLightbox = useCallback((images, index = 0) => setLightbox({ images, index }), [])

  const ui = useMemo(
    () => ({ ready, openProject, closeProject, openLightbox, lightboxOpen: !!lightbox }),
    [ready, openProject, closeProject, openLightbox, lightbox],
  )

  const project = slug ? bySlug[slug] : null

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={reduced ? { lerp: 1, smoothWheel: false } : { lerp: 0.085, wheelMultiplier: 1 }}>
        <UIContext.Provider value={ui}>
          <ScrollLock locked={!!project || !ready} />
          <Preloader onDone={() => setReady(true)} />
          <Cursor />
          <Nav />
          <ScrollRuler />

          <main id="main" aria-hidden={project ? true : undefined}>
            <Hero />
            <Statement />
            <Residences />
            <Events />
            <Concept />
            <Sketchbook />
            <WorkIndex />
            <About />
            <Contact />
          </main>
          <Footer />

          <AnimatePresence>{project && <ProjectSheet key="sheet" project={project} />}</AnimatePresence>
          <Gallery state={lightbox} onClose={() => setLightbox(null)} />
        </UIContext.Provider>
      </ReactLenis>
    </MotionConfig>
  )
}
