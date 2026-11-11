import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Captions from 'yet-another-react-lightbox/plugins/captions'

/** Full-screen, zoomable gallery (pinch / wheel / double-click to zoom). */
export default function Gallery({ state, onClose }) {
  const images = state?.images ?? []
  const slides = images.map((i) => ({
    src: i.src,
    width: i.w,
    height: i.h,
    alt: i.caption,
    description: i.caption,
    srcSet: [
      { src: i.sm, width: i.smW, height: i.smH },
      { src: i.src, width: i.w, height: i.h },
    ],
  }))

  return (
    <Lightbox
      open={!!state}
      close={onClose}
      index={state?.index ?? 0}
      slides={slides}
      plugins={[Zoom, Thumbnails, Counter, Captions]}
      zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true, doubleClickMaxStops: 2 }}
      thumbnails={{ width: 96, height: 64, border: 0, gap: 10, padding: 0, imageFit: 'cover', vignette: true, showToggle: true }}
      captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 2 }}
      carousel={{ finite: slides.length <= 1, padding: '56px' }}
      controller={{ closeOnBackdropClick: true }}
      render={slides.length <= 1 ? { buttonPrev: () => null, buttonNext: () => null } : undefined}
      styles={{ container: { backgroundColor: '#0e0d0c' } }}
    />
  )
}
