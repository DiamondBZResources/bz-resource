import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import ResponsiveImage from './ResponsiveImage'
import largeMainImage from '../assets/generated/large-main'
import { useLanguage } from '../context/language'
import { siteContent } from '../data/siteContent'

export default function HeroCarousel() {
  const { language } = useLanguage()
  const copy = siteContent[language].home.hero

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-copy">
        <div className="home-hero-copy-inner">
          <p className="eyebrow eyebrow-light">{copy.eyebrow}</p>
          <h1 id="home-hero-title">{copy.title}</h1>
          <p className="home-hero-text">{copy.text}</p>
          <div className="button-row">
            <Link className="button button-light" to="/contact">{copy.primary}<FiArrowRight /></Link>
            <Link className="text-link text-link-light" to="/services">{copy.secondary}<FiArrowRight /></Link>
          </div>
        </div>
      </div>
      <div className="home-hero-image">
        <ResponsiveImage
          alt={language === 'es' ? 'Profesionales revisando documentos en una mesa de trabajo' : 'Professionals reviewing documents around a workplace table'}
          imageClassName="cover-image"
          priority
          sizes="(max-width: 900px) 100vw, 44vw"
          source={largeMainImage}
        />
      </div>
    </section>
  )
}
