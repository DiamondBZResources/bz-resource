import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const revealSelectors = [
  '.section > .container-wide',
  '.section > .container-narrow',
  '.pillar-band > .container-wide',
  '.final-cta-inner',
  '.trust-strip-grid',
  '.page-hero-inner',
]

const staggerSelectors = [
  '.process-list > li',
  '.reason-rows > article',
  '.office-grid > address',
  '.pillar-band-grid > article',
  '.why-list > article',
  '.why-audience-grid > article',
  '.resource-list > article',
  '.form-choice-list > article',
]

export default function ScrollMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observed = new Set<Element>()
    const observer = reducedMotion
      ? null
      : new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          }
        }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 })

    const prepare = () => {
      document.querySelectorAll(revealSelectors.join(',')).forEach((element, index) => {
        if (observed.has(element)) return
        observed.add(element)
        element.classList.add('scroll-reveal', `scroll-reveal-${index % 4}`)
        element.querySelectorAll(staggerSelectors.join(',')).forEach((child, childIndex) => {
          if (child instanceof HTMLElement) child.style.setProperty('--reveal-order', String(Math.min(childIndex, 5)))
          child.classList.add('reveal-item')
        })
        if (reducedMotion) element.classList.add('is-visible')
        else observer?.observe(element)
      })
    }

    const frame = window.requestAnimationFrame(prepare)
    const mutationObserver = new MutationObserver(prepare)
    const main = document.querySelector('main')
    if (main) mutationObserver.observe(main, { childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(frame)
      mutationObserver.disconnect()
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
