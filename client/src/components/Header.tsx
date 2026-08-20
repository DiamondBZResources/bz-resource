import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiPhone, FiX } from 'react-icons/fi'
import Brand from './Brand'
import useScrolledHeader from '../hooks/useScrolledHeader'
import { useLanguage } from '../context/language'
import { phoneDisplay, phoneHref } from '../data/navigation'
import { siteContent } from '../data/siteContent'

export default function Header() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const scrolled = useScrolledHeader(4)
  const location = useLocation()
  const navigate = useNavigate()
  const copy = siteContent[language].nav

  const links = [
    [copy.home, '/'],
    [copy.about, '/about-us'],
    [copy.why, '/why-choose-bz'],
    [copy.services, '/services'],
    [copy.resources, '/resources'],
    [copy.forms, '/forms'],
    [copy.contact, '/contact'],
  ] as const

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  const switchLanguage = (next: 'en' | 'es') => {
    setLanguage(next)
    if (/\/(applicant-questionnaire|new-hire-application)\/(en|es)$/.test(location.pathname)) {
      navigate(location.pathname.replace(/\/(en|es)$/, `/${next}`))
    }
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header-inner container-wide">
        <Brand />
        <nav className="desktop-nav" aria-label={language === 'es' ? 'Navegación principal' : 'Primary navigation'}>
          {links.map(([label, path]) => (
            <NavLink end={path === '/'} key={path} to={path} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <a className="header-phone" href={phoneHref}><FiPhone aria-hidden="true" /><span>{phoneDisplay}</span></a>
          <div className="language-switch" aria-label={copy.language}>
            <button className={language === 'en' ? 'active' : ''} onClick={() => switchLanguage('en')} type="button">EN</button>
            <span aria-hidden="true">/</span>
            <button className={language === 'es' ? 'active' : ''} onClick={() => switchLanguage('es')} type="button">ES</button>
          </div>
          <button className="menu-button" type="button" aria-label={open ? copy.close : copy.menu} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${open ? ' is-open' : ''}`} aria-label={language === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>
        <div className="container-wide mobile-nav-inner">
          {links.map(([label, path]) => <NavLink end={path === '/'} key={path} to={path} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <a className="mobile-phone" href={phoneHref}><FiPhone aria-hidden="true" />{phoneDisplay}</a>
        </div>
      </nav>
    </header>
  )
}
