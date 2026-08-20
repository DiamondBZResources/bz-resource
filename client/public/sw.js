const CACHE_VERSION = 'bz-resources-v3'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const IMAGE_CACHE = `${CACHE_VERSION}-images`
const DOCUMENT_CACHE = `${CACHE_VERSION}-documents`
const PAGE_CACHE = `${CACHE_VERSION}-pages`
const EXPECTED_CACHES = [STATIC_CACHE, IMAGE_CACHE, DOCUMENT_CACHE, PAGE_CACHE]
const MAX_IMAGE_ENTRIES = 90
const MAX_PAGE_ENTRIES = 24
const NETWORK_TIMEOUT_MS = 3500

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.allSettled([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll([
        new URL('./', self.registration.scope).href,
        new URL('favicon.png', self.registration.scope).href,
      ])),
      self.skipWaiting(),
    ]),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        .filter((name) => name.startsWith('bz-resources-') && !EXPECTED_CACHES.includes(name))
        .map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin || isApiRequest(url)) return

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstPage(request))
    return
  }

  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, MAX_IMAGE_ENTRIES))
    return
  }

  if (url.pathname.includes('/resources/') || request.destination === 'document') {
    event.respondWith(cacheFirst(request, DOCUMENT_CACHE))
  }
})

function isApiRequest(url) {
  return url.pathname.endsWith('/api') || url.pathname.includes('/api/')
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')
}

function isHashedAsset(url) {
  return url.pathname.includes('/assets/')
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS)

  try {
    const response = await fetch(request, { cache: 'no-cache', signal: controller.signal })
    if (isCacheable(response)) {
      await cache.put(request, response.clone())
      await trimCache(cache, MAX_PAGE_ENTRIES)
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached

    const appShell = await caches.match(new URL('./', self.registration.scope).href)
    if (appShell) return appShell

    return new Response('<h1>Temporarily offline</h1><p>Please reconnect and try again.</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
      statusText: 'Offline',
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (isCacheable(response)) await cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const network = fetch(request).then(async (response) => {
    if (isCacheable(response)) {
      await cache.put(request, response.clone())
      await trimCache(cache, maxEntries)
    }
    return response
  }).catch(() => cached)

  return cached || network
}

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys()
  const overflow = keys.length - maxEntries
  if (overflow > 0) await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)))
}

function isCacheable(response) {
  return response && response.ok && response.type !== 'opaque' && !response.headers.get('Cache-Control')?.includes('no-store')
}
