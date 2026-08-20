const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

function apiUrl(endpoint: string) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  if (!configuredApiBaseUrl) return import.meta.env.DEV ? path : undefined
  return `${configuredApiBaseUrl.replace(/\/+$/, '')}${path}`
}

export async function postJson<TRequest extends object, TResponse>(endpoint: string, body: TRequest): Promise<TResponse> {
  const url = apiUrl(endpoint)
  if (!url) throw new Error('Online form submission is not configured yet. Please contact BZ Resources by phone or email.')

  const response = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
    credentials: 'omit',
    redirect: 'error',
    referrerPolicy: 'strict-origin-when-cross-origin',
    signal: AbortSignal.timeout(20000),
  })

  const result = (await response.json().catch(() => ({ message: 'The server returned an unexpected response.' }))) as TResponse & { message?: string }
  if (!response.ok) throw new Error(result.message || 'The request could not be completed.')
  return result
}
