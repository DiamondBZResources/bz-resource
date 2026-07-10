function Hero() {
  return (
    <section className="hero-section" id="top" aria-label="BZ Resources introduction">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">Workforce solutions built around people</p>
          <h1>The Right People. The Right Opportunity. The Right Time.</h1>
          <p>
            Welcome to BZ Resources, a staffing partner connecting dependable
            talent with employers who need recruiting, payroll, screening,
            training, tracking, and workers compensation support.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button" href="#contact">
              Request Staffing Support
            </a>
            <a className="button secondary" href="#services">
              Explore Services
            </a>
          </div>
        </div>
        <div className="hero-proof" aria-label="Company strengths">
          <div className="proof-item">
            <strong>Full-cycle</strong>
            <span>Recruiting through payroll support</span>
          </div>
          <div className="proof-item">
            <strong>Certified</strong>
            <span>Woman-owned business partner</span>
          </div>
          <div className="proof-item">
            <strong>Responsive</strong>
            <span>Workforce help when timing matters</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
