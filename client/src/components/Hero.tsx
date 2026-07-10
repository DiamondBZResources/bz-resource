import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { assetPath } from '../lib/assets'

type HeroStyle = CSSProperties & {
  '--hero-background': string
}

function Hero() {
  const heroStyle: HeroStyle = {
    '--hero-background': `url("${assetPath('images/largeImageForMain.jpg')}")`,
  }

  return (
    <section
      className="hero-section"
      aria-labelledby="hero-heading"
      style={heroStyle}
    >
      <div className="hero-content">
        <div className="hero-copy">
          <img
            className="hero-logo logo-image"
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            src={assetPath('images/BZ-Logo.png.webp')}
          />
          <h1 id="hero-heading">Satisfying All of Your Staffing Needs</h1>
          <p>
            BZ Resources connects businesses with qualified candidates while
            supporting recruitment, payroll, screening, training, tracking, and
            workforce administration.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/services">
              View Our Services
            </Link>
            <Link className="button button-outline" to="/contact">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="hero-feature">
          <div className="hero-image-frame">
            <img
              className="hero-feature-image image-cover"
              alt="Business professionals meeting in a modern workplace"
              decoding="async"
              fetchPriority="high"
              height="4000"
              loading="eager"
              src={assetPath('images/satisfyAllYourStaffing.jpg')}
              width="6000"
            />
          </div>
        </div>
      </div>

      <div className="hero-dots" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
      </div>
    </section>
  )
}

export default Hero
