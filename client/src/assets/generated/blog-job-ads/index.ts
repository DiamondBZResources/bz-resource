import avif480 from './blog-job-ads-480.avif'
import webp480 from './blog-job-ads-480.webp'
import jpg480 from './blog-job-ads-480.jpg'
import avif768 from './blog-job-ads-768.avif'
import webp768 from './blog-job-ads-768.webp'
import jpg768 from './blog-job-ads-768.jpg'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 8688,
  height: 5792,
  avif: [{ src: avif480, width: 480 }, { src: avif768, width: 768 }],
  webp: [{ src: webp480, width: 480 }, { src: webp768, width: 768 }],
  fallback: jpg768,
  fallbackSrcSet: [{ src: jpg480, width: 480 }, { src: jpg768, width: 768 }],
} satisfies ResponsiveImageSource

export default image
