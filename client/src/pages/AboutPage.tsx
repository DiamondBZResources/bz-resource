import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { assetPath } from '../lib/assets'

function AboutPage() {
  document.title = 'About Us | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Learn how BZ Resources supports businesses with staffing, training, HR, risk management, screening, paperwork, and on-site placement support.',
    )

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Our Company"
        description="BZ Resources aims to improve business performance through staffing and training services across the United States."
      />

      <section className="section">
        <div className="section-inner two-column">
          <Reveal className="content-panel">
            <SectionHeading title="Business Solutions">
              <p>
                Running a business is not easy. BZ Resources helps bring
                staffing and employee needs under control so leaders can
                concentrate on common management challenges.
              </p>
            </SectionHeading>
            <p>
              Our company understands human resources laws and employee benefit
              issues. We manage risk, help put the right people in the right
              places, and interview, screen, and verify personnel so employers
              can have confidence in their staff.
            </p>
            <p>
              BZ Resources handles paperwork before, during, and after employee
              placement, and provides on-site placement support. The result is a
              practical staffing partner focused on training, compliance, and
              stronger day-to-day performance.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="feature-image-frame">
              <img
                className="feature-image image-cover"
                alt="BZ Resources staff supporting business staffing needs"
                decoding="async"
                height="630"
                loading="lazy"
                src={assetPath('images/site/about-us-pg-sec-img.jpg')}
                width="750"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default AboutPage
