'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import clsx from 'clsx'

export function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Set initial status
    setIsOffline(!navigator.onLine)

    const handleOnline = () => {
      setIsOffline(false)
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
      }, 3000)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowReconnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline && !showReconnected) return null

  return (
    <div className="fixed bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div
        className={clsx(
          'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono shadow-xl backdrop-blur-md border animate-fade-in',
          isOffline
            ? 'bg-neutral-900/90 text-amber-300 border-amber-500/30 dark:bg-black/90 dark:text-amber-400'
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
        )}
      >
        {isOffline ? (
          <>
            <WifiOff size={13} className="text-amber-400 shrink-0 animate-pulse" />
            <span>Offline mode • Browsing cached portfolio</span>
          </>
        ) : (
          <>
            <Wifi size={13} className="text-emerald-400 shrink-0" />
            <span>Back online • Synced</span>
          </>
        )}
      </div>
    </div>
  )
}
