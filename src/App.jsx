import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react'
import { ReactLenis, useLenis } from 'lenis/react'
import { UIContext } from './ui'
import { bySlug, projectPath } from './data/projects'
import { applyHead } from './seo'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import ScrollRuler from './components/ScrollRuler'
import Hero from './components/Hero'
import Statement from './components/Statement'
import Residences from './components/Residences'
import Events from './components/Events'
import Sustainable from './components/Sustainable'
import Concept from './components/Concept'
import Sketchbook from './components/Sketchbook'
import WorkIndex from './components/WorkIndex'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectSheet from './components/ProjectSheet'
import Gallery from './components/Gallery'

const HOME = import.meta.env.BASE_URL

/** Projects live at /projects/<slug>/ (real, crawlable pages). Old #/work/<slug> links still work. */
const parseRoute = () => {
  const path = window.location.pathname.match(/\/projects\/([\w-]+)\/?$/)
  if (path && bySlug[path[1]]) return path[1]
  const hash = window.location.hash.match(/^#\/work\/([\w-]+)/)
  return hash && bySlug[hash[1]] ? hash[1] : null
}

// Upgrade a legacy hash link to its real URL without adding a history entry.
if (/^#\/work\//.test(window.location.hash)) {
  const s = parseRoute()
  window.history.replaceState(null, '', s ? projectPath(s) : HOME)
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
  const [slug, setSlug] = useState(parseRoute)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const sync = () => setSlug(parseRoute())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  useEffect(() => applyHead(slug ? bySlug[slug] : null), [slug])

  const openProject = useCallback((s) => {
    if (parseRoute() !== s) window.history.pushState(null, '', projectPath(s))
    setSlug(s)
  }, [])

  const closeProject = useCallback(() => {
    window.history.pushState(null, '', HOME)
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
            <Sustainable />
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
