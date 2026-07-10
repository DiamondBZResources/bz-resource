function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-inner">
        <div className="footer-brand">
          <img src="/images/BZ-Logo.png.webp" alt="" />
          <div>
            <strong>BZ Resources</strong>
            <span>Staffing, payroll, and workforce support.</span>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
