import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SecureFormControls from '../components/SecureFormControls'
import SectionHeading from '../components/SectionHeading'
import {
  contactEmail,
  officeLocations,
  phoneDisplay,
  phoneHref,
  socialLinks,
} from '../data/navigation'
import { postJson } from '../lib/apiClient'
import {
  containsBlockedContent,
  focusFirstInvalidField,
  linksNotAllowedMessage,
  normalizeEmail,
  normalizeMultiline,
  normalizeSingleLine,
} from '../lib/formSecurity'

type FormState = {
  company: string
  firstName: string
  lastName: string
  email: string
  inquiryType: string
  message: string
  phone: string
}

type FieldErrors = Partial<Record<keyof FormState | 'consent' | 'turnstileToken', string>>

type ContactResponse = {
  message?: string
  delivery?: boolean
}

const initialFormState: FormState = {
  company: '',
  firstName: '',
  lastName: '',
  email: '',
  inquiryType: '',
  message: '',
  phone: '',
}

const inquiryOptions = [
  { label: 'Select an inquiry type', value: '' },
  { label: 'Staffing Services', value: 'staffing' },
  { label: 'Recruiting', value: 'recruiting' },
  { label: 'Payroll Support', value: 'payroll' },
  { label: 'Screening & Training', value: 'screening-training' },
  { label: 'Job Seeker Support', value: 'job-seeker' },
  { label: 'General Inquiry', value: 'other' },
]

const socialIcons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
}

