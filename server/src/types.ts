export type FormKind = 'contact' | 'applicant-questionnaire' | 'new-hire-application'

export type RuntimeConfig = {
  allowedOrigins: Set<string>
  azureTenantId: string
  azureClientId: string
  azureClientSecret: string
  graphSenderEmail: string
  formRecipientEmail: string
  recaptchaSecretKey: string
  recaptchaAllowedHostnames: Set<string>
  duplicateWindowMs: number
  enforceHttps: boolean
  rateLimitMax: number
  rateLimitWindowMs: number
  bodyLimit: string
  port: number
  isProduction: boolean
}

export type SecurityProof = {
  consent: true
  startedAt: number
  website: string
  recaptchaToken: string
}

export type NormalizedSubmission = {
  formKind: FormKind
  language: 'en' | 'es'
  name: string
  email: string
  phone: string
  company?: string
  category?: string
  details: Record<string, string>
}

export type MailContent = {
  subject: string
  html: string
  text: string
  replyTo?: string
}
