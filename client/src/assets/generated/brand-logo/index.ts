import webp64 from './brand-logo-64.webp'
import png64 from './brand-logo-64.png'
import webp142 from './brand-logo-142.webp'
import png142 from './brand-logo-142.png'
import webp203 from './brand-logo-203.webp'
import png203 from './brand-logo-203.png'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 203,
  height: 201,
  avif: [],
  webp: [{ src: webp64, width: 64 }, { src: webp142, width: 142 }, { src: webp203, width: 203 }],
  fallback: png203,
  fallbackSrcSet: [{ src: png64, width: 64 }, { src: png142, width: 142 }, { src: png203, width: 203 }],
} satisfies ResponsiveImageSource

export default image
