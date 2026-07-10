import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type PageTransitionProps = {
  children: ReactNode
}

function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <div className="page-transition page-enter" key={location.pathname}>
      {children}
    </div>
  )
}

export default PageTransition
