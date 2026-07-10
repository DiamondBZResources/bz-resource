const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Industries', href: '#industries' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="BZ Resources home">
          <img src="/images/BZ-Logo.png.webp" alt="" />
          <span>
            <strong>BZ Resources</strong>
            <span>Staffing and workforce solutions</span>
          </span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Contact
        </a>
      </div>
    </header>
  )
}

export default Header
