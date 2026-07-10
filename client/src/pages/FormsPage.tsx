import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { assetPath } from '../lib/assets'

const formGroups = [
  {
    title: 'Applicant Questionnaire',
    description: 'Public applicant questionnaire forms from the current site.',
    links: [
      {
        label: 'Applicant Questionnaire',
        href: 'https://bz-resources.com/applicant-questionnaire/',
      },
      {
        label: 'English',
        href: 'https://bz-resources.com/applicant-questionnaire-english/',
      },
      {
        label: 'Spanish',
        href: 'https://bz-resources.com/applicant-questionnaire-spanish/',
      },
    ],
  },
  {
    title: 'New Hire Application',
    description: 'Public new hire application forms from the current site.',
    links: [
      {
        label: 'New Hire Application',
        href: 'https://bz-resources.com/new-hire-application/',
      },
      {
        label: 'English',
        href: 'https://bz-resources.com/new-hire-applications/',
      },
      {
        label: 'Spanish',
        href: 'https://bz-resources.com/new-hire-application-spanish/',
      },
    ],
  },
]

function FormsPage() {
  document.title = 'Forms | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Access BZ Resources applicant questionnaire and new hire application form links.',
    )

  return (
    <>
      <PageHero
        eyebrow="Forms"
        title="Applicant and New Hire Forms"
        description="Choose the appropriate public form destination below."
      />

      <section className="section forms-section">
        <div className="section-inner forms-grid">
          {formGroups.map((group, index) => (
            <Reveal
              as="article"
              className="form-card"
              delay={(index % 4) as 0 | 1 | 2 | 3}
              key={group.title}
            >
              <div className="card-image-frame">
                <img
                  className="image-contain"
                  alt=""
                  decoding="async"
                  height="460"
                  loading="lazy"
                  src={assetPath('images/site/bz-resources-folder.png')}
                  width="512"
                />
              </div>
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
                <div className="form-links">
                  {group.links.map((link) => (
                    <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                      <span className="sr-only">, opens on the current public site</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

export default FormsPage
