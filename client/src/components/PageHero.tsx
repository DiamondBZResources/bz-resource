import type { CSSProperties } from 'react'
import { assetPath } from '../lib/assets'

type PageHeroProps = {
  eyebrow: string
  title: string
  description?: string
}

type PageHeroStyle = CSSProperties & {
  '--page-hero-background': string
}

function PageHero({ eyebrow, title, description }: PageHeroProps) {
  const pageHeroStyle: PageHeroStyle = {
    '--page-hero-background': `url("${assetPath('images/largeImageForMain.jpg')}")`,
  }

  return (
    <section className="page-hero" style={pageHeroStyle}>
      <div className="section-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
    </section>
  )
}

export default PageHero
