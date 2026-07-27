import { useState } from 'react'
import type { FormEvent } from 'react'
import BotTrap from '../components/BotTrap'
import CallToAction from '../components/CallToAction'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import {
  contactEmail,
  officeLocations,
  phoneDisplay,
  phoneHref,
  socialLinks,
} from '../data/navigation'
import { postJson } from '../lib/apiClient'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  comments: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

type ContactResponse = {
  message?: string
  delivery?: boolean
}

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  comments: '',
}

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  if (!form.firstName.trim()) {
    errors.firstName = 'Enter your first name.'
  }
  if (!form.lastName.trim()) {
    errors.lastName = 'Enter your last name.'
  }
  if (!form.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.phone.trim()) {
    errors.phone = 'Enter your phone number.'
  }
  if (!form.comments.trim()) {
    errors.comments = 'Tell us how BZ Resources can help.'
  } else if (form.comments.trim().length < 10) {
    errors.comments = 'Please add a little more detail (at least 10 characters).'
  }

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
  const [startedAt, setStartedAt] = useState(() => Date.now())

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
    const nextErrors = validateForm(form)
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
      setMessage('Please review the highlighted fields and try again.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const result = await postJson<
        FormState & { security: { startedAt: number; website: string } },
        ContactResponse
      >('api/contact', {
        ...form,
        security: { startedAt, website: honeypot },
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
            <Reveal as="article" delay={1}>
              <h2>Connect</h2>
              <div className="social-links" aria-label="Social media">
                {socialLinks.map((link) => (
                  <a
                    aria-label={link.label}
                    className="social-link"
                    href={link.href}
                    key={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={1}>
            <form
              className={status === 'loading' ? 'contact-form form-submitting' : 'contact-form'}
              noValidate
              onSubmit={handleSubmit}
            >
              <h2>Send a Message</h2>
              <BotTrap onChange={setHoneypot} value={honeypot} />
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
                {requiredLabel('How can we help?')}
                <textarea
                  aria-describedby={errors.comments ? 'comments-error' : undefined}
                  aria-invalid={Boolean(errors.comments)}
                  onBlur={() => validateField('comments')}
                  onChange={(event) => updateField('comments', event.target.value)}
                  required
                  rows={6}
                  value={form.comments}
                />
                {errors.comments ? (
                  <span className="field-error" id="comments-error">
                    {errors.comments}
                  </span>
                ) : null}
              </label>
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
