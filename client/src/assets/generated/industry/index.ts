import avif480 from './industry-480.avif'
import webp480 from './industry-480.webp'
import jpg480 from './industry-480.jpg'
import avif768 from './industry-768.avif'
import webp768 from './industry-768.webp'
import jpg768 from './industry-768.jpg'
import avif1024 from './industry-1024.avif'
import webp1024 from './industry-1024.webp'
import jpg1024 from './industry-1024.jpg'
import avif1440 from './industry-1440.avif'
import webp1440 from './industry-1440.webp'
import jpg1440 from './industry-1440.jpg'
import avif1920 from './industry-1920.avif'
import webp1920 from './industry-1920.webp'
import jpg1920 from './industry-1920.jpg'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 2560,
  height: 1440,
  avif: [{ src: avif480, width: 480 }, { src: avif768, width: 768 }, { src: avif1024, width: 1024 }, { src: avif1440, width: 1440 }, { src: avif1920, width: 1920 }],
  webp: [{ src: webp480, width: 480 }, { src: webp768, width: 768 }, { src: webp1024, width: 1024 }, { src: webp1440, width: 1440 }, { src: webp1920, width: 1920 }],
  fallback: jpg1920,
  fallbackSrcSet: [{ src: jpg480, width: 480 }, { src: jpg768, width: 768 }, { src: jpg1024, width: 1024 }, { src: jpg1440, width: 1440 }, { src: jpg1920, width: 1920 }],
} satisfies ResponsiveImageSource

export default image
