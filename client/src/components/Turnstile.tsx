import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  remove(widgetId: string): void
  render(
    container: HTMLElement,
    options: {
      action: string
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
      sitekey: string
      theme: 'light'
    },
  ): string
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let turnstileScriptPromise: Promise<TurnstileApi> | undefined

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (turnstileScriptPromise) return turnstileScriptPromise

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('Turnstile did not initialize.'))
    }
    script.onerror = () => reject(new Error('Turnstile could not be loaded.'))
    document.head.append(script)
  })

  return turnstileScriptPromise
}

type TurnstileProps = {
  action: string
  onTokenChange: (token: string) => void
}

function Turnstile({ action, onTokenChange }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tokenCallbackRef = useRef(onTokenChange)
  const [loadError, setLoadError] = useState('')
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''

  useEffect(() => {
    tokenCallbackRef.current = onTokenChange
  }, [onTokenChange])

  useEffect(() => {
    if (!siteKey || !containerRef.current) return
    let widgetId: string | undefined
    let cancelled = false

    loadTurnstile()
      .then((api) => {
        if (cancelled || !containerRef.current) return
        widgetId = api.render(containerRef.current, {
          action,
          callback: (token) => {
            setLoadError('')
            tokenCallbackRef.current(token)
          },
          'error-callback': () => {
            tokenCallbackRef.current('')
            setLoadError('Security verification could not be completed. Please try again.')
          },
          'expired-callback': () => tokenCallbackRef.current(''),
          sitekey: siteKey,
          theme: 'light',
        })
      })
      .catch(() => {
        if (!cancelled) {
          tokenCallbackRef.current('')
          setLoadError('Security verification could not be loaded. Please refresh and try again.')
        }
      })

    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [action, siteKey])

  if (!siteKey) {
    return (
      <p className="turnstile-note" role="status">
        Online security verification is not configured for this site yet.
      </p>
    )
  }

  return (
    <div className="turnstile-field">
      <div ref={containerRef} />
      {loadError ? (
        <p aria-live="polite" className="field-error" role="alert">
          {loadError}
        </p>
      ) : null}
    </div>
  )
}

export default Turnstile
