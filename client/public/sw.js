const CACHE_VERSION = 'bz-resources-v2'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const HTML_CACHE = `${CACHE_VERSION}-html`
const EXPECTED_CACHES = [STATIC_CACHE, HTML_CACHE]

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !EXPECTED_CACHES.includes(cacheName))
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const requestUrl = new URL(request.url)
  if (requestUrl.origin !== self.location.origin || isApiRequest(requestUrl)) return

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request, HTML_CACHE))
    return
  }

  if (isHashedBuildAsset(requestUrl)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  }
})

function isApiRequest(url) {
  return url.pathname.endsWith('/api') || url.pathname.includes('/api/')
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')
}

function isHashedBuildAsset(url) {
  return url.pathname.includes('/assets/')
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request, { cache: 'no-cache' })
    if (isCacheable(response)) await cache.put(request, response.clone())
    return response
  } catch {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) return cachedResponse

    return new Response('', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
      statusText: 'Offline',
    })
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  if (cachedResponse) return cachedResponse

  const response = await fetch(request)
  if (isCacheable(response)) await cache.put(request, response.clone())
  return response
}

function isCacheable(response) {
  return (
    response &&
    response.ok &&
    response.type !== 'opaque' &&
    !response.headers.get('Cache-Control')?.includes('no-store')
  )
}
