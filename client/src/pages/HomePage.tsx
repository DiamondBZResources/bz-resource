import Footer from '../components/Footer'
import Header from '../components/Header'
import Hero from '../components/Hero'

const services = [
  {
    title: 'Recruitment',
    image: '/images/Recruitment.jpg',
    description:
      'Source, screen, and place candidates who match the work, schedule, and culture.',
  },
  {
    title: 'Payroll',
    image: '/images/payroll.jpg',
    description:
      'Keep workforce administration organized with reliable payroll support.',
  },
  {
    title: 'Screening',
    image: '/images/screening.jpg',
    description:
      'Support better hiring decisions with practical pre-employment screening.',
  },
  {
    title: 'Training',
    image: '/images/training.jpg',
    description:
      'Prepare teams with training resources that help employees contribute faster.',
  },
  {
    title: 'Tracking',
    image: '/images/tracking.jpg',
    description:
      'Track placements, workforce activity, and staffing needs with clear follow-through.',
  },
  {
    title: 'Workers Compensation',
    image: '/images/workersComp.jpg',
    description:
      'Coordinate workers compensation support as part of a complete staffing program.',
  },
]

const values = [
  {
    title: 'People-first placement',
    description:
      'We look beyond resumes to match the right person with the right opportunity.',
  },
  {
    title: 'Employer-ready support',
    description:
      'From recruiting to payroll details, our services are built for busy teams.',
  },
  {
    title: 'Accountable follow-through',
    description:
      'Clear communication and consistent tracking keep every engagement moving.',
  },
]

const industries = [
  ['Administrative', 'Office support, clerical roles, and business operations.'],
  ['Industrial', 'Reliable talent for production, warehouse, and logistics teams.'],
  ['Professional', 'Skilled support for growing organizations and special projects.'],
  ['Customer Support', 'Service-minded candidates for customer-facing work.'],
]

function HomePage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />

        <section className="section" id="services">
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Staffing services</p>
                <h2>Everything needed to build and support a dependable team.</h2>
              </div>
              <p>
                BZ Resources helps employers move from open role to ready team
                member with staffing services that stay practical, personal, and
                organized.
              </p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <img src={service.image} alt="" />
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section tint" id="about">
          <div className="section-inner split-section">
            <div className="image-panel">
              <img src="/images/satisfyAllYourStaffing.jpg" alt="" />
              <div className="cert-badge" aria-label="Certification">
                <img src="/images/NWBOC-Logo-480x191.webp" alt="NWBOC certified woman owned" />
              </div>
            </div>
            <div className="split-copy">
              <p className="eyebrow">Why BZ Resources</p>
              <h2>A responsive staffing partner for changing workforce needs.</h2>
              <p>
                Whether you need one critical hire or a broader staffing plan,
                our team focuses on fit, speed, and the details that keep work
                moving after a placement is made.
              </p>
              <div className="value-list">
                {values.map((value) => (
                  <article className="value-item" key={value.title}>
                    <span className="value-mark" aria-hidden="true">
                      {value.title.charAt(0)}
                    </span>
                    <div>
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="industries">
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Industries served</p>
                <h2>Practical workforce help across busy teams.</h2>
              </div>
              <p>
                We support employers who need capable people, clear processes,
                and staffing help that can adapt as business needs change.
              </p>
            </div>
            <div className="industries">
              {industries.map(([title, description]) => (
                <div className="industry" key={title}>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-band" id="contact">
          <div className="section-inner contact-inner">
            <div className="contact-copy">
              <p className="eyebrow">Start the conversation</p>
              <h2>Tell us what your team needs next.</h2>
              <p>
                Connect with BZ Resources for staffing support, payroll help,
                candidate screening, or a complete workforce plan.
              </p>
            </div>
            <div className="contact-actions">
              <a className="button" href="mailto:info@bzresources.com">
                Email BZ Resources
              </a>
              <a className="button secondary" href="tel:+10000000000">
                Call Today
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
