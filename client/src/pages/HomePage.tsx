import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { requestProposalUrl } from '../data/navigation'
import { services } from '../data/services'
import { assetPath } from '../lib/assets'

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

      <section className="welcome-section section">
        <div className="welcome-grid">
          <Reveal className="welcome-copy">
            <p className="eyebrow">Welcome</p>
            <h2>Welcome to BZ Resources</h2>
            <p>
              In today’s competitive business environment, effective HR
              management is vital for sustainable growth. BZ Resources supports
              employers with staffing, hiring, training, payroll, and employee
              relations needs so teams can focus on moving their business
              forward.
            </p>
            <p>
              As a specialized staffing agency, we connect businesses with
              candidates suited to their needs. Our team handles sourcing,
              screening, interviewing, and placement support while helping job
              seekers connect with employment opportunities that fit their
              experience and qualifications.
            </p>
            <div className="welcome-certification">
              <img
                className="image-contain"
                alt="BZ Resources certified woman-owned business certificate"
                decoding="async"
                loading="lazy"
                src={assetPath('images/NWBOCCertifwomenowned.jpg')}
              />
            </div>
          </Reveal>
          <Reveal className="welcome-image-column" delay={1}>
            <div className="welcome-image-frame">
              <img
                className="image-cover"
                alt="Professional women working together in a business setting"
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

      <section className="services-section section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Services"
            title="Premier Placement & Recruitment Services"
          >
            <p>
              BZ Resources helps employers manage recruiting, screening,
              training, tracking, payroll, and workers compensation support with
              practical service and responsive follow-through.
            </p>
          </SectionHeading>

          <div className="service-grid">
            {services.map((service, index) => (
              <Reveal
                as="article"
                aria-label={`${service.title} service`}
                className="service-card"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                key={service.title}
                tabIndex={0}
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
                <div className="service-card-title">
                  <h3>{service.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="home-actions" delay={1}>
            <Link className="button" to="/services">
              Explore Services
            </Link>
            <a className="button button-outline" href={requestProposalUrl} rel="noreferrer" target="_blank">
              Request for Proposal
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default HomePage
