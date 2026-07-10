import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import MobileMenu from './MobileMenu'
import { primaryNavigation, requestProposalUrl } from '../data/navigation'
import useScrolledHeader from '../hooks/useScrolledHeader'
import { assetPath } from '../lib/assets'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrolled = useScrolledHeader()

  return (
    <header className={scrolled ? 'site-header header-scrolled' : 'site-header'}>
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="BZ Resources home">
          <img
            className="logo-image"
            src={assetPath('images/BZ-Logo.png.webp')}
            alt="BZ Resources"
            decoding="async"
            fetchPriority="high"
            loading="eager"
          />
        </NavLink>

        <nav className="main-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              end={item.path === '/'}
              key={item.path}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
          <a href={requestProposalUrl} rel="noreferrer" target="_blank">
            Request for Proposal
          </a>
          <button type="button">English</button>
          <button type="button">Español</button>
        </nav>

        <button
          aria-controls="mobile-menu"
          aria-expanded={mobileOpen}
          className="menu-toggle"
          onClick={() => setMobileOpen((value) => !value)}
          type="button"
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Menu</span>
        </button>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}

export default Header
