import type { ImgHTMLAttributes } from 'react'

export type ResponsiveImageVariant = {
  src: string
  width: number
}

export type ResponsiveImageSource = {
  width: number
  height: number
  avif?: readonly ResponsiveImageVariant[]
  webp?: readonly ResponsiveImageVariant[]
  fallback: string
  fallbackSrcSet?: readonly ResponsiveImageVariant[]
}

type ResponsiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'decoding' | 'fetchPriority' | 'height' | 'loading' | 'src' | 'srcSet' | 'width'
> & {
  imageClassName?: string
  pictureClassName?: string
  priority?: boolean
  sizes: string
  source: ResponsiveImageSource
}

function toSrcSet(variants: readonly ResponsiveImageVariant[] | undefined) {
  return variants?.map((variant) => `${variant.src} ${variant.width}w`).join(', ')
}

function ResponsiveImage({
  alt,
  imageClassName,
  pictureClassName,
  priority = false,
  sizes,
  source,
  ...imageProps
}: ResponsiveImageProps) {
  const avifSrcSet = toSrcSet(source.avif)
  const webpSrcSet = toSrcSet(source.webp)
  const fallbackSrcSet = toSrcSet(source.fallbackSrcSet)

  return (
    <picture className={pictureClassName ? `responsive-picture ${pictureClassName}` : 'responsive-picture'}>
      {avifSrcSet ? <source sizes={sizes} srcSet={avifSrcSet} type="image/avif" /> : null}
      {webpSrcSet ? <source sizes={sizes} srcSet={webpSrcSet} type="image/webp" /> : null}
      <img
        {...imageProps}
        alt={alt}
        className={imageClassName}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        height={source.height}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        src={source.fallback}
        srcSet={fallbackSrcSet}
        width={source.width}
      />
    </picture>
  )
}

export default ResponsiveImage
