const STATIC_CACHE = 'photos-static-v1'
const PHOTO_CACHE = 'photos-cache-v1'
const HTML_CACHE = 'photos-html-v1'

const PRECACHE_ASSETS = [
  '/',
  '/about',
  '/manifest.json',
  '/favicon.ico',
  '/og-image.png',
  '/photos-db.json',
  '/static/images/logo.jpg',
  '/static/images/cover-bg.jpg',
  '/static/images/black-grit.png',
  '/static/images/white-grit.png',
  '/static/fonts/HYPE-Strong.otf',
  '/static/favicons/site.webmanifest',
]

// Install event - Pre-cache essential static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching warning:', err)
      })
    }).then(() => self.skipWaiting())
  )
})

// Activate event - Cleanup old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, PHOTO_CACHE, HTML_CACHE].includes(key)) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event handler with specialized caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // 1. Skip non-GET requests
  if (request.method !== 'GET') return

  // 2. Photos (/assets/photos/*): Cache-First strategy
  if (url.pathname.startsWith('/assets/photos/')) {
    event.respondWith(
      caches.open(PHOTO_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          }).catch(() => cachedResponse)
        })
      })
    )
    return
  }

  // 3. Next.js Static Chunks, Images, Fonts, CSS: Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.otf') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.json')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(() => cachedResponse)

          return cachedResponse || fetchPromise
        })
      })
    )
    return
  }

  // 4. Spotify API: Return offline payload when network unavailable
  if (url.pathname === '/api/spotify') {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ isPlaying: false, offline: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      })
    )
    return
  }

  // 5. Navigation HTML requests: Network-First with Cache fallback for offline browsing
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(HTML_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return networkResponse
        })
        .catch(async () => {
          const cache = await caches.open(HTML_CACHE)
          const cachedResponse = await cache.match(request)
          if (cachedResponse) return cachedResponse

          // Fallback to cached home page
          const fallback = await cache.match('/')
          if (fallback) return fallback

          return new Response('Offline - Photos portfolio is available offline once loaded.', {
            headers: { 'Content-Type': 'text/html' },
          })
        })
    )
    return
  }
})
