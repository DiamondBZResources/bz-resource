import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import HeroCarousel from '../components/HeroCarousel'
import ResponsiveImage from '../components/ResponsiveImage'
import WorkforceCarousel from '../components/WorkforceCarousel'
import PillarBand from '../components/PillarBand'
import aboutTeamImage from '../assets/generated/about-team'
import industryImage from '../assets/generated/industry'
import nwbocCertificate from '../assets/generated/nwboc-certificate'
import nwbocLogo from '../assets/generated/nwboc-logo'
import { useLanguage } from '../context/language'
import { corporateOffice } from '../data/navigation'
import { siteContent } from '../data/siteContent'

export default function HomePage() {
  const { language } = useLanguage()
  const copy = siteContent[language].home

  return (
    <>
      <HeroCarousel />

      <section className="trust-strip" aria-label={language === 'es' ? 'Puntos destacados' : 'BZ Resources highlights'}>
        <div className="container-wide trust-strip-grid">
          {copy.trust.map(([title, text], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><small>{text}</small></div>)}
        </div>
      </section>

      <section className="section editorial-split">
        <div className="container-wide editorial-split-grid">
          <div className="editorial-copy">
            <p className="eyebrow">{copy.intro.eyebrow}</p>
            <h2>{copy.intro.title}</h2>
            {copy.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <Link className="text-link" to="/about-us">{copy.intro.link}<FiArrowRight /></Link>
          </div>
          <div className="editorial-image-block">
            <ResponsiveImage alt={language === 'es' ? 'Edificio profesional y palmera' : 'Professional office building and palm tree'} imageClassName="cover-image" sizes="(max-width: 900px) 100vw, 46vw" source={aboutTeamImage} />
            <p>{copy.intro.note}</p>
          </div>
        </div>
      </section>

      <WorkforceCarousel />

      <PillarBand eyebrow={copy.promise.eyebrow} title={copy.promise.title} text={copy.promise.text} items={copy.promise.items} tone="teal" />

      <section className="section process-section">
        <div className="container-wide">
          <div className="section-heading-row">
            <div><p className="eyebrow">{copy.process.eyebrow}</p><h2>{copy.process.title}</h2></div>
          </div>
          <ol className="process-list">
            {copy.process.steps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section audience-section">
        <div className="container-wide">
          <div className="section-heading-row audience-heading">
            <div><p className="eyebrow eyebrow-light">{copy.audiences.eyebrow}</p><h2>{copy.audiences.title}</h2></div>
          </div>
          <div className="audience-grid">
            {[{ ...copy.audiences.employers, href: '/contact' }, { ...copy.audiences.seekers, href: '/forms' }].map((audience) => (
              <article key={audience.label}>
                <p className="audience-label">{audience.label}</p>
                <h3>{audience.title}</h3>
                <p>{audience.text}</p>
                <ul>{audience.items.map((item) => <li key={item}><FiCheck />{item}</li>)}</ul>
                <Link className="button button-outline-light" to={audience.href}>{audience.cta}<FiArrowRight /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section industries-section">
        <div className="container-wide industries-grid">
          <div className="industries-image">
            <ResponsiveImage alt={language === 'es' ? 'Equipo trabajando en un almacén' : 'Team working in a warehouse'} imageClassName="cover-image" sizes="(max-width: 900px) 100vw, 44vw" source={industryImage} />
          </div>
          <div className="industries-copy">
            <p className="eyebrow">{copy.industries.eyebrow}</p>
            <h2>{copy.industries.title}</h2>
            <p>{copy.industries.text}</p>
            <div className="industry-list">{copy.industries.items.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="section reasons-section">
        <div className="container-wide">
          <div className="section-heading-row"><div><p className="eyebrow">{copy.reasons.eyebrow}</p><h2>{copy.reasons.title}</h2></div></div>
          <div className="reason-rows">
            {copy.reasons.items.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section certification-section">
        <div className="container-wide certification-grid">
          <div className="certification-copy">
            <ResponsiveImage alt="NWBOC" imageClassName="nwboc-mark" sizes="220px" source={nwbocLogo} />
            <p className="eyebrow">{copy.certification.eyebrow}</p>
            <h2>{copy.certification.title}</h2>
            <p>{copy.certification.text}</p>
            <Link className="text-link" to="/biography">{copy.certification.link}<FiArrowRight /></Link>
          </div>
          <div className="certificate-frame">
            <ResponsiveImage alt={language === 'es' ? 'Certificación de empresa de mujer de BZ Resources' : 'BZ Resources woman-owned business certification'} sizes="(max-width: 900px) 100vw, 44vw" source={nwbocCertificate} />
          </div>
        </div>
      </section>

      <section className="section offices-section">
        <div className="container-wide">
          <div className="section-heading-row"><div><p className="eyebrow">{copy.offices.eyebrow}</p><h2>{copy.offices.title}</h2></div><p>{copy.offices.text}</p></div>
          <div className="office-feature">
            <div className="office-feature-message">
              <span>{language === 'es' ? 'Apoyo nacional' : 'Nationwide support'}</span>
              <p>{language === 'es' ? 'Servicio laboral receptivo desde una sola sede en Ocala.' : 'Responsive workforce service from one home base in Ocala.'}</p>
            </div>
            <address>
              <span>{corporateOffice.city}</span>
              <strong>{language === 'es' ? corporateOffice.labelEs : corporateOffice.label}</strong>
              {corporateOffice.lines.map((line) => <small key={line}>{line}</small>)}
            </address>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container-wide final-cta-inner">
          <div><p className="eyebrow eyebrow-light">{copy.cta.eyebrow}</p><h2>{copy.cta.title}</h2><p>{copy.cta.text}</p></div>
          <Link className="button button-light" to="/contact">{copy.cta.button}<FiArrowRight /></Link>
        </div>
      </section>
    </>
  )
}
