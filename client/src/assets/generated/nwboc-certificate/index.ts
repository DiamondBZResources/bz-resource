import webp480 from './nwboc-certificate-480.webp'
import webp768 from './nwboc-certificate-768.webp'
import webp1024 from './nwboc-certificate-1024.webp'
import webp1440 from './nwboc-certificate-1440.webp'
import type { ResponsiveImageSource } from '../../../components/ResponsiveImage'

const image = {
  width: 1650,
  height: 1275,
  avif: [],
  webp: [{ src: webp480, width: 480 }, { src: webp768, width: 768 }, { src: webp1024, width: 1024 }, { src: webp1440, width: 1440 }],
  fallback: webp1440,
  fallbackSrcSet: [{ src: webp480, width: 480 }, { src: webp768, width: 768 }, { src: webp1024, width: 1024 }, { src: webp1440, width: 1440 }],
} satisfies ResponsiveImageSource

export default image
