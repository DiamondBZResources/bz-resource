import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import ResponsiveImage from './ResponsiveImage'
import { useLanguage } from '../context/language'
import { services } from '../data/services'
import { siteContent } from '../data/siteContent'

export default function WorkforceCarousel() {
  const { language } = useLanguage()
  const copy = siteContent[language].home.carousel

  const renderGroup = (duplicate: boolean) => (
    <div className="service-marquee-group" aria-hidden={duplicate || undefined}>
      {services.map((service, index) => {
        const title = language === 'es' ? service.titleEs : service.title
        const description = language === 'es' ? service.descriptionEs : service.description
        return (
          <Link className="service-marquee-card" key={`${duplicate ? 'copy' : 'primary'}-${service.title}`} to="/services" tabIndex={duplicate ? -1 : undefined}>
            <ResponsiveImage
              alt={duplicate ? '' : (language === 'es' ? service.altEs : service.alt)}
              imageClassName="cover-image"
              sizes="(max-width: 600px) 82vw, 360px"
              source={service.image}
            />
            <div className="service-marquee-copy">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="service-marquee-link">{siteContent[language].shared.learnMore}<FiArrowUpRight /></span>
            </div>
          </Link>
        )
      })}
    </div>
  )

  return (
    <section className="section service-marquee-section" aria-labelledby="service-marquee-title">
      <div className="container-wide section-heading-row">
        <div><p className="eyebrow">{copy.eyebrow}</p><h2 id="service-marquee-title">{copy.title}</h2></div>
        <p>{copy.text}</p>
      </div>
      <div className="service-marquee-viewport">
        <div className="service-marquee-track">
          {renderGroup(false)}
          {renderGroup(true)}
        </div>
      </div>
    </section>
  )
}
