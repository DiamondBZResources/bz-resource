import crypto from 'node:crypto'
import type { Request, RequestHandler } from 'express'

export function requestId(): RequestHandler {
  return (_req, res, next) => {
    res.locals.requestId = crypto.randomUUID()
    res.setHeader('X-Request-Id', res.locals.requestId)
    next()
  }
}

export function securityHeaders(): RequestHandler {
  return (_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    next()
  }
}

export function clientIp(req: Request) {
  const cloudflare = req.get('CF-Connecting-IP')?.trim()
  const forwarded = req.get('X-Forwarded-For')?.split(',')[0]?.trim()
  return cloudflare || forwarded || req.ip || req.socket.remoteAddress || 'unknown'
}

const unsafeKeys = /^(?:__proto__|prototype|constructor)$/i
const fileLikeKeys = /(?:attachment|base64|binary|blob|document|file(?:name)?|mime|upload)/i
const executableContent = /(?:<\s*(?:script|iframe|object|embed|svg)|javascript\s*:|data\s*:\s*text\/html|\$\{\s*jndi\s*:)/i
const webLink = /(?:https?:\/\/|www\.)/i

export function scanJsonPayload(value: unknown): { ok: true } | { ok: false; message: string } {
  const visit = (item: unknown, path: string): boolean => {
    if (typeof item === 'string') {
      const canonical = item.normalize('NFKC').replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
      if (executableContent.test(canonical) || (path !== 'security.recaptchaToken' && webLink.test(canonical))) return false
      if (path !== 'security.recaptchaToken' && canonical.length >= 4_096 && /^[A-Za-z0-9+/=_-]+$/.test(canonical)) return false
      return true
    }
    if (Array.isArray(item)) return item.every((entry, index) => visit(entry, `${path}[${index}]`))
    if (!item || typeof item !== 'object') return true
    for (const [key, child] of Object.entries(item as Record<string, unknown>)) {
      if (unsafeKeys.test(key) || fileLikeKeys.test(key)) return false
      if (!visit(child, path ? `${path}.${key}` : key)) return false
    }
    return true
  }

  return visit(value, '')
    ? { ok: true }
    : { ok: false, message: 'Links, executable content and file uploads are not permitted in this form.' }
}

export function createRateLimiter(windowMs: number, max: number): RequestHandler {
  const buckets = new Map<string, { count: number; reset: number }>()
  return (req, res, next) => {
    const now = Date.now()
    const key = crypto.createHash('sha256').update(`${clientIp(req)}:${req.path}`).digest('hex')
    const existing = buckets.get(key)
    const bucket = !existing || existing.reset <= now ? { count: 0, reset: now + windowMs } : existing
    bucket.count += 1
    buckets.set(key, bucket)
    if (buckets.size > 10_000) {
      for (const [bucketKey, item] of buckets) if (item.reset <= now) buckets.delete(bucketKey)
    }
    res.setHeader('RateLimit-Limit', String(max))
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - bucket.count)))
    if (bucket.count > max) {
      res.status(429).json({ ok: false, message: 'Too many submissions. Please wait and try again.', requestId: res.locals.requestId })
      return
    }
    next()
  }
}
