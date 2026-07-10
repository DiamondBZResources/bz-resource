import { NavLink } from 'react-router-dom'
import { primaryNavigation, requestProposalUrl } from '../data/navigation'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div className={open ? 'mobile-panel open' : 'mobile-panel'} id="mobile-menu">
      <nav aria-label="Mobile navigation">
        {primaryNavigation.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            end={item.path === '/'}
            key={item.path}
            onClick={onClose}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
        <a href={requestProposalUrl} onClick={onClose} rel="noreferrer" target="_blank">
          Request for Proposal
        </a>
        <button type="button">English</button>
        <button type="button">Español</button>
      </nav>
    </div>
  )
}

export default MobileMenu
