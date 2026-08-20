import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import ResponsiveImage from '../components/ResponsiveImage'
import PillarBand from '../components/PillarBand'
import { useLanguage } from '../context/language'
import { services } from '../data/services'
import { siteContent } from '../data/siteContent'

export default function ServicesPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].services
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={siteContent[language].shared.fullService} />
      <section className="section services-intro"><div className="container-wide section-heading-row"><div><p className="eyebrow">{copy.intro[0]}</p><h2>{copy.intro[1]}</h2></div><p>{copy.intro[2]}</p></div></section>
      <PillarBand eyebrow={copy.integration.eyebrow} title={copy.integration.title} text={copy.integration.text} items={copy.integration.items} />
      <section className="service-detail-section">
        <div className="container-wide service-detail-list">
          {services.map((service, index) => {
            const title = language === 'es' ? service.titleEs : service.title
            const description = language === 'es' ? service.descriptionEs : service.description
            const help = language === 'es' ? service.employerHelpEs : service.employerHelp
            return (
              <article className="service-detail-row" key={service.title}>
                <div className="service-detail-image"><ResponsiveImage alt={language === 'es' ? service.altEs : service.alt} imageClassName="cover-image" sizes="(max-width: 900px) 100vw, 45vw" source={service.image} /></div>
                <div className="service-detail-copy"><span className="service-number">{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{description}</p><div className="employer-help"><strong>{copy.employerLabel}</strong><p>{help}</p></div></div>
              </article>
            )
          })}
        </div>
      </section>
      <section className="final-cta"><div className="container-wide final-cta-inner"><div><p className="eyebrow eyebrow-light">{copy.cta[0]}</p><h2>{copy.cta[1]}</h2></div><Link className="button button-light" to="/contact">{copy.cta[2]}<FiArrowRight /></Link></div></section>
    </>
  )
}
