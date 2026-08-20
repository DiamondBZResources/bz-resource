import ContactForm from '../components/ContactForm'
import PageHero from '../components/PageHero'
import { useLanguage } from '../context/language'
import { contactEmail, officeLocations, phoneDisplay, phoneHref } from '../data/navigation'
import { siteContent } from '../data/siteContent'

export default function ContactPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].contact
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta="(800) 418-6889" />
      <section className="section"><div className="container-wide contact-layout">
        <div className="contact-information">
          <p className="eyebrow">{copy.intro[0]}</p><h2>{copy.intro[1]}</h2><p>{copy.intro[2]}</p>
          <div className="contact-links"><a href={phoneHref}>{phoneDisplay}</a><a href={`mailto:${contactEmail}`}>{contactEmail}</a><span>{copy.hours}</span></div>
          <h3>{copy.offices}</h3>
          <div className="contact-office-list">{officeLocations.map((office) => <address key={office.label}><strong>{language === 'es' ? office.labelEs : office.label}</strong>{office.lines.map((line) => <span key={line}>{line}</span>)}</address>)}</div>
        </div>
        <div className="contact-form-panel"><p className="eyebrow">{copy.formEyebrow}</p><h2>{copy.formTitle}</h2><ContactForm /></div>
      </div></section>
    </>
  )
}
