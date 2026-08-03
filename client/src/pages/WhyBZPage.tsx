import industryImage from '../assets/generated/industry'
import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import ResponsiveImage from '../components/ResponsiveImage'
import SectionHeading from '../components/SectionHeading'

const advantages = [
  {
    title: 'Extensive Network of Employers',
    text: 'Connections across the industries and service areas BZ Resources supports.',
  },
  {
    title: 'Personalized Job Matches',
    text: 'Opportunities considered in light of each candidate’s experience and qualifications.',
  },
  {
    title: 'Expert Career Guidance',
    text: 'Clear support for job seekers as they navigate available opportunities.',
  },
  {
    title: 'Application to Placement Support',
    text: 'Hands-on guidance throughout the staffing and placement process.',
  },
]

const industries = [
  'Logistics',
  'Healthcare',
  'Administration',
  'Finance',
  'Information Technology',
  'Customer Service',
  'Sales & Marketing',
]

function WhyBZPage() {
  document.title = 'Why Choose BZ-Resources | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'See why BZ Resources is a staffing partner for employers and job seekers across logistics, healthcare, administration, finance, IT, customer service, and sales.',
    )

  return (
    <>
      <PageHero
        eyebrow="Why Choose BZ-Resources"
        title="Why Choose Us?"
        description="BZ Resources bridges the gap between employers and qualified job seekers with personalized staffing support."
      />

      <section className="section">
        <div className="section-inner">
          <div className="advantage-grid">
            {advantages.map((advantage, index) => (
              <Reveal
                as="article"
                className="advantage-card"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                key={advantage.title}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{advantage.title}</h2>
                <p>{advantage.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section split-dark">
        <div className="section-inner two-column">
          <Reveal className="split-dark-copy">
            <SectionHeading title="Your Partner in Staffing Success" />
            <p>
              At BZ-Resources, finding the right talent or career opportunity
              can be a daunting task. That is why the team is committed to
              bridging the gap between top employers and qualified job seekers
              through personalized staffing solutions that drive success.
            </p>
            <p>
              With a deep understanding of the job market and a focus on
              long-term relationships, BZ Resources works to deliver results
              that exceed expectations. Whether you are an employer expanding a
              team or a job seeker ready for the next opportunity, BZ Resources
              is a trusted partner in the journey.
            </p>
          </Reveal>
          <Reveal className="split-dark-media" delay={1}>
            <div className="feature-image-frame">
              <ResponsiveImage
                alt="Warehouse shelves representing industries served"
                imageClassName="feature-image image-cover"
                sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1050px) 46vw, 620px"
                source={industryImage}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Industries"
            title="Industries We Serve"
          >
            <p>We specialize in placements across various sectors, including:</p>
          </SectionHeading>
          <div className="industry-grid">
            {industries.map((industry, index) => (
              <Reveal
                as="article"
                className="industry-card"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                key={industry}
              >
                <h2>{industry}</h2>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        title="Speak With Our Staffing Experts To Discover How We Can Help You"
        text="Connect with BZ Resources to talk through your staffing needs."
        linkLabel="Contact Us"
        to="/contact"
      />
    </>
  )
}

export default WhyBZPage
