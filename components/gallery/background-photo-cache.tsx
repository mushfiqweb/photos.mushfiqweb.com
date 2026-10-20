'use client'

import { useEffect } from 'react'
import type { Photo } from '~/data/photos'

export function BackgroundPhotoCache({ photos }: { photos: Photo[] }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Register Service Worker for Cache-First image serving
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {
          // Service worker registration fallback
        })
    }

    // 2. Respect Save-Data data saver preference
    const nav = navigator as any
    if (nav.connection?.saveData) {
      return
    }

    let isCancelled = false

    const startBackgroundCaching = async () => {
      try {
        const hasCacheStorage = 'caches' in window
        let photoCache: Cache | null = null
        if (hasCacheStorage) {
          try {
            photoCache = await caches.open('photos-cache-v1')
          } catch {
            // Cache storage might be unavailable in some private modes
          }
        }

        const urls = photos.map((p) => p.src)
        const concurrency = 2
        let currentIndex = 0

        const worker = async () => {
          while (currentIndex < urls.length && !isCancelled) {
            const index = currentIndex++
            const url = urls[index]

            try {
              // Check if already cached in CacheStorage
              let isAlreadyCached = false
              if (photoCache) {
                const match = await photoCache.match(url)
                if (match) {
                  isAlreadyCached = true
                }
              }

              if (!isAlreadyCached) {
                // Fetch low-priority background request
                const response = await fetch(url, {
                  priority: 'low',
                  cache: 'force-cache',
                })

                if (response.ok && photoCache) {
                  await photoCache.put(url, response.clone())
                }
              }

              // Pre-warm browser DOM image decode cache
              const img = new window.Image()
              img.src = url
              if ('decode' in img) {
                img.decode().catch(() => {})
              }
            } catch {
              // Ignore individual image download failure
            }

            // Yield execution to keep main thread completely smooth
            await new Promise((resolve) => setTimeout(resolve, 60))
          }
        }

        // Run 2 workers concurrently in the background
        const workers = Array.from({ length: concurrency }, () => worker())
        await Promise.all(workers)
      } catch {
        // Fallback gracefully
      }
    }

    // Start background caching promptly after initial paint
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => startBackgroundCaching(), {
          timeout: 2000,
        })
      } else {
        startBackgroundCaching()
      }
    }, 400)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [photos])

  return null
}
