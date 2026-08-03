import { Link } from 'react-router-dom'
import BotTrap from './BotTrap'
import Turnstile from './Turnstile'

type SecureFormControlsProps = {
  action: string
  consent: boolean
  consentError?: string
  honeypot: string
  language?: 'en' | 'es'
  onConsentChange: (checked: boolean) => void
  onHoneypotChange: (value: string) => void
  onTurnstileTokenChange: (token: string) => void
  turnstileResetKey: number
  turnstileError?: string
}

function SecureFormControls({
  action,
  consent,
  consentError,
  honeypot,
  language = 'en',
  onConsentChange,
  onHoneypotChange,
  onTurnstileTokenChange,
  turnstileResetKey,
  turnstileError,
}: SecureFormControlsProps) {
  const isSpanish = language === 'es'

  return (
    <div className="secure-form-controls">
      <BotTrap onChange={onHoneypotChange} value={honeypot} />
      <label className="form-consent">
        <input
          aria-describedby={consentError ? 'privacy-consent-error' : undefined}
          aria-invalid={Boolean(consentError)}
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
          required
          type="checkbox"
        />
        <span>
          {isSpanish
            ? 'Acepto que BZ Resources use la información proporcionada para responder a mi consulta.'
            : 'I agree that BZ Resources may use the information provided to respond to my inquiry.'}{' '}
          <Link to="/privacy-policy">
            {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
          </Link>
        </span>
      </label>
      {consentError ? (
        <span className="field-error" id="privacy-consent-error">
          {consentError}
        </span>
      ) : null}
      <Turnstile
        action={action}
        key={`${action}-${turnstileResetKey}`}
        onTokenChange={onTurnstileTokenChange}
      />
      {turnstileError ? <span className="field-error">{turnstileError}</span> : null}
    </div>
  )
}

export default SecureFormControls
