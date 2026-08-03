import avif480 from './brochure-outside-480.avif'
import webp480 from './brochure-outside-480.webp'
import jpg480 from './brochure-outside-480.jpg'
import avif768 from './brochure-outside-768.avif'
import webp768 from './brochure-outside-768.webp'
import jpg768 from './brochure-outside-768.jpg'
import avif1024 from './brochure-outside-1024.avif'
import webp1024 from './brochure-outside-1024.webp'
import jpg1024 from './brochure-outside-1024.jpg'
import avif1440 from './brochure-outside-1440.avif'
import webp1440 from './brochure-outside-1440.webp'
import jpg1440 from './brochure-outside-1440.jpg'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 1667,
  height: 1294,
  avif: [{ src: avif480, width: 480 }, { src: avif768, width: 768 }, { src: avif1024, width: 1024 }, { src: avif1440, width: 1440 }],
  webp: [{ src: webp480, width: 480 }, { src: webp768, width: 768 }, { src: webp1024, width: 1024 }, { src: webp1440, width: 1440 }],
  fallback: jpg1440,
  fallbackSrcSet: [{ src: jpg480, width: 480 }, { src: jpg768, width: 768 }, { src: jpg1024, width: 1024 }, { src: jpg1440, width: 1440 }],
} satisfies ResponsiveImageSource

export default image
