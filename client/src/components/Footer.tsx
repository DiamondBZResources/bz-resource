import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi'
import Brand from './Brand'
import { useLanguage } from '../context/language'
import { contactEmail, corporateOffice, phoneDisplay, phoneHref, socialLinks } from '../data/navigation'
import { getServicePath, services } from '../data/services'
import { siteContent } from '../data/siteContent'

const socialIcons = [FiFacebook, FiLinkedin, FiInstagram]

export default function Footer() {
  const { language } = useLanguage()
  const copy = siteContent[language]
  const companyLinks = [
    [copy.nav.about, '/about-us'], [copy.nav.why, '/why-choose-bz'],
    [language === 'es' ? 'Conozca a la Dueña' : 'Meet the Owner', '/biography'],
    [copy.nav.resources, '/resources'], [copy.nav.forms, '/forms'],
  ] as const
  const openCookiePreferences = () => window.dispatchEvent(new Event('bz-open-cookie-preferences'))

  return (
    <footer className="site-footer">
      <div className="footer-main container-wide">
        <div className="footer-brand-column">
          <Brand />
          <p>{copy.footer.description}</p>
          <div className="social-row">
            {socialLinks.map((item, index) => {
              const Icon = socialIcons[index]
              return <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}><Icon /></a>
            })}
          </div>
        </div>
        <nav className="footer-column" aria-label={language === 'es' ? 'Empresa' : 'Company'}>
          <h2>{copy.footer.company}</h2>
          {companyLinks.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
        </nav>
        <nav className="footer-column" aria-label={copy.footer.services}>
          <h2>{copy.footer.services}</h2>
          {services.map((service) => (
            <Link key={service.slug} to={getServicePath(service)}>{language === 'es' ? service.titleEs : service.title}</Link>
          ))}
        </nav>
        <div className="footer-column footer-contact">
          <h2>{copy.footer.contact}</h2>
          <a href={phoneHref}>{phoneDisplay}</a>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <address>{corporateOffice.lines[0]}<br />{corporateOffice.lines[1]}</address>
          <Link className="footer-office-link" to="/contact">{language === 'es' ? 'Contactar la oficina de Ocala' : 'Contact the Ocala office'} <FiArrowUpRight /></Link>
        </div>
      </div>
      <div className="footer-bottom container-wide">
        <span>© {new Date().getFullYear()} BZ Resources. {copy.footer.copyright}</span>
        <span>{copy.footer.nationwide}</span>
        <nav className="footer-legal" aria-label={language === 'es' ? 'Políticas legales' : 'Legal policies'}>
          <Link to="/privacy-policy">{copy.footer.privacy}</Link>
          <Link to="/cookie-policy">{language === 'es' ? 'Política de Cookies' : 'Cookie Policy'}</Link>
          <Link to="/terms-of-use">{language === 'es' ? 'Términos de Uso' : 'Terms of Use'}</Link>
          <button type="button" onClick={openCookiePreferences}>{language === 'es' ? 'Preferencias de cookies' : 'Cookie preferences'}</button>
        </nav>
      </div>
    </footer>
  )
}
