import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck, FiFileText, FiShield, FiUserCheck } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import FinalCta from '../components/FinalCta'
import { useLanguage } from '../context/language'
import { siteContent } from '../data/siteContent'

export default function FormsPage() {
  const { language } = useLanguage()
  const copy = siteContent[language].forms
  const es = language === 'es'
  const choices = [
    {
      copy: copy.applicant,
      icon: FiFileText,
      kicker: es ? 'Para candidatos' : 'For applicants',
      slug: 'applicant-questionnaire',
      features: es
        ? ['Comparta su experiencia y disponibilidad', 'Complete el formulario en inglés o español', 'Envíelo mediante nuestro proceso seguro']
        : ['Share your experience and availability', 'Complete the form in English or Spanish', 'Submit through our secure online process'],
    },
    {
      copy: copy.newHire,
      icon: FiUserCheck,
      kicker: es ? 'Para nuevos empleados invitados' : 'For invited new hires',
      slug: 'new-hire-application',
      features: es
        ? ['Proporcione la información solicitada', 'Complete el paquete solo cuando se le indique', 'Elija su idioma preferido']
        : ['Provide the requested onboarding information', 'Complete the packet only when instructed', 'Choose your preferred language'],
    },
  ]
  return (
    <>
      <PageHero eyebrow={copy.hero[0]} title={copy.hero[1]} text={copy.hero[2]} meta={es ? 'Inglés • Español • Envío seguro' : 'English • Español • Secure online'} />
      <section className="section forms-choice-section">
        <div className="container-wide forms-intro">
          <FiShield aria-hidden="true" />
          <div><strong>{es ? 'Antes de comenzar' : 'Before you begin'}</strong><p>{copy.caution}</p></div>
        </div>
        <div className="container-wide form-choice-list">
          {choices.map(({ copy: item, features, icon: Icon, kicker, slug }, index) => {
            const [title, text] = item
            return <article key={slug}>
              <div className="form-choice-topline"><span>{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /></div>
              <p className="form-choice-kicker">{kicker}</p>
              <h2>{title}</h2>
              <p className="form-choice-description">{text}</p>
              <ul>{features.map((feature) => <li key={feature}><FiCheck aria-hidden="true" />{feature}</li>)}</ul>
              <div className="form-choice-footer">
                <span>{es ? 'Seleccione un idioma' : 'Choose a language'}</span>
                <div className="language-actions">
                  <Link className="button" to={`/forms/${slug}/en`}>English <FiArrowRight /></Link>
                  <Link className="button button-outline" to={`/forms/${slug}/es`}>Español <FiArrowRight /></Link>
                </div>
              </div>
            </article>
          })}
        </div>
      </section>
      <FinalCta copy={copy.cta} />
    </>
  )
}
