import { useEffect, useRef, useState } from 'react'

type RecaptchaApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => number
  reset: (widgetId?: number) => void
  remove?: (widgetId: number) => void
}

declare global {
  interface Window { grecaptcha?: RecaptchaApi }
}

let scriptPromise: Promise<RecaptchaApi> | null = null

function loadRecaptcha(): Promise<RecaptchaApi> {
  if (window.grecaptcha) return Promise.resolve(window.grecaptcha)
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-bz-recaptcha]')
    if (existing) {
      existing.addEventListener('load', () => window.grecaptcha ? resolve(window.grecaptcha) : reject(new Error('reCAPTCHA failed to initialize.')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.bzRecaptcha = 'true'
    script.onload = () => window.grecaptcha ? resolve(window.grecaptcha) : reject(new Error('reCAPTCHA failed to initialize.'))
    script.onerror = () => reject(new Error('reCAPTCHA could not be loaded.'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export default function Recaptcha({ language = 'en', onTokenChange, resetKey = 0 }: { language?: 'en' | 'es'; onTokenChange: (token: string) => void; resetKey?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onTokenChange)
  const widgetRef = useRef<number | null>(null)
  const [error, setError] = useState('')
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() ?? ''

  useEffect(() => { callbackRef.current = onTokenChange }, [onTokenChange])
  useEffect(() => {
    callbackRef.current('')
    if (!siteKey || !containerRef.current) return
    let cancelled = false
    loadRecaptcha().then((api) => {
      if (cancelled || !containerRef.current) return
      containerRef.current.innerHTML = ''
      widgetRef.current = api.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: (token: string) => { setError(''); callbackRef.current(token) },
        'expired-callback': () => callbackRef.current(''),
        'error-callback': () => { callbackRef.current(''); setError(language === 'es' ? 'No se pudo completar la verificación de seguridad. Inténtelo de nuevo.' : 'Security verification could not be completed. Please try again.') },
      })
    }).catch(() => setError(language === 'es' ? 'No se pudo cargar la verificación de seguridad. Actualice la página e inténtelo de nuevo.' : 'Security verification could not be loaded. Please refresh and try again.'))
    return () => {
      cancelled = true
      if (widgetRef.current !== null && window.grecaptcha?.remove) window.grecaptcha.remove(widgetRef.current)
      widgetRef.current = null
    }
  }, [language, siteKey, resetKey])

  if (!siteKey) return <p className="security-note">{language === 'es' ? 'Los envíos en línea no están disponibles temporalmente. Comuníquese con BZ Resources para recibir ayuda.' : 'Online submissions are temporarily unavailable. Please contact BZ Resources for assistance.'}</p>
  return <div className="recaptcha-field"><div ref={containerRef} />{error && <p className="field-error" role="alert">{error}</p>}</div>
}
