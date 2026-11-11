import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PROFILE } from '../data/projects'
import { useClock } from '../hooks'
import { Eyebrow, Magnetic, Reveal, SplitWords } from './primitives'

export default function Contact() {
  const time = useClock(PROFILE.timeZone)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  return (
    <section className="contact section" id="contact">
      <Eyebrow n="09">Contact</Eyebrow>
      <h2 className="contact__title">
        <SplitWords text="Let’s design" />
        <br />
        <em>
          <SplitWords text="something lasting." delay={0.2} />
        </em>
      </h2>

      <div className="contact__row">
        <Reveal className="contact__circle-wrap">
          <Magnetic strength={0.4}>
            <a className="contact__circle" href={`mailto:${PROFILE.email}?subject=Project%20enquiry`} data-cursor="Write">
              <span>Start a</span>
              <span>conversation</span>
              <span aria-hidden="true">→</span>
            </a>
          </Magnetic>
        </Reveal>

        <div className="contact__details">
          <Reveal>
            <p className="mono contact__label">Email</p>
            <button className="contact__email" onClick={copy} data-cursor={copied ? 'Copied' : 'Copy'}>
              <span>{PROFILE.email}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.small
                  key={copied ? 'y' : 'n'}
                  className="mono"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {copied ? 'Copied ✓' : 'Click to copy'}
                </motion.small>
              </AnimatePresence>
            </button>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mono contact__label">Portfolio</p>
            <a className="contact__link" href={PROFILE.pdf} download data-cursor="Save">
              Download the full PDF portfolio <span className="mono">12.5 MB</span>
            </a>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mono contact__label">Based in</p>
            <p className="contact__plain">
              {PROFILE.city}, UAE — <span className="mono">{time} local time</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
