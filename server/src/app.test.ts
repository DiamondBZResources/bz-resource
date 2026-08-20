import assert = require('node:assert/strict')
import test = require('node:test')
import request = require('supertest')
import { createApp } from './app.js'
import type { RuntimeConfig } from './types.js'

function testConfig(overrides: Partial<RuntimeConfig> = {}): RuntimeConfig {
  return {
    allowedOrigins: new Set(['https://allowed.example']), azureClientId: 'client-id', azureClientSecret: 'client-secret', azureTenantId: 'tenant-id',
    bodyLimit: '100kb', duplicateWindowMs: 5 * 60_000, enforceHttps: false, formRecipientEmail: 'recipient@example.com',
    graphSenderEmail: 'sender@example.com', isProduction: false, port: 4000, rateLimitMax: 5, rateLimitWindowMs: 15 * 60_000,
    recaptchaAllowedHostnames: new Set(), recaptchaSecretKey: 'recaptcha-secret', ...overrides,
  }
}

function validContact(overrides: Record<string, unknown> = {}) {
  return {
    company: 'Example Company', email: 'visitor@example.com', firstName: 'Ana', category: 'staffing', lastName: "O'Neil",
    message: 'We need help staffing our operations team next month.', phone: '+1 (352) 555-0100',
    security: { consent: true, startedAt: Date.now() - 2_000, recaptchaToken: 'valid-token-value', website: '' }, ...overrides,
  }
}

function validApplication(overrides: Record<string, unknown> = {}) {
  return {
    firstName: 'Ana', lastName: "O'Neil", email: 'ana@example.com', phone: '+1 (352) 555-0100', position: 'Warehouse Associate',
    workAuthorized: 'Yes', age18: 'Yes', signature: "Ana O'Neil", language: 'en', security: validContact().security, ...overrides,
  }
}

function createTestApp(config = testConfig(), verifyRecaptcha: () => Promise<boolean> = async () => true) {
  return createApp(config, { sendMail: async () => undefined, verifyRecaptcha })
}

test('accepts and delivers a valid form submission', async () => {
  let deliveries = 0
  const app = createApp(testConfig(), {
    sendMail: async (content) => {
      deliveries += 1
      assert.match(content.subject, /Website Contact Inquiry - Ana O'Neil$/)
      assert.match(content.text, /Website Contact Inquiry/)
      assert.match(content.html, /Request ID/)
    },
    verifyRecaptcha: async () => true,
  })
  const response = await request(app).post('/api/contact').set('Origin', 'https://allowed.example').send(validContact())
  assert.equal(response.status, 202)
  assert.equal(response.body.delivery, true)
  assert.equal(response.headers['cache-control'], 'no-store')
  assert.equal(response.headers.pragma, 'no-cache')
  assert.equal(deliveries, 1)
})

test('routes applicant and new-hire forms through the shared delivery service', async () => {
  const subjects: string[] = []
  const actions: string[] = []
  const app = createApp(testConfig(), {
    sendMail: async (content) => { subjects.push(content.subject) },
    verifyRecaptcha: async (_token, _ip, action) => { actions.push(action); return true },
  })
  const applicant = await request(app).post('/api/forms/applicant-questionnaire').send(validApplication())
  const newHire = await request(app).post('/api/forms/new-hire-application').send(validApplication({ email: 'newhire@example.com' }))
  assert.equal(applicant.status, 202)
  assert.equal(newHire.status, 202)
  assert.deepEqual(actions, ['applicant-questionnaire', 'new-hire-application'])
  assert.match(subjects[0], /Applicant Questionnaire/)
  assert.match(subjects[1], /New Hire Application/)
})

test('rejects missing required fields and invalid email formats', async () => {
  const app = createTestApp()
  assert.equal((await request(app).post('/api/contact').send(validContact({ firstName: '' }))).status, 400)
  assert.equal((await request(app).post('/api/contact').send(validContact({ email: 'not-an-email' }))).status, 400)
})

test('rejects links, HTML injection, and email-header injection', async () => {
  const app = createTestApp()
  const link = await request(app).post('/api/contact').send(validContact({ message: 'Please review https://example.com before calling us.' }))
  const html = await request(app).post('/api/contact').send(validContact({ message: 'This includes <script>alert(1)</script> content.' }))
  const header = await request(app).post('/api/contact').send(validContact({ firstName: 'Ana\r\nBcc: attacker@example.com' }))
  assert.equal(link.status, 400)
  assert.match(link.body.message, /Links/)
  assert.equal(html.status, 400)
  assert.equal(header.status, 400)
})

test('rejects oversized JSON requests', async () => {
  const response = await request(createTestApp(testConfig({ bodyLimit: '1kb' }))).post('/api/contact').send(validContact({ message: 'A'.repeat(1_500) }))
  assert.equal(response.status, 413)
})

test('rejects honeypot completion and missing or invalid reCAPTCHA tokens', async () => {
  const app = createTestApp()
  const bot = await request(app).post('/api/contact').send(validContact({ security: { ...validContact().security, website: 'spam' } }))
  const missing = await request(app).post('/api/contact').send(validContact({ security: { ...validContact().security, recaptchaToken: '' } }))
  const invalid = await request(createTestApp(testConfig(), async () => false)).post('/api/contact').send(validContact())
  assert.equal(bot.status, 400)
  assert.equal(missing.status, 400)
  assert.equal(invalid.status, 400)
})

test('rate limits by request identity', async () => {
  const app = createTestApp(testConfig({ rateLimitMax: 1 }))
  assert.equal((await request(app).post('/api/contact').send(validContact())).status, 202)
  assert.equal((await request(app).post('/api/contact').send(validContact({ email: 'second@example.com' }))).status, 429)
})

test('prevents duplicate submissions', async () => {
  const app = createTestApp()
  assert.equal((await request(app).post('/api/contact').send(validContact())).status, 202)
  assert.equal((await request(app).post('/api/contact').send(validContact())).status, 409)
})

test('rejects an unauthorized CORS origin', async () => {
  const response = await request(createTestApp()).post('/api/contact').set('Origin', 'https://unauthorized.example').send(validContact())
  assert.equal(response.status, 403)
  assert.equal(response.body.ok, false)
})
