import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { requestProposalUrl } from '../data/navigation'
import { services } from '../data/services'
import { assetPath } from '../lib/assets'

const trustPoints = [
  {
    marker: '01',
    title: 'Woman-owned business',
    detail: 'NWBOC certified',
  },
  {
    marker: '02',
    title: 'Nationwide support',
    detail: 'Including Hawaii and Alaska',
  },
  {
    marker: '03',
    title: 'Full-service approach',
    detail: 'From recruiting through administration',
  },
]

const advantages = [
  {
    title: 'A practical partner',
    text: 'Support shaped around each employer’s staffing, HR, and workforce needs.',
  },
  {
    title: 'Careful candidate screening',
    text: 'Qualifications, skills, and fit are assessed before candidates are presented.',
  },
  {
    title: 'Responsive follow-through',
    text: 'BZ Resources stays involved before, during, and after employee placement.',
  },
]

function HomePage() {
  document.title = 'BZ Resources | Staffing and Workforce Solutions'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'BZ Resources provides staffing, recruitment, payroll, screening, training, tracking, and workforce support.',
    )

  return (
    <>
      <Hero />

      <section className="trust-strip" aria-label="BZ Resources highlights">
        <div className="section-inner trust-grid">
          {trustPoints.map((point) => (
            <div className="trust-item" key={point.title}>
              <span className="trust-number" aria-hidden="true">
                {point.marker}
              </span>
              <div>
                <strong>{point.title}</strong>
                <span>{point.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="welcome-section section">
        <div className="welcome-grid">
          <Reveal className="welcome-copy">
            <p className="eyebrow">A clearer path to the right team</p>
            <h2>Workforce support built around your business</h2>
            <p>
              BZ Resources connects businesses with candidates suited to their
              needs. Our team supports sourcing, screening, interviewing, and
              placement so employers can stay focused on running and growing
              their organization.
            </p>
            <p>
              We also help job seekers connect with opportunities that fit
              their experience and qualifications, creating a more thoughtful
              match on both sides.
            </p>
            <div className="home-actions">
              <Link className="button" to="/about-us">
                Get to Know BZ
              </Link>
              <Link className="button button-outline" to="/why-choose-bz">
                Why Choose BZ
              </Link>
            </div>
          </Reveal>
          <Reveal className="welcome-image-column" delay={1}>
            <div className="welcome-image-frame">
              <img
                className="image-cover"
                alt="Professionals collaborating around a workplace table"
                decoding="async"
                height="4480"
                loading="lazy"
                src={assetPath('images/largeImageForMain.jpg')}
                width="6720"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Services"
            title="Support at every stage of the workforce journey"
          >
            <p>
              From finding the right candidate to supporting payroll and
              workforce administration, each service is designed to remove
              friction from day-to-day people operations.
            </p>
          </SectionHeading>

          <div className="service-grid">
            {services.map((service, index) => (
              <Reveal
                as="article"
                className="service-card"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                key={service.title}
              >
                <div className="service-image-wrap">
                  <img
                    className="image-cover"
                    src={service.image}
                    alt={service.alt}
                    decoding="async"
                    height={service.height}
                    loading="lazy"
                    width={service.width}
                  />
                </div>
                <div className="service-card-body">
                  <h3>{service.title}</h3>
                  <p>{service.description.split('.')[0]}.</p>
                  <Link className="text-link" to="/services">
                    Learn more
                    <span className="sr-only"> about {service.title}</span>
                    <span aria-hidden="true">&nbsp;→</span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="home-actions" delay={1}>
            <Link className="button" to="/services">
              Explore All Services
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Why businesses choose BZ"
            title="Experienced support. Personal attention."
          >
            <p>
              BZ Resources brings staffing and employee needs under control
              through clear communication, careful screening, and hands-on
              placement support.
            </p>
          </SectionHeading>
          <div className="advantage-grid home-advantage-grid">
            {advantages.map((advantage, index) => (
              <Reveal
                as="article"
                className="advantage-card"
                delay={index as 0 | 1 | 2}
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

      <section className="section section-blue">
        <div className="section-inner">
          <SectionHeading
            eyebrow="How we can help"
            title="Choose the path that fits your next step"
          />
          <div className="pathway-grid">
            <Reveal as="article" className="pathway-card">
              <p className="eyebrow">For employers</p>
              <h2>Build a stronger team</h2>
              <p>
                Tell us about the people and workforce support your business
                needs. We will help you identify the right next step.
              </p>
              <a
                className="button"
                href={requestProposalUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Request a Proposal
              </a>
            </Reveal>
            <Reveal as="article" className="pathway-card" delay={1}>
              <p className="eyebrow">For job seekers</p>
              <h2>Find your next opportunity</h2>
              <p>
                Start with the applicant questionnaire or new hire forms to
                connect your experience with available opportunities.
              </p>
              <Link className="button" to="/forms">
                View Applicant Forms
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <Reveal className="certification-card">
            <div className="certification-image">
              <img
                className="image-contain"
                alt="BZ Resources NWBOC woman-owned business certification"
                decoding="async"
                loading="lazy"
                src={assetPath('images/NWBOCCertifwomenowned.jpg')}
              />
            </div>
            <div className="certification-copy">
              <p className="eyebrow">Certified woman-owned business</p>
              <h2>Professional service with a personal foundation</h2>
              <p>
                BZ Resources is certified as a Woman Business Enterprise by the
                National Women Business Owners Corporation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CallToAction
        title="Ready to talk about your staffing needs?"
        text="Connect with BZ Resources for recruitment, screening, payroll, training, tracking, and workforce administration support."
        linkLabel="Contact BZ Resources"
        to="/contact"
      />
    </>
  )
}

export default HomePage
