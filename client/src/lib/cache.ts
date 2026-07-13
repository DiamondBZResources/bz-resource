export type CacheStatus = 'fresh' | 'stale' | 'miss'

export type CacheEntry<T> = {
  value: T
  createdAt: number
  expiresAt: number
  staleUntil: number
  lastAccessedAt: number
  tags: ReadonlySet<string>
}

export type CacheLookup<T> =
  | {
      status: 'fresh' | 'stale'
      value: T
      entry: CacheEntry<T>
    }
  | {
      status: 'miss'
      value?: never
      entry?: never
    }

export type CacheWriteOptions = {
  /**
   * How long the entry is considered fresh.
   *
   * Default: 5 minutes.
   */
  ttlMs?: number

  /**
   * How long an expired entry may still be returned while a refresh occurs.
   *
   * Set to 0 to disable stale-while-revalidate for this entry.
   *
   * Default: 10 minutes.
   */
  staleTtlMs?: number

  /**
   * Tags that can later be invalidated together.
   */
  tags?: readonly string[]
}

export type CachedGetOptions = CacheWriteOptions & {
  /**
   * Return stale data when available.
   *
   * Default: true.
   */
  allowStale?: boolean

  /**
   * Refresh stale data in the background while immediately returning
   * the stale value.
   *
   * Default: true.
   */
  revalidateInBackground?: boolean

  /**
   * Skip existing cached data and perform a new request.
   *
   * Requests for the same key are still deduplicated.
   *
   * Default: false.
   */
  forceRefresh?: boolean
}

export type MemoryCacheOptions = {
  /**
   * Default fresh lifetime.
   *
   * Default: 5 minutes.
   */
  defaultTtlMs?: number

  /**
   * Default stale lifetime after the fresh TTL expires.
   *
   * Default: 10 minutes.
   */
  defaultStaleTtlMs?: number

  /**
   * Maximum number of entries retained in memory.
   *
   * Least-recently-used entries are removed first.
   *
   * Default: 250.
   */
  maxEntries?: number

  /**
   * How often fully expired entries are cleaned up.
   *
   * Set to 0 to disable timed cleanup. Lazy cleanup still occurs.
   *
   * Default: 60 seconds.
   */
  cleanupIntervalMs?: number
}

export type CacheStats = {
  size: number
  pendingRequests: number
  hits: number
  staleHits: number
  misses: number
  deduplicatedRequests: number
  writes: number
  deletions: number
  evictions: number
  requestErrors: number
  backgroundRefreshes: number
}

type InternalStats = Omit<CacheStats, 'size' | 'pendingRequests'>

const FIVE_MINUTES = 5 * 60 * 1000
const TEN_MINUTES = 10 * 60 * 1000
const ONE_MINUTE = 60 * 1000

