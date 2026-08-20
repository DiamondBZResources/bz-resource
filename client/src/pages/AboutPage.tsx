import ResponsiveImage from '../components/ResponsiveImage'
import PageHero from '../components/PageHero'
import PillarBand from '../components/PillarBand'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import aboutTeamImage from '../assets/generated/about-team'
import industryImage from '../assets/generated/industry'
import nwbocLogo from '../assets/generated/nwboc-logo'
import { useLanguage } from '../context/language'
import { officeLocations } from '../data/navigation'
import { siteContent } from '../data/siteContent'

export default function AboutPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].about
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={siteContent[language].shared.womanOwned} />
      <section className="section"><div className="container-wide content-split">
        <div className="content-copy"><p className="eyebrow">{copy.intro[0]}</p><h2>{copy.intro[1]}</h2><p>{copy.intro[2]}</p></div>
        <ResponsiveImage alt={language === 'es' ? 'Edificio de oficinas moderno' : 'Modern office building'} imageClassName="cover-image" pictureClassName="content-image" sizes="(max-width: 900px) 100vw, 46vw" source={aboutTeamImage} />
      </div></section>
      <section className="section section-soft"><div className="container-wide philosophy-grid">
        <div><p className="eyebrow">{copy.philosophy[0]}</p><h2>{copy.philosophy[1]}</h2></div>
        <p>{copy.philosophy[2]}</p>
      </div><div className="container-wide capability-list">{copy.capabilities.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div></section>
      <PillarBand eyebrow={copy.partnership.eyebrow} title={copy.partnership.title} text={copy.partnership.text} items={copy.partnership.items} tone="teal" />
      <section className="section"><div className="container-wide relationship-grid">
        {copy.relationships.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{text}</p></article>)}
      </div></section>
      <section className="wide-image-copy">
        <div className="wide-image"><ResponsiveImage alt={language === 'es' ? 'Equipo en un centro logístico' : 'Team in a logistics facility'} imageClassName="cover-image" sizes="(max-width: 900px) 100vw, 50vw" source={industryImage} /></div>
        <div className="wide-copy"><p className="eyebrow eyebrow-light">{copy.nationwide[0]}</p><h2>{copy.nationwide[1]}</h2><p>{copy.nationwide[2]}</p><div className="mini-office-list">{officeLocations.map((office) => <span key={office.label}>{language === 'es' ? office.labelEs : office.label}</span>)}</div></div>
      </section>
      <section className="section"><div className="container-wide certification-summary">
        <ResponsiveImage alt="NWBOC" imageClassName="nwboc-mark" sizes="220px" source={nwbocLogo} />
        <div><p className="eyebrow">{copy.certification[0]}</p><h2>{copy.certification[1]}</h2><p>{copy.certification[2]}</p></div>
      </div></section>
      <section className="final-cta"><div className="container-wide final-cta-inner"><div><p className="eyebrow eyebrow-light">{copy.cta[0]}</p><h2>{copy.cta[1]}</h2><p>{copy.cta[2]}</p></div><Link className="button button-light" to="/contact">{copy.cta[3]}<FiArrowRight /></Link></div></section>
    </>
  )
}
