import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import ResponsiveImage from '../components/ResponsiveImage'
import SectionHeading from '../components/SectionHeading'
import { services } from '../data/services'

function ServicesPage() {
  document.title = 'Services | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Explore BZ Resources services for recruiting, screening, training, tracking, payroll, workers compensation, compliance, and employment administration.',
    )

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Premier Placement & Recruitment Services"
        description="Staffing and employment administration support for employers who need qualified people and dependable HR process support."
      />

      <section className="section">
        <Reveal className="section-inner content-panel wide">
          <p>
            BZ Resources understands human resources laws and employee benefit
            issues. We manage risk and put the right people in the right places.
            We interview, screen, verify, and train personnel so employers can
            have confidence in their workforce.
          </p>
          <p>
            BZ Resources takes care of paperwork before, during, and after
            placement services, and supports employers on site. Employment
            administration services give businesses freedom to focus on
            productivity and profitability, while staffing management solutions
            improve compliance, risk management, liabilities, payroll
            administration, and access to competitive benefits.
          </p>
        </Reveal>
      </section>

      <section className="section services-detail-section section-soft">
        <div className="section-inner">
          <SectionHeading title="Full Service Support" />
          <div className="service-detail-list">
            {services.map((service, index) => (
              <Reveal
                as="article"
                className="service-detail"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                id={service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                key={service.title}
              >
                <div className="service-detail-image-frame">
                  <ResponsiveImage
                    alt={service.alt}
                    imageClassName="image-cover"
                    sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1050px) 46vw, 560px"
                    source={service.image}
                  />
                </div>
                <div>
                  <p className="eyebrow">0{index + 1}</p>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        title="Need a workforce solution shaped around your business?"
        text="Talk with BZ Resources about staffing, recruitment, payroll, screening, training, tracking, or workers compensation support."
        linkLabel="Start a Conversation"
        to="/contact"
      />
    </>
  )
}

export default ServicesPage
