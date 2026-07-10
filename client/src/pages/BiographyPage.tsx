import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { assetPath } from '../lib/assets'

function BiographyPage() {
  document.title = 'Meet The Owner | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Meet Veronica Lake, founder and owner of BZ Resources, with more than 15 years of staffing-industry experience.',
    )

  return (
    <>
      <PageHero
        eyebrow="Meet The Owner"
        title="About Veronica Lake"
        description="Founder and owner of BZ Resources."
      />

      <section className="section">
        <div className="section-inner two-column owner-layout">
          <Reveal>
            <div className="owner-image-frame">
              <img
                className="owner-image image-contain"
                alt="Veronica Lake, founder and owner of BZ Resources"
                decoding="async"
                height="495"
                loading="lazy"
                src={assetPath('images/site/meet-owner-veronica-lake.png')}
                width="541"
              />
            </div>
          </Reveal>
          <Reveal className="content-panel" delay={1}>
            <p>
              Veronica Lake, our founder and owner, has more than 15 years of
              staffing industry experience. While pursuing her MBA, a Masters in
              Business Administration from National University, which she
              completed with honors, she was the controller for a company that
              was struggling financially.
            </p>
            <p>
              She worked her way up to Chief Financial Officer and was able to
              contribute to the ongoing success of that staffing company.
              Veronica started her career in staffing approximately five years
              ago, and today she and the rest of the BZ Resources team
              specialize in professional staffing solutions for companies that
              want to outsource their HR departments.
            </p>
            <p>
              The team is equipped to support companies of any size, and the
              services are designed to save money by streamlining employee
              management systems. By letting BZ Resources handle the staffing
              side of things, companies can focus on what they do best.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default BiographyPage
