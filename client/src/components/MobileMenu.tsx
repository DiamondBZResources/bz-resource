import { NavLink } from 'react-router-dom'
import { primaryNavigation, requestProposalUrl } from '../data/navigation'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      aria-hidden={!open}
      className={open ? 'mobile-panel open' : 'mobile-panel'}
      id="mobile-menu"
    >
      <nav aria-label="Mobile navigation">
        {primaryNavigation.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            end={item.path === '/'}
            key={item.path}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
        <a
          className="mobile-proposal-link"
          href={requestProposalUrl}
          onClick={onClose}
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          target="_blank"
        >
          Request for Proposal
        </a>
      </nav>
    </div>
  )
}

export default MobileMenu
