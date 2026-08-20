import { Link } from 'react-router-dom'
import brandLockup from '../assets/generated/brand-lockup'

export default function Brand() {
  return (
    <Link className="brand" to="/" aria-label="BZ Resources home">
      <img className="brand-logo-image" src={brandLockup.fallback} alt="BZ Resources" width="541" height="495" />
    </Link>
  )
}
