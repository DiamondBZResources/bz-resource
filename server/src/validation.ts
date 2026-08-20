import type { FormKind, NormalizedSubmission, SecurityProof } from './types'

const MAX_FIELD_LENGTH = 4_000
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const dangerousPatterns = [/<\s*script/i, /javascript\s*:/i, /data\s*:\s*text\/html/i, /\$\{\s*jndi\s*:/i]
const linkPattern = /(?:https?:\/\/|www\.)/i

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function clean(value: unknown, max = MAX_FIELD_LENGTH) {
  if (typeof value !== 'string') return ''
  const withoutControls = Array.from(value.normalize('NFKC')).filter((character) => {
    const code = character.charCodeAt(0)
    return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)
  }).join('')
  return withoutControls.replace(/\r\n?/g, '\n').trim().slice(0, max)
}

function hasBlockedContent(key: string, value: string) {
  if (dangerousPatterns.some((pattern) => pattern.test(value))) return true
  if (!key.toLowerCase().includes('email') && linkPattern.test(value)) return true
  return false
}

export function validateSecurity(value: unknown): { ok: true; proof: SecurityProof } | { ok: false; message: string } {
  if (!isObject(value)) return { ok: false, message: 'The security verification is missing.' }
  const consent = value.consent
  const startedAt = value.startedAt
  const website = value.website
  const recaptchaToken = value.recaptchaToken
  if (consent !== true) return { ok: false, message: 'Please agree to the privacy consent.' }
  if (typeof website !== 'string' || website.trim()) return { ok: false, message: 'The submission was blocked by the spam filter.' }
  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt)) return { ok: false, message: 'The form timestamp is invalid.' }
  const age = Date.now() - startedAt
  if (age < 800) return { ok: false, message: 'The form was submitted too quickly. Please try again.' }
  if (age > 24 * 60 * 60 * 1000) return { ok: false, message: 'This form session expired. Please refresh and try again.' }
  if (typeof recaptchaToken !== 'string' || recaptchaToken.length < 10 || recaptchaToken.length > 4096) return { ok: false, message: 'Please complete the reCAPTCHA verification.' }
  return { ok: true, proof: { consent: true, startedAt, website, recaptchaToken } }
}

const allowedContact = ['firstName','lastName','email','phone','company','category','message'] as const
const allowedApplication = ['firstName','lastName','email','phone','street','city','state','zip','position','availableDate','workAuthorized','age18','transportation','skills','employmentHistory','education','references','availability','previouslyWorked','desiredCompensation','signature'] as const

export function validateSubmission(kind: FormKind, body: unknown): { ok: true; submission: NormalizedSubmission } | { ok: false; message: string } {
  if (!isObject(body)) return { ok: false, message: 'The form submission is invalid.' }
  const language = body.language === 'es' ? 'es' : 'en'
  const allowed = kind === 'contact' ? allowedContact : allowedApplication
  const details: Record<string, string> = {}

  for (const key of allowed) {
    const value = clean(body[key], key === 'message' || key === 'employmentHistory' ? 4000 : 2500)
    if (hasBlockedContent(key, value)) return { ok: false, message: language === 'es' ? 'No se permiten enlaces ni contenido ejecutable en este formulario.' : 'Links and executable content are not permitted in this form.' }
    if (key !== 'message' && key !== 'employmentHistory' && key !== 'education' && key !== 'references' && key !== 'skills' && /\n/.test(value)) return { ok: false, message: language === 'es' ? 'Uno de los campos contiene caracteres no permitidos.' : 'One of the fields contains unsupported characters.' }
    details[key] = value
  }

  const firstName = details.firstName
  const lastName = details.lastName
  const email = details.email.toLowerCase()
  const phone = details.phone
  if (!firstName || !lastName || !email || !phone || !emailPattern.test(email)) return { ok: false, message: language === 'es' ? 'Complete nombre, apellido, correo electrónico y teléfono válidos.' : 'Please provide a valid first name, last name, email and phone.' }

  if (kind === 'contact' && (!details.category || !details.message)) return { ok: false, message: language === 'es' ? 'Seleccione un tema y escriba un mensaje.' : 'Please select a topic and enter a message.' }
  if (kind !== 'contact' && (!details.position || !details.workAuthorized || !details.age18 || !details.signature)) return { ok: false, message: language === 'es' ? 'Complete los campos requeridos de empleo y la firma.' : 'Please complete the required employment fields and signature.' }

  return {
    ok: true,
    submission: {
      formKind: kind,
      language,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      company: details.company,
      category: details.category,
      details,
    },
  }
}
