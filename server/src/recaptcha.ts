import type { RuntimeConfig } from './types'

type VerifyResult = {
  success?: boolean
  hostname?: string
  'error-codes'?: string[]
}

export class RecaptchaConfigurationError extends Error {}

export function createRecaptchaVerifier(config: RuntimeConfig, fetcher: typeof fetch = fetch) {
  return async function verify(token: string, remoteIp?: string) {
    if (!config.recaptchaSecretKey) {
      throw new RecaptchaConfigurationError('reCAPTCHA is not configured.')
    }

    const body = new URLSearchParams({ secret: config.recaptchaSecretKey, response: token })
    if (remoteIp) body.set('remoteip', remoteIp)

    const response = await fetcher('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) return false
    const result = (await response.json()) as VerifyResult
    if (!result.success) return false

    if (config.recaptchaAllowedHostnames.size > 0) {
      const hostname = result.hostname?.toLowerCase() ?? ''
      if (!config.recaptchaAllowedHostnames.has(hostname)) return false
    }

    return true
  }
}
