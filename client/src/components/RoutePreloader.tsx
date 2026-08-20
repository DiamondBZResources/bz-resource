import { useEffect } from 'react'

const routeLoaders: Record<string, () => Promise<unknown>> = {
  '/about-us': () => import('../pages/AboutPage'),
  '/why-choose-bz': () => import('../pages/WhyBZPage'),
  '/services': () => import('../pages/ServicesPage'),
  '/biography': () => import('../pages/BiographyPage'),
  '/resources': () => import('../pages/ResourcesPage'),
  '/blog': () => import('../pages/BlogPage'),
  '/contact': () => import('../pages/ContactPage'),
  '/forms': () => import('../pages/FormsPage'),
  '/privacy-policy': () => import('../pages/PrivacyPolicyPage'),
  '/cookie-policy': () => import('../pages/CookiePolicyPage'),
  '/terms-of-use': () => import('../pages/TermsOfUsePage'),
}

function getRouteFromLink(target: EventTarget | null) {
  const anchor = target instanceof Element ? target.closest('a') : null
  if (!(anchor instanceof HTMLAnchorElement) || anchor.origin !== window.location.origin) return null

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const route = base && anchor.pathname.startsWith(base)
    ? anchor.pathname.slice(base.length) || '/'
    : anchor.pathname

  return route.replace(/\/$/, '') || '/'
}

export default function RoutePreloader() {
  useEffect(() => {
    const preload = (event: Event) => {
      const route = getRouteFromLink(event.target)
      if (route) void routeLoaders[route]?.()
    }

    document.addEventListener('pointerover', preload, { passive: true })
    document.addEventListener('focusin', preload)
    return () => {
      document.removeEventListener('pointerover', preload)
      document.removeEventListener('focusin', preload)
    }
  }, [])

  return null
}
