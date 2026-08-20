import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLanguage } from '../context/language'
import { postJson } from '../lib/apiClient'
import SecureFormControls from './SecureFormControls'

const initial = { firstName: '', lastName: '', email: '', phone: '', company: '', category: '', message: '' }

export default function ContactForm() {
  const { language } = useLanguage()
  const [form, setForm] = useState(initial)
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })
  const [startedAt, setStartedAt] = useState(Date.now)

  const set = (key: keyof typeof initial, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!consent || !token) {
      setStatus({ type: 'error', message: language === 'es' ? 'Complete el consentimiento y la verificación de seguridad.' : 'Please complete consent and the security check.' })
      return
    }
    setStatus({ type: 'loading', message: language === 'es' ? 'Enviando…' : 'Sending…' })
    try {
      const result = await postJson<object, { message: string }>('/api/contact', {
        ...form,
        language,
        security: { consent, startedAt, website: honeypot, recaptchaToken: token },
      })
      setStatus({ type: 'success', message: result.message })
      setForm(initial); setConsent(false); setHoneypot(''); setToken(''); setResetKey((v) => v + 1); setStartedAt(Date.now())
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Unable to send the form.' })
    }
  }

  return (
    <form className="modern-form" onSubmit={submit}>
      <div className="form-grid two">
        <label>{language === 'es' ? 'Nombre' : 'First name'}<input required maxLength={80} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} /></label>
        <label>{language === 'es' ? 'Apellido' : 'Last name'}<input required maxLength={80} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} /></label>
        <label>{language === 'es' ? 'Correo electrónico' : 'Email'}<input required type="email" maxLength={160} value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
        <label>{language === 'es' ? 'Teléfono' : 'Phone'}<input required inputMode="tel" maxLength={30} value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
        <label>{language === 'es' ? 'Empresa' : 'Company'}<input maxLength={120} value={form.company} onChange={(e) => set('company', e.target.value)} /></label>
        <label>{language === 'es' ? '¿Cómo podemos ayudar?' : 'How can we help?'}
          <select required value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">{language === 'es' ? 'Seleccione una opción' : 'Select an option'}</option>
            <option value="staffing">{language === 'es' ? 'Necesito personal' : 'I need staff'}</option>
            <option value="job">{language === 'es' ? 'Busco empleo' : 'I am looking for work'}</option>
            <option value="payroll">{language === 'es' ? 'Nómina / RR. HH.' : 'Payroll / HR support'}</option>
            <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
          </select>
        </label>
      </div>
      <label>{language === 'es' ? 'Mensaje' : 'Message'}<textarea required rows={6} maxLength={2500} value={form.message} onChange={(e) => set('message', e.target.value)} /></label>
      <SecureFormControls language={language} consent={consent} honeypot={honeypot} onConsentChange={setConsent} onHoneypotChange={setHoneypot} onTokenChange={setToken} resetKey={resetKey} />
      {status.type !== 'idle' && <p className={`form-message ${status.type}`} role="status">{status.message}</p>}
      <button className="button form-submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? (language === 'es' ? 'Enviando…' : 'Sending…') : (language === 'es' ? 'Enviar mensaje' : 'Send Message')}</button>
    </form>
  )
}
