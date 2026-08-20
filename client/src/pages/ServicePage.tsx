import { Link, Navigate, useParams } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import FinalCta from '../components/FinalCta'
import PageHero from '../components/PageHero'
import ResponsiveImage from '../components/ResponsiveImage'
import { useLanguage } from '../context/language'
import { relatedServices, servicePageContent } from '../data/servicePages'
import { getServiceBySlug, getServicePath, services } from '../data/services'
import useDocumentMetadata from '../hooks/useDocumentMetadata'

function ServicePageContent({ serviceSlug }: { serviceSlug: keyof typeof servicePageContent }) {
  const { language } = useLanguage()
  const service = getServiceBySlug(serviceSlug)!
  const copy = servicePageContent[serviceSlug][language]
  const related = relatedServices[serviceSlug]
    .map((slug) => services.find((item) => item.slug === slug))
    .filter((item): item is (typeof services)[number] => Boolean(item))

  useDocumentMetadata(copy.metaTitle, copy.metaDescription)

  return (
    <>
      <PageHero eyebrow={copy.hero.eyebrow} title={copy.hero.title} text={copy.hero.intro} meta={copy.hero.meta} />

      <section className="section service-landing-overview">
        <div className="container-wide service-landing-overview-grid">
          <figure className="service-landing-figure">
            <div className="service-landing-image service-image-frame">
              <ResponsiveImage
                alt={language === 'es' ? service.altEs : service.alt}
                imageClassName="cover-image"
                sizes="(max-width: 900px) 100vw, 46vw"
                source={service.image}
              />
            </div>
            <figcaption>{copy.overview.caption}</figcaption>
          </figure>
          <div className="service-landing-copy">
            <p className="eyebrow">{copy.overview.eyebrow}</p>
            <h2>{copy.overview.title}</h2>
            {copy.overview.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <Link className="button button-outline" to="/contact">{copy.cta[3]}<FiArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="section section-soft service-includes-section">
        <div className="container-wide">
          <div className="section-heading-row">
            <div><p className="eyebrow">{copy.includes.eyebrow}</p><h2>{copy.includes.title}</h2></div>
            <p>{copy.includes.text}</p>
          </div>
          <div className="service-inclusion-list">
            {copy.includes.items.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ink service-employer-section">
        <div className="container-wide service-employer-grid">
          <div>
            <p className="eyebrow eyebrow-light">{copy.employer.eyebrow}</p>
            <h2>{copy.employer.title}</h2>
            <p>{copy.employer.text}</p>
          </div>
          <ul>
            {copy.employer.points.map((point) => <li key={point}><FiCheck />{point}</li>)}
          </ul>
        </div>
      </section>

      <section className="section service-approach-section">
        <div className="container-wide">
          <div className="service-approach-intro">
            <div><p className="eyebrow">{copy.process.eyebrow}</p><h2>{copy.process.title}</h2></div>
            <p>{copy.process.text}</p>
          </div>
          <ol className="service-approach-steps">
            {copy.process.steps.map(([title, text], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section service-related-section">
        <div className="container-wide">
          <div className="service-related-heading">
            <p className="eyebrow">{copy.related.eyebrow}</p>
            <h2>{copy.related.title}</h2>
          </div>
          <div className="service-related-grid">
            {related.map((item, index) => (
              <Link key={item.slug} to={getServicePath(item)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{language === 'es' ? item.titleEs : item.title}</h3>
                <small>{copy.related.linkLabel}<FiArrowRight /></small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta copy={copy.cta} />
    </>
  )
}

export default function ServicePage() {
  const { serviceSlug } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service || !(service.slug in servicePageContent)) return <Navigate replace to="/services" />
  return <ServicePageContent serviceSlug={service.slug} />
}