function validateForm(
  form: FormState,
  consent: boolean,
  turnstileToken: string,
): FieldErrors {
  const errors: FieldErrors = {}
  const namePattern = /^[\p{L}\p{M} .'-]+$/u
  const combinedName = `${form.firstName} ${form.lastName}`.trim()

  if (!form.firstName.trim() || !namePattern.test(form.firstName)) {
    errors.firstName = 'Enter a valid first name.'
  }
  if (!form.lastName.trim() || !namePattern.test(form.lastName)) {
    errors.lastName = 'Enter a valid last name.'
  }
  if (combinedName.length < 2 || combinedName.length > 100) {
    errors.firstName = 'Your full name must be between 2 and 100 characters.'
  }
  if (!form.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (form.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.phone.trim()) {
    errors.phone = 'Enter your phone number.'
  } else if (form.phone.length > 30 || !/^[0-9+().\-\s#xXextEXT]{7,30}$/.test(form.phone)) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (form.company.length > 150) {
    errors.company = 'Company name must be 150 characters or fewer.'
  }
  if (!inquiryOptions.some((option) => option.value === form.inquiryType) || !form.inquiryType) {
    errors.inquiryType = 'Select an inquiry type.'
  }
  if (!form.message.trim()) {
    errors.message = 'Tell us how BZ Resources can help.'
  } else if (form.message.trim().length < 20) {
    errors.message = 'Please add at least 20 characters.'
  } else if (form.message.length > 2_000) {
    errors.message = 'Your message must be 2,000 characters or fewer.'
  }
  if (
    [form.firstName, form.lastName, form.company, form.message].some(
      containsBlockedContent,
    )
  ) {
    errors.message = linksNotAllowedMessage
  }
  if (!consent) errors.consent = 'You must agree before submitting.'
  if (!turnstileToken) errors.turnstileToken = 'Complete the security verification.'

  return errors
}

function ContactPage() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const formRef = useRef<HTMLFormElement>(null)

  document.title = 'Contact Us | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Contact BZ Resources by phone, email, or contact form. BZ Resources serves the United States, including Hawaii and Alaska, and Canada.',
    )

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validateField(field: keyof FormState) {
    const nextErrors = validateForm(form, consent, turnstileToken)
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    const nextErrors = validateForm(form, consent, turnstileToken)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
      setMessage('Please review the highlighted fields and try again.')
      focusFirstInvalidField(formRef.current)
      return
    }

    setStatus('loading')
    setMessage('')
    setTurnstileToken('')
    setTurnstileResetKey((current) => current + 1)

    try {
      const result = await postJson<
        FormState & {
          security: {
            consent: boolean
            startedAt: number
            turnstileToken: string
            website: string
          }
        },
        ContactResponse
      >('api/contact', {
        company: normalizeSingleLine(form.company),
        email: normalizeEmail(form.email),
        firstName: normalizeSingleLine(form.firstName),
        inquiryType: form.inquiryType,
        lastName: normalizeSingleLine(form.lastName),
        message: normalizeMultiline(form.message),
        phone: normalizeSingleLine(form.phone),
        security: { consent, startedAt, turnstileToken, website: honeypot },
      })

      if (!result.delivery) {
        setStatus('error')
        setMessage(
          `Online delivery is not configured. Please contact BZ Resources at ${phoneDisplay} or ${contactEmail}.`,
        )
        return
      }

      setForm(initialFormState)
      setHoneypot('')
      setConsent(false)
      setTurnstileToken('')
      setStartedAt(Date.now())
      setErrors({})
      setStatus('success')
      setMessage('Your message was delivered. BZ Resources will be in touch.')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : `Unable to submit. Please contact BZ Resources at ${phoneDisplay} or ${contactEmail}.`,
      )
    }
  }

  function requiredLabel(label: string) {
    return (
      <>
        {label} <span className="required-mark" aria-hidden="true">*</span>
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let’s Talk"
        description="Reach BZ Resources for staffing, recruitment, payroll, screening, training, tracking, and workers compensation support."
      />

      <section className="section contact-page section-soft">
        <div className="section-inner contact-layout">
          <div className="contact-info">
            <Reveal as="article" delay={0}>
              <h2>Phone</h2>
              <a href={phoneHref}>{phoneDisplay}</a>
            </Reveal>
            <Reveal as="article" delay={1}>
              <h2>Email</h2>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </Reveal>
            <Reveal as="article" delay={2}>
              <h2>Hours of Operation</h2>
              <p>Monday through Friday, 8:00 a.m. to 5:00 p.m.</p>
            </Reveal>
            <Reveal as="article" delay={3}>
              <h2>Service Area</h2>
              <p>Nationwide services, including Hawaii and Alaska.</p>
              <p>Canada</p>
            </Reveal>
            <Reveal as="article" className="contact-social-card" delay={1}>
              <h2>Connect</h2>
              <p>Follow BZ Resources and stay connected.</p>
              <div className="contact-social-links" aria-label="Social media">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.label as keyof typeof socialIcons]

                  return (
                    <a
                      className="contact-social-link"
                      href={link.href}
                      key={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="contact-social-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span>{link.label}</span>
                      <span className="contact-social-arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  )
                })}
              </div>
            </Reveal>
          </div>

          <Reveal delay={1}>
            <form
              className={status === 'loading' ? 'contact-form form-submitting' : 'contact-form'}
              noValidate
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <h2>Send a Message</h2>
              <p className="required-note">
                Fields marked <span className="required-mark">*</span> are required.
              </p>
              <div className="form-row">
                <label>
                  {requiredLabel('First Name')}
                  <input
                    aria-describedby={errors.firstName ? 'first-name-error' : undefined}
                    aria-invalid={Boolean(errors.firstName)}
                    autoComplete="given-name"
                    id="contact-first-name"
                    name="firstName"
                    onBlur={() => validateField('firstName')}
                    onChange={(event) => updateField('firstName', event.target.value)}
                    required
                    type="text"
                    value={form.firstName}
                  />
                  {errors.firstName ? (
                    <span className="field-error" id="first-name-error">
                      {errors.firstName}
                    </span>
                  ) : null}
                </label>
                <label>
                  {requiredLabel('Last Name')}
                  <input
                    aria-describedby={errors.lastName ? 'last-name-error' : undefined}
                    aria-invalid={Boolean(errors.lastName)}
                    autoComplete="family-name"
                    id="contact-last-name"
                    name="lastName"
                    onBlur={() => validateField('lastName')}
                    onChange={(event) => updateField('lastName', event.target.value)}
                    required
                    type="text"
                    value={form.lastName}
                  />
                  {errors.lastName ? (
                    <span className="field-error" id="last-name-error">
                      {errors.lastName}
                    </span>
                  ) : null}
                </label>
              </div>
              <label>
                {requiredLabel('Email Address')}
                <input
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  id="contact-email"
                  maxLength={254}
                  name="email"
                  onBlur={() => validateField('email')}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
                {errors.email ? (
                  <span className="field-error" id="email-error">
                    {errors.email}
                  </span>
                ) : null}
              </label>
              <label>
                {requiredLabel('Phone Number')}
                <input
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  aria-invalid={Boolean(errors.phone)}
                  autoComplete="tel"
                  id="contact-phone"
                  maxLength={30}
                  name="phone"
                  onBlur={() => validateField('phone')}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                  type="tel"
                  value={form.phone}
                />
                {errors.phone ? (
                  <span className="field-error" id="phone-error">
                    {errors.phone}
                  </span>
                ) : null}
              </label>
              <label>
                Company
                <input
                  aria-describedby={errors.company ? 'company-error' : undefined}
                  aria-invalid={Boolean(errors.company)}
                  autoComplete="organization"
                  id="contact-company"
                  maxLength={150}
                  name="company"
                  onBlur={() => validateField('company')}
                  onChange={(event) => updateField('company', event.target.value)}
                  type="text"
                  value={form.company}
                />
                {errors.company ? (
                  <span className="field-error" id="company-error">
                    {errors.company}
                  </span>
                ) : null}
              </label>
              <label>
                {requiredLabel('Inquiry Type')}
                <select
                  aria-describedby={errors.inquiryType ? 'inquiry-type-error' : undefined}
                  aria-invalid={Boolean(errors.inquiryType)}
                  id="contact-inquiry-type"
                  name="inquiryType"
                  onBlur={() => validateField('inquiryType')}
                  onChange={(event) => updateField('inquiryType', event.target.value)}
                  required
                  value={form.inquiryType}
                >
                  {inquiryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.inquiryType ? (
                  <span className="field-error" id="inquiry-type-error">
                    {errors.inquiryType}
                  </span>
                ) : null}
              </label>
              <label>
                {requiredLabel('How can we help?')}
                <textarea
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={Boolean(errors.message)}
                  id="contact-message"
                  maxLength={2_000}
                  name="message"
                  onBlur={() => validateField('message')}
                  onChange={(event) => updateField('message', event.target.value)}
                  required
                  rows={6}
                  value={form.message}
                />
                {errors.message ? (
                  <span className="field-error" id="message-error">
                    {errors.message}
                  </span>
                ) : null}
              </label>
              <SecureFormControls
                action="contact-form"
                consent={consent}
                consentError={errors.consent}
                honeypot={honeypot}
                onConsentChange={(checked) => {
                  setConsent(checked)
                  setErrors((current) => ({ ...current, consent: undefined }))
                }}
                onHoneypotChange={setHoneypot}
                onTurnstileTokenChange={(token) => {
                  setTurnstileToken(token)
                  setErrors((current) => ({ ...current, turnstileToken: undefined }))
                }}
                turnstileResetKey={turnstileResetKey}
                turnstileError={errors.turnstileToken}
              />
              <button
                className={status === 'loading' ? 'button button-loading' : 'button'}
                disabled={status === 'loading'}
                type="submit"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
              {message ? (
                <p
                  aria-live="polite"
                  className={status === 'error' ? 'form-message error' : 'form-message'}
                  role={status === 'error' ? 'alert' : 'status'}
                >
                  {message}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="section offices-section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Our offices"
            title="Serving businesses across the United States"
          >
            <p>
              Start with the corporate office or reach BZ Resources through any
              of the listed regional office locations.
            </p>
          </SectionHeading>
          <div className="office-grid">
            {officeLocations.map((office, index) => (
              <Reveal
                as="article"
                className="office-card"
                delay={(index % 4) as 0 | 1 | 2 | 3}
                key={office.label}
              >
                <h3>{office.label}</h3>
                <address>
                  <span>{office.lines[0]}</span>
                  <span>{office.lines[1]}</span>
                </address>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        title="Explore the support behind stronger teams"
        text="Review BZ Resources staffing, recruitment, payroll, screening, training, tracking, and administration services."
        linkLabel="View Services"
        to="/services"
      />
    </>
  )
}

export default ContactPage
