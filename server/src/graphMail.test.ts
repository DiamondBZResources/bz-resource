import assert = require('node:assert/strict')
import test = require('node:test')
import type { RuntimeConfig } from './types.js'
import { createGraphMailClient, GraphAuthenticationError, GraphDeliveryError } from './graphMail.js'

const config: RuntimeConfig = {
  allowedOrigins: new Set(), azureClientId: 'client-id', azureClientSecret: 'client-secret', azureTenantId: 'tenant-id',
  bodyLimit: '100kb', duplicateWindowMs: 300_000, enforceHttps: false, formRecipientEmail: 'recipient@example.com',
  graphSenderEmail: 'sender@example.com', isProduction: false, port: 4000, rateLimitMax: 5, rateLimitWindowMs: 900_000,
  recaptchaAllowedHostnames: new Set(), recaptchaSecretKey: 'recaptcha-secret',
}

const content = { html: '<p>HTML version</p>', text: 'Plain text version', subject: 'Website inquiry', replyTo: 'visitor@example.com' }

test('reports Microsoft Graph authentication failures without exposing token details', async () => {
  const fetcher = (async () => new Response('', { status: 401 })) as typeof fetch
  await assert.rejects(() => createGraphMailClient(config, fetcher).sendMail(content), GraphAuthenticationError)
})

test('reports Microsoft Graph delivery failures', async () => {
  let calls = 0
  const fetcher = (async () => {
    calls += 1
    if (calls === 1) return new Response(JSON.stringify({ access_token: 'secret-token', expires_in: 3600 }), { headers: { 'Content-Type': 'application/json' }, status: 200 })
    return new Response('', { status: 500 })
  }) as typeof fetch
  await assert.rejects(() => createGraphMailClient(config, fetcher).sendMail(content), GraphDeliveryError)
})

test('sends a structured HTML message through Microsoft Graph', async () => {
  let delivery: { url: string; authorization: string; body: Record<string, unknown> } | undefined
  let calls = 0
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    calls += 1
    if (calls === 1) return new Response(JSON.stringify({ access_token: 'secret-token', expires_in: 3600 }), { headers: { 'Content-Type': 'application/json' }, status: 200 })
    delivery = { url: String(input), authorization: new Headers(init?.headers).get('Authorization') ?? '', body: JSON.parse(String(init?.body)) as Record<string, unknown> }
    return new Response('', { status: 202 })
  }) as typeof fetch
  await createGraphMailClient(config, fetcher).sendMail(content)
  assert.ok(delivery)
  assert.match(delivery.url, /graph\.microsoft\.com\/v1\.0\/users\/sender%40example\.com\/sendMail$/)
  assert.equal(delivery.authorization, 'Bearer secret-token')
  assert.equal((delivery.body.message as { subject?: string }).subject, 'Website inquiry')
  assert.equal(delivery.body.saveToSentItems, true)
  assert.doesNotMatch(JSON.stringify(delivery?.body), /secret-token/)
})
