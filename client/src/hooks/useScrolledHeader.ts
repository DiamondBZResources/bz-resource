import { useEffect, useState } from 'react'

function useScrolledHeader(offset = 18) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function updateScrolledState() {
      setScrolled(window.scrollY > offset)
    }

    updateScrolledState()
    window.addEventListener('scroll', updateScrolledState, { passive: true })

    return () => window.removeEventListener('scroll', updateScrolledState)
  }, [offset])

  return scrolled
}

export default useScrolledHeader
