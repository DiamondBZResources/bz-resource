import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import brandLogo from '../assets/generated/brand-logo'
import MobileMenu from './MobileMenu'
import ResponsiveImage from './ResponsiveImage'
import useScrolledHeader from '../hooks/useScrolledHeader'

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

  useEffect(() => {
    function closeDesktopDropdowns(event: PointerEvent) {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      headerRef.current
        ?.querySelectorAll<HTMLDetailsElement>('.nav-dropdown[open]')
        .forEach((dropdown) => {
          if (!dropdown.contains(target)) {
            dropdown.removeAttribute('open')
          }
        })
    }

    function closeDesktopDropdownOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return
      }

      const openDropdown = headerRef.current?.querySelector<HTMLDetailsElement>(
        '.nav-dropdown[open]',
      )

      if (openDropdown) {
        openDropdown.removeAttribute('open')
        openDropdown.querySelector<HTMLElement>('summary')?.focus()
      }
    }

    document.addEventListener('pointerdown', closeDesktopDropdowns)
    document.addEventListener('keydown', closeDesktopDropdownOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeDesktopDropdowns)
      document.removeEventListener('keydown', closeDesktopDropdownOnEscape)
    }
  }, [])

  function keepOneDropdownOpen(currentDropdown: HTMLDetailsElement) {
    if (!currentDropdown.open) {
      return
    }

    headerRef.current
      ?.querySelectorAll<HTMLDetailsElement>('.nav-dropdown[open]')
      .forEach((dropdown) => {
        if (dropdown !== currentDropdown) {
          dropdown.removeAttribute('open')
        }
      })
  }

  return (
    <header
      className={scrolled ? 'site-header header-scrolled' : 'site-header'}
      ref={headerRef}
    >
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="BZ Resources home">
          <ResponsiveImage
            alt="BZ Resources"
            imageClassName="logo-image"
            priority
            sizes="72px"
            source={brandLogo}
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
          <details
            className="nav-dropdown"
            onToggle={(event) => keepOneDropdownOpen(event.currentTarget)}
          >
            <summary
              className={
                companyLinks.some((item) => item.path === pathname)
                  ? 'active'
                  : undefined
              }
            >
              Company
              <span aria-hidden="true" className="nav-caret" />
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
          <details
            className="nav-dropdown"
            onToggle={(event) => keepOneDropdownOpen(event.currentTarget)}
          >
            <summary
              className={
                resourceLinks.some((item) => item.path === pathname)
                  ? 'active'
                  : undefined
              }
            >
              Resources
              <span aria-hidden="true" className="nav-caret" />
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
