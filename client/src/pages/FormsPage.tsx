import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const formGroups = [
  {
    eyebrow: 'Before placement',
    title: 'Applicant Questionnaire',
    description:
      'Tell BZ Resources about your availability, preferred shifts, work environment preferences, equipment, and relevant experience.',
    meta: ['About 8–12 minutes', 'Four guided steps', 'English or Spanish'],
    paths: {
      en: '/forms/applicant-questionnaire/en',
      es: '/forms/applicant-questionnaire/es',
    },
  },
  {
    eyebrow: 'After hiring instructions',
    title: 'New Hire Application',
    description:
      'Complete the guided employee application, orientation checklist, skills inventory, policy acknowledgments, safety review, and final packet summary.',
    meta: ['Multi-step onboarding', 'Progress guidance', 'English or Spanish'],
    paths: {
      en: '/forms/new-hire-application/en',
      es: '/forms/new-hire-application/es',
    },
  },
]

function FormsPage() {
  document.title = 'Forms | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Complete BZ Resources applicant questionnaires and new hire onboarding forms in English or Spanish.',
    )

  return (
    <>
      <PageHero
        eyebrow="Application Center"
        title="Applicant and New Hire Forms"
        description="Complete the right form directly within the BZ Resources website. Each form includes clear steps, progress guidance, review tools, and English or Spanish options."
      />

      <section className="section forms-section">
        <div className="section-inner forms-intro-grid">
          <div>
            <p className="eyebrow">Choose your next step</p>
            <h2>One clear application center</h2>
          </div>
          <p>
            Start with the Applicant Questionnaire when exploring placement opportunities.
            Complete the New Hire Application only after a BZ Resources representative asks
            you to begin onboarding.
          </p>
        </div>

        <div className="section-inner forms-grid forms-modern-grid">
          {formGroups.map((group, index) => (
            <Reveal
              as="article"
              className="form-card form-portal-card"
              delay={(index % 4) as 0 | 1 | 2 | 3}
              key={group.title}
            >
              <div className="form-portal-number" aria-hidden="true">0{index + 1}</div>
              <div className="form-portal-body">
                <p className="eyebrow">{group.eyebrow}</p>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
                <ul className="form-meta-list">
                  {group.meta.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="form-language-actions">
                  <Link className="button" to={group.paths.en}>Start in English</Link>
                  <Link className="button button-outline-dark" to={group.paths.es}>Comenzar en Español</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="section-inner forms-security-note">
          <div>
            <strong>Protecting applicant information</strong>
            <p>
              Do not enter Social Security numbers, banking details, medical records, or
              identity-document numbers into the public website forms. BZ Resources will
              provide a separate approved process when sensitive onboarding documents are required.
              Attachments and file uploads are disabled on these public forms.
            </p>
          </div>
        </div>
      </section>

      <CallToAction
        title="Not sure which form applies to you?"
        text="Contact BZ Resources before completing a new hire packet or when you need help with any application question."
        linkLabel="Contact BZ Resources"
        to="/contact"
      />
    </>
  )
}

export default FormsPage
