import PageHero from '../components/PageHero'
import FinalCta from '../components/FinalCta'
import { useLanguage } from '../context/language'
import { siteContent } from '../data/siteContent'

export default function BiographyPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].biography
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={siteContent[language].shared.womanOwned} />
      <section className="section"><div className="container-wide biography-layout">
        <div className="biography-main"><p className="eyebrow">{copy.intro[0]}</p><h2>{copy.intro[1]}</h2><p>{copy.intro[2]}</p><blockquote>{copy.quote}</blockquote><p className="eyebrow biography-approach-label">{copy.approach[0]}</p><h3>{copy.approach[1]}</h3><p>{copy.approach[2]}</p></div>
        <aside className="biography-facts"><p>{language === 'es' ? 'Experiencia y liderazgo' : 'Experience & leadership'}</p>{copy.credentials.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</aside>
      </div></section>
      <FinalCta copy={copy.cta} />
    </>
  )
}
