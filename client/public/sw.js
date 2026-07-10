const CACHE_VERSION = 'bz-resources-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const IMAGE_CACHE = `${CACHE_VERSION}-images`
const HTML_CACHE = `${CACHE_VERSION}-html`
const EXPECTED_CACHES = [STATIC_CACHE, IMAGE_CACHE, HTML_CACHE]

const CORE_IMAGE_ASSETS = ['./images/BZ-Logo.png.webp']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(IMAGE_CACHE)
      .then((cache) => cache.addAll(CORE_IMAGE_ASSETS))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  )
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

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.origin !== self.location.origin || isApiRequest(requestUrl)) {
    return
  }

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request, HTML_CACHE))
    return
  }

  if (isStaticAsset(request, requestUrl)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  if (isImageRequest(request, requestUrl)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE))
  }
})

function isApiRequest(url) {
  return url.pathname.endsWith('/api') || url.pathname.includes('/api/')
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')
}

function isStaticAsset(request, url) {
  return (
    ['font', 'script', 'style', 'worker'].includes(request.destination) ||
    url.pathname.includes('/assets/') ||
    /\.(?:css|js|mjs|woff2?|ttf|otf)$/i.test(url.pathname)
  )
}

function isImageRequest(request, url) {
  return (
    request.destination === 'image' ||
    /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i.test(url.pathname)
  )
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)

    if (isCacheable(response)) {
      cache.put(request, response.clone())
    }

    return response
  } catch {
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

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

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(request)

  if (isCacheable(response)) {
    cache.put(request, response.clone())
  }

  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  const networkResponse = fetch(request)
    .then((response) => {
      if (isCacheable(response)) {
        cache.put(request, response.clone())
      }

      return response
    })
    .catch(() => undefined)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await networkResponse

  return (
    response ||
    new Response('', {
      status: 503,
      statusText: 'Offline',
    })
  )
}

function isCacheable(response) {
  return response && response.ok && response.type !== 'opaque'
}
