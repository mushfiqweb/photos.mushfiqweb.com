'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { HeaderContainer } from '~/components/ui/header-container'
import { Link } from '~/components/ui/link'
import { HEADER_NAV_LINKS } from '~/data/navigation'
import { SITE_METADATA } from '~/data/site-metadata'
import { MatrixSettings } from './matrix-settings'
import { MobileNav } from './mobile-nav'
import { ThemeSwitcher } from './theme-switcher'

const SiteTitle = () => {
  return (
    <div className="header-title whitespace-nowrap text-lg sm:text-2xl md:text-3xl">
      <span className="bg-gray-800 pl-2 pt-2 font-bold text-white transition-all dark:bg-white dark:text-black">
        MUSHFIQUR'S {'  '}
      </span>{' '}
      PHOTOS
    </div>
  )
}

export function Header() {
  let pathname = usePathname()
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

  const isHeaderActive = isHovered || isScrolling

  return (
    <HeaderContainer
      as="header"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'sticky top-0 inset-x-0 z-50 w-full',
        'bg-white/80 py-2 backdrop-blur-md dark:bg-dark/80',
        'border-b border-gray-200/20 dark:border-neutral-800/40',
        'transition-all duration-300 ease-out',
        isHeaderActive
          ? 'border-b-spotify/15 dark:border-b-spotify/20 shadow-[0_3px_12px_rgba(29,185,84,0.055)] dark:shadow-[0_3px_14px_rgba(29,185,84,0.075)] saturate-100'
          : 'shadow-none sm:shadow-xs saturate-90'
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-2 md:gap-3 md:pl-11 md:pr-11">
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/" aria-label={SITE_METADATA.headerTitle}>
              <SiteTitle />
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden gap-1.5 sm:flex">
              {HEADER_NAV_LINKS.map(({ title, href }) => {
                let isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <Link key={title} href={href} className="px-3 py-1 font-medium">
                    <GrowingUnderline className={clsx(isActive && 'link--metis-hover')}>
                      {title}
                    </GrowingUnderline>
                  </Link>
                )
              })}
            </div>
            <div
              data-orientation="vertical"
              role="separator"
              className="hidden h-4 w-px shrink-0 bg-gray-200 dark:bg-gray-600 md:block"
            />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MatrixSettings />
              <ThemeSwitcher />
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom glowing ambient accent line */}
      <div
        className={clsx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] transition-all duration-500',
          isHeaderActive
            ? 'opacity-100 bg-gradient-to-r from-transparent via-spotify/25 to-transparent'
            : 'opacity-0 bg-gradient-to-r from-transparent via-gray-400/10 dark:via-gray-600/10 to-transparent'
        )}
      />
    </HeaderContainer>
  )
}
