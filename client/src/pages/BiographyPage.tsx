import ownerVeronica from '../assets/generated/owner-veronica'
import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import ResponsiveImage from '../components/ResponsiveImage'

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

      <section className="section section-soft">
        <div className="section-inner two-column owner-layout">
          <Reveal>
            <div className="owner-image-frame">
              <ResponsiveImage
                alt="Veronica Lake, founder and owner of BZ Resources"
                imageClassName="owner-image image-contain"
                sizes="(max-width: 760px) calc(100vw - 32px), 540px"
                source={ownerVeronica}
              />
            </div>
          </Reveal>
          <Reveal className="content-panel editorial-copy" delay={1}>
            <p className="eyebrow">Leadership grounded in experience</p>
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
            <blockquote className="pull-quote">
              BZ Resources is built to help companies simplify employee
              management and stay focused on their core business.
            </blockquote>
          </Reveal>
        </div>
      </section>

      <CallToAction
        title="Meet the team behind your staffing support"
        text="Connect with BZ Resources to discuss your workforce priorities and the services that fit your organization."
        linkLabel="Contact BZ Resources"
        to="/contact"
      />
    </>
  )
}

export default BiographyPage
