import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiDownload } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import FinalCta from '../components/FinalCta'
import { useLanguage } from '../context/language'
import { siteContent } from '../data/siteContent'

export default function ResourcesPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].resources
  const brochureOutside = `${import.meta.env.BASE_URL}resources/BZR-Outside-Brochure.pdf`
  const brochureInside = `${import.meta.env.BASE_URL}resources/BZR-Inside-Brochure.pdf`
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={language === 'es' ? 'Para empleadores y candidatos' : 'For employers and job seekers'} />
      <section className="section"><div className="container-wide resource-list">
        {copy.items.map(([title, text, label, href], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h2>{title}</h2><p>{text}</p></div>
            {href === 'brochure' ? <div className="resource-downloads"><a href={brochureOutside} target="_blank" rel="noreferrer">{label}<FiDownload /></a><a href={brochureInside} target="_blank" rel="noreferrer">{language === 'es' ? 'Ver interior' : 'View inside'}<FiArrowUpRight /></a></div> : <Link className="text-link" to={href}>{label}<FiArrowUpRight /></Link>}
          </article>
        ))}
      </div></section>
      <FinalCta copy={copy.cta} />
    </>
  )
}
