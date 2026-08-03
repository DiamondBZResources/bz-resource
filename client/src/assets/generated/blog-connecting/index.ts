import avif400 from './blog-connecting-400.avif'
import webp400 from './blog-connecting-400.webp'
import jpg400 from './blog-connecting-400.jpg'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 400,
  height: 250,
  avif: [{ src: avif400, width: 400 }],
  webp: [{ src: webp400, width: 400 }],
  fallback: jpg400,
  fallbackSrcSet: [{ src: jpg400, width: 400 }],
} satisfies ResponsiveImageSource

export default image
