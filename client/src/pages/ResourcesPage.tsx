import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { assetPath } from '../lib/assets'

const brochures = [
  {
    title: 'BZR Outside Brochure',
    fileType: 'PDF',
    href: assetPath('resources/BZR-Outside-Brochure.pdf'),
    image: assetPath('images/site/BZR-Outside-Brochure_page-0001.jpg'),
  },
  {
    title: 'BZR Inside Brochure',
    fileType: 'PDF',
    href: assetPath('resources/BZR-Inside-Brochure.pdf'),
    image: assetPath('images/site/BZR-Inside-Brochure_page-0001.jpg'),
  },
]

function ResourcesPage() {
  document.title = 'Resources | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Download BZ Resources brochure materials for staffing and workforce support.',
    )

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Brochure"
        description="Public BZ Resources brochure materials, stored locally for reliable access."
      />

      <section className="section">
        <div className="section-inner resource-grid">
          {brochures.map((brochure, index) => (
            <Reveal
              as="article"
              className="resource-card"
              delay={(index % 4) as 0 | 1 | 2 | 3}
              key={brochure.href}
            >
              <div className="card-image-frame">
                <img
                  className="image-cover"
                  src={brochure.image}
                  alt=""
                  decoding="async"
                  height="1294"
                  loading="lazy"
                  width="1667"
                />
              </div>
              <div>
                <p className="eyebrow">{brochure.fileType}</p>
                <h2>{brochure.title}</h2>
                <a className="button" download href={brochure.href}>
                  Download PDF
                </a>
                <a className="text-link" href={brochure.href} target="_blank">
                  Open in browser
                  <span className="sr-only">, opens in a new tab</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

export default ResourcesPage
