import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import ResponsiveImage from '../components/ResponsiveImage'
import nwbocCertificate from '../assets/generated/nwboc-certificate'
import { useLanguage } from '../context/language'
import { siteContent } from '../data/siteContent'

export default function WhyBZPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].why
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={siteContent[language].shared.nationwide} />
      <section className="section"><div className="container-wide"><div className="section-heading-row"><div><p className="eyebrow">{copy.intro[0]}</p><h2>{copy.intro[1]}</h2></div></div>
        <div className="why-list">{copy.reasons.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>
      <section className="section why-audience-section"><div className="container-wide"><div className="section-heading-row"><div><p className="eyebrow">{copy.audiences.eyebrow}</p><h2>{copy.audiences.title}</h2></div><p>{copy.audiences.text}</p></div><div className="why-audience-grid">{copy.audiences.items.map(([label, title, text], index) => <article key={label}><span>{String(index + 1).padStart(2, '0')}</span><p className="eyebrow">{label}</p><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="section section-ink"><div className="container-wide relationship-feature"><div><p className="eyebrow eyebrow-light">{language === 'es' ? 'Continuidad' : 'Continuity'}</p><h2>{copy.relationship[0]}</h2></div><p>{copy.relationship[1]}</p></div></section>
      <section className="section why-certification-section"><div className="container-wide why-certification"><div><p className="eyebrow">NWBOC</p><h2>{copy.close[0]}</h2><Link className="button" to="/contact">{copy.close[1]}<FiArrowRight /></Link></div><ResponsiveImage alt={language === 'es' ? 'Certificación NWBOC de BZ Resources' : 'BZ Resources NWBOC certification'} pictureClassName="why-certificate-frame" sizes="(max-width: 640px) 300px, (max-width: 900px) 380px, 420px" source={nwbocCertificate} /></div></section>
    </>
  )
}
