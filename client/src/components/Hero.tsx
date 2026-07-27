import { Link } from 'react-router-dom'
import { requestProposalUrl } from '../data/navigation'
import { assetPath } from '../lib/assets'

function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">Staffing & workforce support</p>
          <h1 id="hero-heading">Satisfying All of Your Staffing Needs</h1>
          <p>
            BZ Resources helps employers build dependable teams and gives job
            seekers a clearer path to opportunity—with hands-on support from
            recruitment through workforce administration.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/services">
              Explore Our Services
            </Link>
            <a
              className="button button-secondary"
              href={requestProposalUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Request a Proposal
            </a>
          </div>
          <Link className="hero-contact-link" to="/contact">
            Or contact BZ Resources
            <span aria-hidden="true"> →</span>
          </Link>
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
    </section>
  )
}

export default Hero
