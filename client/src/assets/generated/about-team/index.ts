import avif480 from './about-team-480.avif'
import webp480 from './about-team-480.webp'
import jpg480 from './about-team-480.jpg'
import avif750 from './about-team-750.avif'
import webp750 from './about-team-750.webp'
import jpg750 from './about-team-750.jpg'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 750,
  height: 630,
  avif: [{ src: avif480, width: 480 }, { src: avif750, width: 750 }],
  webp: [{ src: webp480, width: 480 }, { src: webp750, width: 750 }],
  fallback: jpg750,
  fallbackSrcSet: [{ src: jpg480, width: 480 }, { src: jpg750, width: 750 }],
} satisfies ResponsiveImageSource

export default image
