export type CacheEntry<T> = {
  value: T
  expiresAt: number
}

export const defaultCacheTtlMs = 5 * 60 * 1000

const cache = new Map<string, CacheEntry<unknown>>()
const pendingRequests = new Map<string, Promise<unknown>>()

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key)

  if (!entry) {
    return undefined
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key)
    return undefined
  }

  return entry.value as T
}

export function setCached<T>(
  key: string,
  value: T,
  ttlMs = defaultCacheTtlMs,
): void {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  })
}

export function deleteCached(key: string): void {
  cache.delete(key)
  pendingRequests.delete(key)
}

export function clearCache(): void {
  cache.clear()
  pendingRequests.clear()
}

export async function cachedGet<T>(
  key: string,
  request: () => Promise<T>,
  ttlMs = defaultCacheTtlMs,
): Promise<T> {
  const cachedValue = getCached<T>(key)

  if (cachedValue !== undefined) {
    return cachedValue
  }

  const pending = pendingRequests.get(key) as Promise<T> | undefined

  if (pending) {
    return pending
  }

  const pendingRequest = request()
    .then((value) => {
      setCached(key, value, ttlMs)
      return value
    })
    .finally(() => {
      pendingRequests.delete(key)
    })

  pendingRequests.set(key, pendingRequest)

  return pendingRequest
}
