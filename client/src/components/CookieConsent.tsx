import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShield, FiX } from 'react-icons/fi'
import { useLanguage } from '../context/language'

const consentKey = 'bz-cookie-consent-v1'

type Consent = {
  necessary: true
  preferences: boolean
  analytics: boolean
  updatedAt: string
}

function readConsent(): Consent | null {
  try {
    const saved = window.localStorage.getItem(consentKey)
    return saved ? JSON.parse(saved) as Consent : null
  } catch {
    return null
  }
}

export default function CookieConsent() {
  const { language } = useLanguage()
  const es = language === 'es'
  const [consent, setConsent] = useState<Consent | null>(readConsent)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [preferences, setPreferences] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  const save = (nextPreferences: boolean, nextAnalytics: boolean) => {
    const next: Consent = {
      necessary: true,
      preferences: nextPreferences,
      analytics: nextAnalytics,
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(consentKey, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('bz-consent-change', { detail: next }))
    setConsent(next)
    setPreferencesOpen(false)
  }

  useEffect(() => {
    const open = () => {
      const current = readConsent()
      setPreferences(current?.preferences ?? false)
      setAnalytics(current?.analytics ?? false)
      setPreferencesOpen(true)
    }
    window.addEventListener('bz-open-cookie-preferences', open)
    return () => window.removeEventListener('bz-open-cookie-preferences', open)
  }, [])

  useEffect(() => {
    if (!preferencesOpen) return undefined
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreferencesOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      previousFocus?.focus()
    }
  }, [preferencesOpen])

  return (
    <>
      {!consent && !preferencesOpen ? (
        <section className="cookie-banner" aria-label={es ? 'Preferencias de privacidad' : 'Privacy preferences'}>
          <div className="cookie-banner-inner">
            <FiShield aria-hidden="true" />
            <div>
              <strong>{es ? 'Su privacidad, claramente explicada.' : 'Your privacy, clearly explained.'}</strong>
              <p>{es
                ? 'Usamos almacenamiento esencial para recordar sus opciones y proteger los formularios. Las funciones opcionales solo se activan con su permiso.'
                : 'We use essential storage to remember your choices and protect forms. Optional features are enabled only with your permission.'}</p>
              <Link to="/cookie-policy">{es ? 'Leer la Política de Cookies' : 'Read the Cookie Policy'}</Link>
            </div>
            <div className="cookie-actions">
              <button className="button button-outline" type="button" onClick={() => save(false, false)}>{es ? 'Rechazar opcionales' : 'Reject optional'}</button>
              <button className="button button-outline" type="button" onClick={() => setPreferencesOpen(true)}>{es ? 'Preferencias' : 'Preferences'}</button>
              <button className="button" type="button" onClick={() => save(true, true)}>{es ? 'Aceptar todo' : 'Accept all'}</button>
            </div>
          </div>
        </section>
      ) : null}

      {preferencesOpen ? (
        <div className="cookie-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPreferencesOpen(false)
        }}>
          <div className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" ref={dialogRef} tabIndex={-1}>
            <button className="cookie-modal-close" type="button" aria-label={es ? 'Cerrar' : 'Close'} onClick={() => setPreferencesOpen(false)}><FiX /></button>
            <p className="eyebrow">{es ? 'Control de privacidad' : 'Privacy control'}</p>
            <h2 id="cookie-modal-title">{es ? 'Preferencias de cookies' : 'Cookie preferences'}</h2>
            <p className="cookie-modal-intro">{es
              ? 'Este sitio no usa actualmente publicidad conductual. Puede decidir qué categorías opcionales autorizar si se añaden herramientas de medición en el futuro.'
              : 'This site does not currently use behavioral advertising. You can decide which optional categories to authorize if measurement tools are added in the future.'}</p>
            <div className="cookie-choice">
              <div><strong>{es ? 'Estrictamente necesarias' : 'Strictly necessary'}</strong><small>{es ? 'Seguridad, envío de formularios y almacenamiento de su elección.' : 'Security, form delivery, and storage of your choice.'}</small></div>
              <span>{es ? 'Siempre activas' : 'Always on'}</span>
            </div>
            <label className="cookie-choice">
              <div><strong>{es ? 'Preferencias' : 'Preferences'}</strong><small>{es ? 'Recuerda opciones como el idioma del sitio.' : 'Remembers choices such as site language.'}</small></div>
              <input type="checkbox" checked={preferences} onChange={(event) => setPreferences(event.target.checked)} />
            </label>
            <label className="cookie-choice">
              <div><strong>{es ? 'Medición y rendimiento' : 'Measurement and performance'}</strong><small>{es ? 'Permitiría medición agregada si se implementa en el futuro.' : 'Would allow aggregate measurement if implemented in the future.'}</small></div>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            </label>
            <div className="cookie-modal-actions">
              <Link to="/cookie-policy" onClick={() => setPreferencesOpen(false)}>{es ? 'Ver política completa' : 'View full policy'}</Link>
              <button className="button" type="button" onClick={() => save(preferences, analytics)}>{es ? 'Guardar preferencias' : 'Save preferences'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
