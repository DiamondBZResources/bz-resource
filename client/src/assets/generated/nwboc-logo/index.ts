import webp240 from './nwboc-logo-240.webp'
import webp480 from './nwboc-logo-480.webp'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 480,
  height: 191,
  avif: [],
  webp: [{ src: webp240, width: 240 }, { src: webp480, width: 480 }],
  fallback: webp480,
  fallbackSrcSet: [{ src: webp240, width: 240 }, { src: webp480, width: 480 }],
} satisfies ResponsiveImageSource

export default image
