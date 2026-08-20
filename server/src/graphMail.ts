import type { MailContent, RuntimeConfig } from './types'

export class GraphConfigurationError extends Error {}
export class GraphAuthenticationError extends Error {}
export class GraphDeliveryError extends Error {}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n]/.test(value)
}

export function createGraphMailClient(config: RuntimeConfig, fetcher: typeof fetch = fetch) {
  let cachedToken: { value: string; expiresAt: number } | undefined

  function requireConfig() {
    const values = [config.azureTenantId, config.azureClientId, config.azureClientSecret, config.graphSenderEmail, config.formRecipientEmail]
    if (values.some((value) => !value)) throw new GraphConfigurationError('Microsoft Graph delivery is not configured.')
    if (!validEmail(config.graphSenderEmail) || !validEmail(config.formRecipientEmail)) throw new GraphConfigurationError('Graph sender or recipient email is invalid.')
  }

  async function getToken() {
    requireConfig()
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

    const response = await fetcher(`https://login.microsoftonline.com/${encodeURIComponent(config.azureTenantId)}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.azureClientId,
        client_secret: config.azureClientSecret,
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default',
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) throw new GraphAuthenticationError(`Microsoft identity returned ${response.status}.`)
    const payload = (await response.json()) as { access_token?: unknown; expires_in?: unknown }
    if (typeof payload.access_token !== 'string') throw new GraphAuthenticationError('No Graph access token was returned.')
    const expiresIn = typeof payload.expires_in === 'number' ? payload.expires_in : 3600
    cachedToken = { value: payload.access_token, expiresAt: Date.now() + expiresIn * 1000 }
    return cachedToken.value
  }

  async function sendMail(content: MailContent) {
    const token = await getToken()
    const replyTo = content.replyTo && validEmail(content.replyTo)
      ? [{ emailAddress: { address: content.replyTo } }]
      : undefined

    const response = await fetcher(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.graphSenderEmail)}/sendMail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject: content.subject,
          body: { contentType: 'HTML', content: content.html },
          toRecipients: [{ emailAddress: { address: config.formRecipientEmail } }],
          ...(replyTo ? { replyTo } : {}),
        },
        saveToSentItems: true,
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (response.status !== 202) throw new GraphDeliveryError(`Microsoft Graph returned ${response.status}.`)
  }

  return { sendMail }
}