function normalizeDuration(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite, non-negative number.`)
  }

  return value
}

function normalizeKey(key: string): string {
  const normalized = key.trim()

  if (!normalized) {
    throw new Error('Cache key cannot be empty.')
  }

  return normalized
}

export class MemoryCache {
  private readonly cache = new Map<string, CacheEntry<unknown>>()

  private readonly pendingRequests = new Map<string, Promise<unknown>>()

  /**
   * Incremented when a key is invalidated.
   *
   * This prevents an older pending request from restoring data after the key
   * was intentionally deleted.
   */
  private readonly generations = new Map<string, number>()

  private readonly defaultTtlMs: number

  private readonly defaultStaleTtlMs: number

  private readonly maxEntries: number

  private cleanupTimer: ReturnType<typeof setInterval> | undefined

  private stats: InternalStats = {
    hits: 0,
    staleHits: 0,
    misses: 0,
    deduplicatedRequests: 0,
    writes: 0,
    deletions: 0,
    evictions: 0,
    requestErrors: 0,
    backgroundRefreshes: 0,
  }

  constructor(options: MemoryCacheOptions = {}) {
    this.defaultTtlMs = normalizeDuration(
      options.defaultTtlMs ?? FIVE_MINUTES,
      'defaultTtlMs',
    )

    this.defaultStaleTtlMs = normalizeDuration(
      options.defaultStaleTtlMs ?? TEN_MINUTES,
      'defaultStaleTtlMs',
    )

    const maxEntries = options.maxEntries ?? 250

    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError('maxEntries must be a positive integer.')
    }

    this.maxEntries = maxEntries

    const cleanupIntervalMs = normalizeDuration(
      options.cleanupIntervalMs ?? ONE_MINUTE,
      'cleanupIntervalMs',
    )

    if (cleanupIntervalMs > 0) {
      this.cleanupTimer = setInterval(() => {
        this.deleteExpired()
      }, cleanupIntervalMs)

      /**
       * Prevent this timer from keeping a Node process alive.
       * Browsers do not expose unref().
       */
      const timerWithUnref = this.cleanupTimer as ReturnType<
        typeof setInterval
      > & {
        unref?: () => void
      }

      timerWithUnref.unref?.()
    }
  }

  lookup<T>(key: string): CacheLookup<T> {
    const normalizedKey = normalizeKey(key)
    const entry = this.cache.get(normalizedKey)

    if (!entry) {
      this.stats.misses += 1
      return { status: 'miss' }
    }

    const now = Date.now()

    if (entry.staleUntil <= now) {
      this.cache.delete(normalizedKey)
      this.stats.misses += 1
      return { status: 'miss' }
    }

    entry.lastAccessedAt = now

    if (entry.expiresAt <= now) {
      this.stats.staleHits += 1

      return {
        status: 'stale',
        value: entry.value as T,
        entry: entry as CacheEntry<T>,
      }
    }

    this.stats.hits += 1

    return {
      status: 'fresh',
      value: entry.value as T,
      entry: entry as CacheEntry<T>,
    }
  }

  /**
   * Returns only fresh cache data.
   *
   * Unlike a simple `T | undefined` cache check, `hasFresh()` can distinguish
   * between a missing entry and a cached value that is actually undefined.
   */
  get<T>(key: string): T | undefined {
    const result = this.lookup<T>(key)

    return result.status === 'fresh' ? result.value : undefined
  }

  hasFresh(key: string): boolean {
    return this.lookup(key).status === 'fresh'
  }

  set<T>(
    key: string,
    value: T,
    options: CacheWriteOptions = {},
  ): CacheEntry<T> {
    const normalizedKey = normalizeKey(key)
    const now = Date.now()

    const ttlMs = normalizeDuration(
      options.ttlMs ?? this.defaultTtlMs,
      'ttlMs',
    )

    const staleTtlMs = normalizeDuration(
      options.staleTtlMs ?? this.defaultStaleTtlMs,
      'staleTtlMs',
    )

    const entry: CacheEntry<T> = {
      value,
      createdAt: now,
      expiresAt: now + ttlMs,
      staleUntil: now + ttlMs + staleTtlMs,
      lastAccessedAt: now,
      tags: new Set(options.tags ?? []),
    }

    this.cache.set(normalizedKey, entry)
    this.stats.writes += 1

    this.evictLeastRecentlyUsed()

    return entry
  }

  delete(key: string): boolean {
    const normalizedKey = normalizeKey(key)

    this.bumpGeneration(normalizedKey)
    this.pendingRequests.delete(normalizedKey)

    const deleted = this.cache.delete(normalizedKey)

    if (deleted) {
      this.stats.deletions += 1
    }

    return deleted
  }

  deleteByPrefix(prefix: string): number {
    const normalizedPrefix = prefix.trim()

    if (!normalizedPrefix) {
      throw new Error('Cache prefix cannot be empty.')
    }

    const matchingKeys = [...this.cache.keys()].filter((key) =>
      key.startsWith(normalizedPrefix),
    )

    for (const key of matchingKeys) {
      this.delete(key)
    }

    return matchingKeys.length
  }

  deleteByTag(tag: string): number {
    const normalizedTag = tag.trim()

    if (!normalizedTag) {
      throw new Error('Cache tag cannot be empty.')
    }

    const matchingKeys = [...this.cache.entries()]
      .filter(([, entry]) => entry.tags.has(normalizedTag))
      .map(([key]) => key)

    for (const key of matchingKeys) {
      this.delete(key)
    }

    return matchingKeys.length
  }

  clear(): void {
    const keys = new Set([
      ...this.cache.keys(),
      ...this.pendingRequests.keys(),
    ])

    for (const key of keys) {
      this.bumpGeneration(key)
    }

    this.cache.clear()
    this.pendingRequests.clear()
  }

  /**
   * Removes entries that are beyond both their fresh and stale lifetimes.
   */
  deleteExpired(now = Date.now()): number {
    let deletedCount = 0

    for (const [key, entry] of this.cache) {
      if (entry.staleUntil <= now) {
        this.cache.delete(key)
        deletedCount += 1
      }
    }

    this.stats.deletions += deletedCount

    return deletedCount
  }

  async cachedGet<T>(
    key: string,
    request: () => Promise<T>,
    options: CachedGetOptions = {},
  ): Promise<T> {
    const normalizedKey = normalizeKey(key)

    const {
      allowStale = true,
      revalidateInBackground = true,
      forceRefresh = false,
      ttlMs = this.defaultTtlMs,
      staleTtlMs = this.defaultStaleTtlMs,
      tags,
    } = options

    if (!forceRefresh) {
      const lookup = this.lookup<T>(normalizedKey)

      if (lookup.status === 'fresh') {
        return lookup.value
      }

      if (lookup.status === 'stale' && allowStale) {
        if (revalidateInBackground) {
          this.stats.backgroundRefreshes += 1

          void this.executeRequest(
            normalizedKey,
            request,
            {
              ttlMs,
              staleTtlMs,
              tags,
            },
          ).catch(() => {
            /**
             * The caller already received usable stale data. The failed
             * background refresh is counted internally and intentionally
             * does not create an unhandled rejection.
             */
          })
        }

        return lookup.value
      }
    }

    return this.executeRequest(normalizedKey, request, {
      ttlMs,
      staleTtlMs,
      tags,
    })
  }

  getStats(): Readonly<CacheStats> {
    return {
      ...this.stats,
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size,
    }
  }

  resetStats(): void {
    this.stats = {
      hits: 0,
      staleHits: 0,
      misses: 0,
      deduplicatedRequests: 0,
      writes: 0,
      deletions: 0,
      evictions: 0,
      requestErrors: 0,
      backgroundRefreshes: 0,
    }
  }

  keys(): string[] {
    return [...this.cache.keys()]
  }

  size(): number {
    return this.cache.size
  }

  dispose(): void {
    if (this.cleanupTimer !== undefined) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }

    this.clear()
  }

  private async executeRequest<T>(
    key: string,
    request: () => Promise<T>,
    options: CacheWriteOptions,
  ): Promise<T> {
    const existingRequest = this.pendingRequests.get(key)

    if (existingRequest) {
      this.stats.deduplicatedRequests += 1
      return existingRequest as Promise<T>
    }

    const generationAtRequestStart = this.getGeneration(key)

    const pendingRequest = Promise.resolve()
      .then(request)
      .then((value) => {
        /**
         * Do not repopulate the cache when delete(), clear(), or tag/prefix
         * invalidation occurred while the request was in flight.
         */
        if (this.getGeneration(key) === generationAtRequestStart) {
          this.set(key, value, options)
        }

        return value
      })
      .catch((error: unknown) => {
        this.stats.requestErrors += 1
        throw error
      })
      .finally(() => {
        const currentPending = this.pendingRequests.get(key)

        /**
         * Delete only this exact promise. This avoids removing a newer request
         * that may have replaced it.
         */
        
        if (currentPending === pendingRequest) {
          this.pendingRequests.delete(key)
        }
      })

    this.pendingRequests.set(key, pendingRequest)

    return pendingRequest
  }

  private evictLeastRecentlyUsed(): void {
    while (this.cache.size > this.maxEntries) {
      let oldestKey: string | undefined
      let oldestAccessTime = Number.POSITIVE_INFINITY

      for (const [key, entry] of this.cache) {
        if (entry.lastAccessedAt < oldestAccessTime) {
          oldestAccessTime = entry.lastAccessedAt
          oldestKey = key
        }
      }

      if (oldestKey === undefined) {
        return
      }

      this.cache.delete(oldestKey)
      this.stats.evictions += 1
    }
  }

  private getGeneration(key: string): number {
    return this.generations.get(key) ?? 0
  }

  private bumpGeneration(key: string): void {
    this.generations.set(key, this.getGeneration(key) + 1)
  }
}

export const defaultCacheTtlMs = FIVE_MINUTES

export const appCache = new MemoryCache({
  defaultTtlMs: FIVE_MINUTES,
  defaultStaleTtlMs: TEN_MINUTES,
  maxEntries: 250,
  cleanupIntervalMs: ONE_MINUTE,
})

export function getCached<T>(key: string): T | undefined {
  return appCache.get<T>(key)
}

export function setCached<T>(
  key: string,
  value: T,
  ttlMs = defaultCacheTtlMs,
): void {
  appCache.set(key, value, { ttlMs })
}

export function deleteCached(key: string): void {
  appCache.delete(key)
}

export function clearCache(): void {
  appCache.clear()
}

export function cachedGet<T>(
  key: string,
  request: () => Promise<T>,
  ttlMs = defaultCacheTtlMs,
): Promise<T> {
  return appCache.cachedGet(key, request, { ttlMs })
}