import { cacheNames, clientsClaim } from 'workbox-core'
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
import { NetworkFirst, NetworkOnly, Strategy } from 'workbox-strategies'
import type { StrategyHandler } from 'workbox-strategies'
import type { ManifestEntry } from 'workbox-build'

// @ts-ignore
declare let self: ServiceWorkerGlobalScope
declare type ExtendableEvent = any

const data = {
  race: false,
  debug: false,
  credentials: 'same-origin',
  networkTimeoutSeconds: 0,
  fallback: 'index.html'
}

const cacheName = cacheNames.runtime

function buildStrategy(): Strategy {
  if (data.race) {
    class CacheNetworkRace extends Strategy {
      _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
        const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request)
        const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request)

        return new Promise((resolve, reject) => {
          fetchAndCachePutDone.then(resolve).catch((e) => {
            if (data.debug)
              console.log(`Cannot fetch resource: ${request.url}`, e)
          })
          cacheMatchDone.then(response => response && resolve(response))

          // Reject if both network and cache error or find no response.
          Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
            const [fetchAndCachePutResult, cacheMatchResult] = results
            // @ts-ignore
            if (fetchAndCachePutResult.status === 'rejected' && !cacheMatchResult.value)
              reject(fetchAndCachePutResult.reason)
          })
        })
      }
    }
    return new CacheNetworkRace()
  } else {
    if (data.networkTimeoutSeconds > 0)
      return new NetworkFirst({ cacheName, networkTimeoutSeconds: data.networkTimeoutSeconds })
    else
      return new NetworkFirst({ cacheName })
  }
}

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>

const cacheEntries: RequestInfo[] = []

const manifestURLs = manifest.map(
  (entry) => {
    const url = new URL(entry.url, self.location)
    cacheEntries.push(new Request(url.href, {
      credentials: data.credentials as any
    }))
    return url.href
  }
)

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries)
    })
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          if (!manifestURLs.includes(request.url)) {
            cache.delete(request).then((deleted) => {
              if (data.debug) {
                if (deleted)
                  console.log(`Precached data removed: ${request.url || request}`)
                else
                  console.log(`No precache found: ${request.url || request}`)
              }
            })
          }
        })
      })
    })
  )
})

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  buildStrategy()
)

setDefaultHandler(new NetworkOnly())

setCatchHandler(({ event }): Promise<Response> => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(data.fallback).then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error())
      })
    default:
      return Promise.resolve(Response.error())
  }
})

self.skipWaiting()
clientsClaim()

// Push notification event listener
// @ts-ignore
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Nueva notificación'
  const options = {
    body: data.body || 'Esta notificación no tiene contenido',
    icon: data.icon || '/LogoPush.png',
    badge: data.badge || '/LogoPushBadge.png',
    vibration: data.vibration || [200, 100, 200],
    data: data.url || 'https://weto-frontend.onrender.com/login'
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click event listener
// @ts-ignore
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  event.waitUntil(
    // @ts-ignore
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus()
        }
      }
      // @ts-ignore
      if (clients.openWindow) {
        // @ts-ignore
        return clients.openWindow(event.notification.data)
      }
    })
  )
})

self.skipWaiting()
clientsClaim()