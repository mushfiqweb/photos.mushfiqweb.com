'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { FooterBottom } from './footer-bottom'

export function Footer() {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (Math.abs(currentScrollY - lastScrollY) >= 1) {
        setIsScrolling(true)
        lastScrollY = currentScrollY

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
        }, 1000)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true, capture: true })
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll, true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const isAmbientActive = isHovered || isScrolling

  return (
    <footer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        paddingBottom: 'max(0.5rem, calc(0.35rem + env(safe-area-inset-bottom, 0px)))',
      }}
      className={clsx(
        'fixed bottom-0 inset-x-0 z-40 w-full',
        'bg-white/95 py-2 sm:py-2.5 backdrop-blur-md dark:bg-dark/95',
        'border-t border-gray-200/40 dark:border-neutral-800/60',
        'px-3 sm:px-6 xl:px-12',
        'transition-all duration-300 ease-out',
        isAmbientActive
          ? 'border-t-red-500/15 dark:border-t-red-500/20 shadow-[0_-3px_12px_rgba(239,68,68,0.055)] dark:shadow-[0_-3px_14px_rgba(239,68,68,0.075)] translate-y-0 opacity-100 saturate-100'
          : 'opacity-95 translate-y-0 shadow-none sm:shadow-xs saturate-90 hover:opacity-100'
      )}
    >
      {/* Top glowing ambient accent line */}
      <div
        className={clsx(
          'pointer-events-none absolute inset-x-0 top-0 h-[1.5px] transition-all duration-500',
          isAmbientActive
            ? 'opacity-100 bg-gradient-to-r from-transparent via-red-500/25 to-transparent'
            : 'opacity-0 bg-gradient-to-r from-transparent via-gray-400/10 dark:via-gray-600/10 to-transparent'
        )}
      />
      <div className="mx-auto max-w-6xl">
        <FooterBottom isActive={isAmbientActive} />
      </div>
    </footer>
  )
}
