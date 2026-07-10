import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import {
  contactEmail,
  footerNavigation,
  officeLocations,
  phoneDisplay,
  phoneHref,
  requestProposalUrl,
  socialLinks,
} from '../data/navigation'
import { assetPath } from '../lib/assets'

function Footer() {
  return (
    <Reveal as="footer" className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img
            className="logo-image"
            src={assetPath('images/BZ-Logo.png.webp')}
            alt="BZ Resources"
            decoding="async"
            loading="lazy"
          />
        </div>

        <div className="footer-column">
          <h2 className="footer-heading">Quick Links</h2>
          <nav className="footer-links" aria-label="Footer navigation">
            {footerNavigation.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
              </Link>
            ))}
            <a href={requestProposalUrl} rel="noreferrer" target="_blank">
              Request For Proposal
            </a>
          </nav>
        </div>

        <div className="footer-column">
          <h2 className="footer-heading">Corporate Office</h2>
          <address className="footer-contact">
            <p>
              {officeLocations[0].lines[0]}
              <br />
              {officeLocations[0].lines[1]}
            </p>
          </address>
          <img
            className="footer-certification image-contain"
            alt="NWBOC Women Business Enterprise certification"
            decoding="async"
            loading="lazy"
            src={assetPath('images/NWBOC-Logo-480x191.webp')}
          />
        </div>

        <div className="footer-column">
          <div className="contact-detail">
            <h2 className="footer-heading">Phone</h2>
            <a href={phoneHref}>{phoneDisplay}</a>
          </div>
          <div className="contact-detail">
            <h2 className="footer-heading">Email</h2>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
          <div className="contact-detail">
            <h2 className="footer-heading">Hours of Operation</h2>
            <p>Monday through Friday, 8:00 a.m. to 5:00 p.m.</p>
          </div>
          <div className="footer-social">
            <h2 className="footer-social-title">Share</h2>
            <div className="social-links" aria-label="Social media">
              {socialLinks.map((item) => (
                <a
                  aria-label={item.label}
                  className="social-link"
                  href={item.href}
                  key={item.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label === 'LinkedIn' ? 'in' : item.label.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>Copyright © 2026 BZ Resources. All Rights Reserved.</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </Reveal>
  )
}

export default Footer
