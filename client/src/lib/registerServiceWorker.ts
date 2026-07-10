const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`
const updateIntervalMs = 60 * 60 * 1000

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(serviceWorkerUrl)
      .then((registration) => {
        registration.update().catch(() => undefined)
        window.setInterval(() => {
          registration.update().catch(() => undefined)
        }, updateIntervalMs)
      })
      .catch(() => undefined)
  })
}
