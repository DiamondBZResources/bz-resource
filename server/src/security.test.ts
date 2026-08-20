import assert = require('node:assert/strict')
import test = require('node:test')
import { scanJsonPayload } from './security.js'
import { validateSecurity } from './validation.js'

test('accepts ordinary questionnaire data and reCAPTCHA tokens', () => {
  const result = scanJsonPayload({ applicantName: 'Example Applicant', shifts: ['first', 'second'], security: { recaptchaToken: 'A'.repeat(4_096) } })
  assert.deepEqual(result, { ok: true })
})

test('blocks executable markup', () => {
  assert.equal(scanJsonPayload({ comments: '<script src="https://example.invalid/payload.js"></script>' }).ok, false)
})

test('blocks file-like fields and encoded binary', () => {
  assert.equal(scanJsonPayload({ filename: 'payload.exe' }).ok, false)
  assert.equal(scanJsonPayload({ notes: 'A'.repeat(4_096) }).ok, false)
})

test('blocks prototype pollution keys', () => {
  const payload = JSON.parse('{"__proto__":{"polluted":true}}') as unknown
  assert.equal(scanJsonPayload(payload).ok, false)
})

test('validates the bot trap and completion timestamp', () => {
  const valid = validateSecurity({ consent: true, startedAt: Date.now() - 2_000, recaptchaToken: 'test-token-value', website: '' })
  const bot = validateSecurity({ consent: true, startedAt: Date.now() - 2_000, recaptchaToken: 'test-token-value', website: 'spam' })
  assert.equal(valid.ok, true)
  assert.equal(bot.ok, false)
})

test('blocks links, HTML, and invisible-character bypasses', () => {
  assert.equal(scanJsonPayload({ message: 'Visit https://example.invalid' }).ok, false)
  assert.equal(scanJsonPayload({ message: '<script>alert(1)</script>' }).ok, false)
  assert.equal(scanJsonPayload({ message: 'Visit h\u200Bttps://example.invalid' }).ok, false)
})
