import { Link } from 'react-router-dom'
import heroStaffing from '../assets/generated/hero-staffing'
import { requestProposalUrl } from '../data/navigation'
import ResponsiveImage from './ResponsiveImage'

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
            <ResponsiveImage
              alt="Business professionals meeting in a modern workplace"
              imageClassName="hero-feature-image image-cover"
              priority
              sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1050px) 70vw, 560px"
              source={heroStaffing}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
