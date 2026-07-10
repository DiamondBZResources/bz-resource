import { useState } from 'react'
import type { FormEvent } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import {
  contactEmail,
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

function ContactPage() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  document.title = 'Contact Us | BZ Resources'
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Contact BZ Resources by phone, email, or contact form. BZ Resources serves the United States, including Hawaii and Alaska, and Canada.',
    )

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const result = await postJson<FormState, ContactResponse>('api/contact', form)

      setForm(initialFormState)
      setStatus('success')
      setMessage(
        result.delivery
          ? 'Your message was delivered.'
          : 'Your message was received by the development server. Delivery is not configured yet.',
      )
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : `Unable to submit. Please contact BZ Resources at ${phoneDisplay} or ${contactEmail}.`,
      )
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Contact"
        description="Reach BZ Resources for staffing, recruitment, payroll, screening, training, tracking, and workers compensation support."
      />

      <section className="section contact-page">
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
              <h2>Share</h2>
              <div className="social-links">
                {socialLinks.map((link) => (
                  <a
                    aria-label={link.label}
                    className="social-link"
                    href={link.href}
                    key={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label === 'LinkedIn' ? 'in' : link.label.charAt(0)}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={1}>
            <form
              className={status === 'loading' ? 'contact-form form-submitting' : 'contact-form'}
              onSubmit={handleSubmit}
            >
              <h2>Send a Message</h2>
              <div className="form-row">
                <label>
                  First Name
                  <input
                    autoComplete="given-name"
                    onChange={(event) => updateField('firstName', event.target.value)}
                    required
                    type="text"
                    value={form.firstName}
                  />
                </label>
                <label>
                  Last Name
                  <input
                    autoComplete="family-name"
                    onChange={(event) => updateField('lastName', event.target.value)}
                    required
                    type="text"
                    value={form.lastName}
                  />
                </label>
              </div>
              <label>
                Email Address
                <input
                  autoComplete="email"
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label>
                Phone Number
                <input
                  autoComplete="tel"
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                  type="tel"
                  value={form.phone}
                />
              </label>
              <label>
                Comments
                <textarea
                  onChange={(event) => updateField('comments', event.target.value)}
                  required
                  rows={6}
                  value={form.comments}
                />
              </label>
              <button
                className={status === 'loading' ? 'button button-loading' : 'button'}
                disabled={status === 'loading'}
                type="submit"
              >
                {status === 'loading' ? 'Sending...' : 'Submit'}
              </button>
              {message ? (
                <p
                  className={status === 'error' ? 'form-message error' : 'form-message'}
                  role="status"
                >
                  {message}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default ContactPage
