import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import MobileMenu from './MobileMenu'
import useScrolledHeader from '../hooks/useScrolledHeader'
import { assetPath } from '../lib/assets'

const companyLinks = [
  { label: 'About Us', path: '/about-us' },
  { label: 'Why Choose BZ', path: '/why-choose-bz' },
  { label: 'Meet the Owner', path: '/biography' },
]

const resourceLinks = [
  { label: 'Resources', path: '/resources' },
  { label: 'Blog', path: '/blog' },
  { label: 'Forms', path: '/forms' },
]

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrolled = useScrolledHeader()
  const { pathname } = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    headerRef.current
      ?.querySelectorAll<HTMLDetailsElement>('.nav-dropdown')
      .forEach((dropdown) => dropdown.removeAttribute('open'))
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) {
      return
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        headerRef.current?.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  return (
    <header
      className={scrolled ? 'site-header header-scrolled' : 'site-header'}
      ref={headerRef}
    >
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="BZ Resources home">
          <img
            className="logo-image"
            src={assetPath('images/BZ-Logo-transparent.png')}
            alt="BZ Resources"
            decoding="async"
            fetchPriority="high"
            loading="eager"
          />
          <span aria-hidden="true" className="brand-wordmark">Resources</span>
        </NavLink>

        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            end
            to="/"
          >
            Home
          </NavLink>
          <details className="nav-dropdown">
            <summary
              className={
                companyLinks.some((item) => item.path === pathname)
                  ? 'active'
                  : undefined
              }
            >
              Company
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="dropdown-menu">
              {companyLinks.map((item) => (
                <NavLink
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                  key={item.path}
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            to="/services"
          >
            Services
          </NavLink>
          <details className="nav-dropdown">
            <summary
              className={
                resourceLinks.some((item) => item.path === pathname)
                  ? 'active'
                  : undefined
              }
            >
              Resources
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="dropdown-menu">
              {resourceLinks.map((item) => (
                <NavLink
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                  key={item.path}
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-cta active' : 'nav-cta'
            }
            to="/contact"
          >
            Contact Us
          </NavLink>
        </nav>

        <button
          aria-controls="mobile-menu"
          aria-expanded={mobileOpen}
          className="menu-toggle"
          onClick={() => setMobileOpen((value) => !value)}
          type="button"
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}

export default Header
