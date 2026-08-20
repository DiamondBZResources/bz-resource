import { Link } from 'react-router-dom'
import Recaptcha from './Recaptcha'
import type { Language } from '../context/language'

type Props = {
  consent: boolean
  honeypot: string
  language?: Language
  onConsentChange: (value: boolean) => void
  onHoneypotChange: (value: string) => void
  onTokenChange: (token: string) => void
  resetKey?: number
}

export default function SecureFormControls({ consent, honeypot, language = 'en', onConsentChange, onHoneypotChange, onTokenChange, resetKey = 0 }: Props) {
  return (
    <div className="secure-controls">
      <div className="bot-trap" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => onHoneypotChange(e.target.value)} /></label>
      </div>
      <label className="consent-row">
        <input type="checkbox" checked={consent} onChange={(e) => onConsentChange(e.target.checked)} required />
        <span>{language === 'es' ? 'Acepto que BZ Resources use esta información para responder y procesar mi solicitud.' : 'I agree that BZ Resources may use this information to respond to and process my request.'} <Link to="/privacy-policy">{language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}</Link></span>
      </label>
      <Recaptcha language={language} onTokenChange={onTokenChange} resetKey={resetKey} />
    </div>
  )
}
