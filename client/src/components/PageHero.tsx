import { Link } from 'react-router-dom'
import largeMain from '../assets/generated/large-main'
import ResponsiveImage from './ResponsiveImage'

type PageHeroProps = {
  eyebrow: string
  title: string
  description?: string
}

function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <ResponsiveImage
        alt=""
        aria-hidden="true"
        imageClassName="page-hero-image image-cover"
        pictureClassName="page-hero-media"
        priority
        sizes="100vw"
        source={largeMain}
      />
      <div className="section-inner">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{eyebrow}</span>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
    </section>
  )
}

export default PageHero
