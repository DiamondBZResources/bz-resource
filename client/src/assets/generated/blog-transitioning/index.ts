import avif400 from './blog-transitioning-400.avif'
import webp400 from './blog-transitioning-400.webp'
import png400 from './blog-transitioning-400.png'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 400,
  height: 250,
  avif: [{ src: avif400, width: 400 }],
  webp: [{ src: webp400, width: 400 }],
  fallback: png400,
  fallbackSrcSet: [{ src: png400, width: 400 }],
} satisfies ResponsiveImageSource

export default image
