import cors from 'cors'
import crypto from 'node:crypto'
import express from 'express'
import type { FormKind, MailContent, RuntimeConfig } from './types'
import { createGraphMailClient, GraphAuthenticationError, GraphConfigurationError, GraphDeliveryError } from './graphMail'
import { createRecaptchaVerifier, RecaptchaConfigurationError } from './recaptcha'
import { buildMail } from './emailTemplate'
import { clientIp, createRateLimiter, requestId, scanJsonPayload, securityHeaders } from './security'
import { validateSecurity, validateSubmission } from './validation'

type AppDependencies = {
  sendMail?: (content: MailContent) => Promise<void>
  verifyRecaptcha?: (token: string, remoteIp: string, formKind: FormKind) => Promise<boolean>
}

export function createApp(config: RuntimeConfig, dependencies: AppDependencies = {}) {
  const app = express()
  const graph = createGraphMailClient(config)
  const configuredVerifier = createRecaptchaVerifier(config)
  const verifyRecaptcha = dependencies.verifyRecaptcha ?? ((token: string, remoteIp: string) => configuredVerifier(token, remoteIp))
  const sendMail = dependencies.sendMail ?? graph.sendMail
  const recentSubmissions = new Map<string, number>()

  app.disable('x-powered-by')
  if (config.isProduction) app.set('trust proxy', 1)
  app.use(requestId())
  app.use(securityHeaders())
  app.use(cors({
    credentials: false,
    methods: ['GET', 'POST', 'OPTIONS'],
    origin(origin, callback) {
      const normalized = origin?.replace(/\/$/, '')
      if (!normalized || config.allowedOrigins.has(normalized)) return callback(null, true)
      callback(new Error('CORS_BLOCKED'))
    },
  }))
  app.use(express.json({ limit: config.bodyLimit, strict: true, type: 'application/json' }))
  if (config.enforceHttps) {
    app.use((req, res, next) => {
      const protocol = req.get('X-Forwarded-Proto')?.split(',')[0]?.trim() || req.protocol
      if (protocol !== 'https') return res.status(400).json({ ok: false, message: 'HTTPS is required.', requestId: res.locals.requestId })
      next()
    })
  }

  app.get('/api/health', (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=60')
    res.json({ status: 'ok' })
  })

  const limiter = createRateLimiter(config.rateLimitWindowMs, config.rateLimitMax)

  async function handle(kind: FormKind, req: express.Request, res: express.Response) {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    const scan = scanJsonPayload(req.body)
    if (!scan.ok) return res.status(400).json({ ok: false, message: scan.message, requestId: res.locals.requestId })
    const security = validateSecurity((req.body as Record<string, unknown>)?.security)
    if (!security.ok) return res.status(400).json({ ok: false, message: security.message, requestId: res.locals.requestId })

    try {
      const passed = await verifyRecaptcha(security.proof.recaptchaToken, clientIp(req), kind)
      if (!passed) return res.status(400).json({ ok: false, message: 'Please complete the reCAPTCHA verification and try again.', requestId: res.locals.requestId })
    } catch (error) {
      if (error instanceof RecaptchaConfigurationError) return res.status(503).json({ ok: false, message: 'Online form security is not configured yet.', requestId: res.locals.requestId })
      throw error
    }

    const result = validateSubmission(kind, req.body)
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message, requestId: res.locals.requestId })

    const now = Date.now()
    for (const [storedHash, storedAt] of recentSubmissions) {
      if (storedAt + config.duplicateWindowMs <= now) recentSubmissions.delete(storedHash)
    }
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify(result.submission)).digest('hex')
    if ((recentSubmissions.get(fingerprint) ?? 0) + config.duplicateWindowMs > now) {
      return res.status(409).json({ ok: false, message: result.submission.language === 'es' ? 'Este formulario ya fue enviado.' : 'This form was already submitted.', requestId: res.locals.requestId })
    }
    recentSubmissions.set(fingerprint, now)

    try {
      await sendMail(buildMail(result.submission, res.locals.requestId))
      const message = result.submission.language === 'es'
        ? (kind === 'contact' ? 'Su mensaje fue enviado. BZ Resources se pondrá en contacto con usted.' : 'Su formulario fue enviado correctamente.')
        : (kind === 'contact' ? 'Your message was sent. BZ Resources will be in touch.' : 'Your form was submitted successfully.')
      return res.status(202).json({ ok: true, delivery: true, message, requestId: res.locals.requestId })
    } catch (error) {
      recentSubmissions.delete(fingerprint)
      const type = error instanceof GraphConfigurationError ? 'configuration' : error instanceof GraphAuthenticationError ? 'authentication' : error instanceof GraphDeliveryError ? 'delivery' : 'unexpected'
      console.error('Form delivery failed', { type, kind, requestId: res.locals.requestId })
      return res.status(type === 'configuration' ? 503 : 502).json({ ok: false, message: 'We could not send the form right now. Please try again shortly.', requestId: res.locals.requestId })
    }
  }

  app.post('/api/contact', limiter, (req, res, next) => { void handle('contact', req, res).catch(next) })
  app.post('/api/forms/:kind', limiter, (req, res, next) => {
    const kind = req.params.kind
    if (kind !== 'applicant-questionnaire' && kind !== 'new-hire-application') return res.status(404).json({ ok: false, message: 'Unknown form type.', requestId: res.locals.requestId })
    void handle(kind, req, res).catch(next)
  })

  app.use(((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof Error && error.message === 'CORS_BLOCKED') return res.status(403).json({ ok: false, message: 'This website is not allowed to submit forms to the API.', requestId: res.locals.requestId })
    const record = typeof error === 'object' && error !== null ? error as Record<string, unknown> : {}
    if (record.type === 'entity.too.large') return res.status(413).json({ ok: false, message: 'The form submission is too large.', requestId: res.locals.requestId })
    if (error instanceof SyntaxError) return res.status(400).json({ ok: false, message: 'The request body is invalid JSON.', requestId: res.locals.requestId })
    console.error('Unhandled API error', { requestId: res.locals.requestId, error: error instanceof Error ? error.name : 'UnknownError' })
    return res.status(500).json({ ok: false, message: 'An unexpected server error occurred.', requestId: res.locals.requestId })
  }) as express.ErrorRequestHandler)

  return app
}
