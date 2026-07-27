import { cachedGet, defaultCacheTtlMs } from './cache'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
}

export function getApiUrl(endpoint: string): string | undefined {
  const normalizedEndpoint = normalizeEndpoint(endpoint)

  if (!configuredApiBaseUrl) {
    return import.meta.env.DEV ? normalizedEndpoint : undefined
  }

  return `${configuredApiBaseUrl.replace(/\/+$/, '')}${normalizedEndpoint}`
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as T

  if (!response.ok) {
    const message =
      typeof result === 'object' &&
      result !== null &&
      'message' in result &&
      typeof result.message === 'string'
        ? result.message
        : 'The request could not be completed.'

    throw new Error(message)
  }

  return result
}

export async function getJson<T>(
  endpoint: string,
  options: {
    cacheKey: string
    ttlMs?: number
  },
): Promise<T> {
  const url = getApiUrl(endpoint)

  if (!url) {
    throw new Error('This API is not configured for the production website.')
  }

  return cachedGet(
    options.cacheKey,
    async () => {
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: { Accept: 'application/json' },
        method: 'GET',
      })

      return parseJsonResponse<T>(response)
    },
    options.ttlMs ?? defaultCacheTtlMs,
  )
}

export async function postJson<TRequest extends object, TResponse>(
  endpoint: string,
  body: TRequest,
): Promise<TResponse> {
  const url = getApiUrl(endpoint)

  if (!url) {
    throw new Error(
      'Online form submission is not configured for this website yet. Please contact BZ Resources by phone or email.',
    )
  }

  const response = await fetch(url, {
    body: JSON.stringify(body),
    cache: 'no-store',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    redirect: 'error',
    referrerPolicy: 'strict-origin-when-cross-origin',
    signal: AbortSignal.timeout(20_000),
  })

  return parseJsonResponse<TResponse>(response)
}
