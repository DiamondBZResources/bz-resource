import type { RuntimeConfig } from './types'

function toSet(value: string | undefined) {
  return new Set((value ?? '').split(',').map((item) => item.trim().replace(/\/$/, '')).filter(Boolean))
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const isProduction = env.NODE_ENV === 'production'
  const allowedOrigins = toSet(env.ALLOWED_ORIGIN)
  if (!isProduction) {
    allowedOrigins.add('http://localhost:5173')
    allowedOrigins.add('http://localhost:5174')
  }

  return {
    allowedOrigins,
    azureTenantId: env.AZURE_TENANT_ID?.trim() ?? '',
    azureClientId: env.AZURE_CLIENT_ID?.trim() ?? '',
    azureClientSecret: env.AZURE_CLIENT_SECRET?.trim() ?? '',
    graphSenderEmail: env.GRAPH_SENDER_EMAIL?.trim() ?? '',
    formRecipientEmail: env.FORM_RECIPIENT_EMAIL?.trim() ?? '',
    recaptchaSecretKey: env.RECAPTCHA_SECRET_KEY?.trim() ?? '',
    recaptchaAllowedHostnames: toSet(env.RECAPTCHA_ALLOWED_HOSTNAMES),
    duplicateWindowMs: Math.max(60_000, (Number(env.FORM_DUPLICATE_WINDOW_MINUTES) || 5) * 60_000),
    enforceHttps: isProduction && env.ENFORCE_HTTPS !== 'false',
    rateLimitMax: Math.max(1, Number(env.FORM_RATE_LIMIT_MAX) || 8),
    rateLimitWindowMs: Math.max(60_000, (Number(env.FORM_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60_000),
    bodyLimit: env.FORM_BODY_LIMIT?.trim() || '100kb',
    port: Number(env.PORT) || 4000,
    isProduction,
  }
}
