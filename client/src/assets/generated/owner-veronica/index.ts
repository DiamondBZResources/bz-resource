import png541 from './owner-veronica-541.png'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 541,
  height: 495,
  avif: [],
  webp: [],
  fallback: png541,
  fallbackSrcSet: [{ src: png541, width: 541 }],
} satisfies ResponsiveImageSource

export default image
