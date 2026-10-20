'use client'

import { useEffect, useState, useRef } from 'react'
import { clsx } from 'clsx'
import { ChevronRight } from 'lucide-react'
import { Link } from '~/components/ui/link'

type TocItem = {
  value: string
  url: string
  depth: number
}

export function TableOfContents({ toc, className }: { toc: TocItem[]; className?: string }) {
  const [activeId, setActiveId] = useState<string>('')
  const [indicatorStyle, setIndicatorStyle] = useState<{ top: number; height: number }>({
    top: 0,
    height: 0,
  })
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const headingIds = toc.map((item) => item.url.replace(/^#/, ''))

  useEffect(() => {
    if (headingIds.length === 0) return

    // Perform initial check on mount
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      let active = ''

      // Find the last heading that has been scrolled past
      for (const id of headingIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100 // 100px offset for header
          if (scrollPosition >= top) {
            active = id
          }
        }
      }
      setActiveId(active)
    }

    // Use IntersectionObserver for performant viewport entry tracking
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries.filter((entry) => entry.isIntersecting)
        if (visibleHeadings.length > 0) {
          // Sort by top offset to find the top-most visible heading
          const sorted = visibleHeadings.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          setActiveId(sorted[0].target.id)
        } else {
          // Fallback scroll check if no headings are currently intersecting
          handleScroll()
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })

    // Fallback handler for scroll events (throttled)
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial sync
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toc])

  // Sync indicator bar position when active index changes
  const activeIndex = toc.findIndex((item) => item.url.replace(/^#/, '') === activeId)

  useEffect(() => {
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const activeEl = itemRefs.current[activeIndex]
      if (activeEl) {
        setIndicatorStyle({
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
        })
      }
    }
  }, [activeIndex, activeId])

  return (
    <details className={clsx('space-y-4 [&_.chevron-right]:open:rotate-90', className)} open>
      <summary className="flex cursor-pointer select-none items-center gap-1 marker:content-none">
        <ChevronRight
          strokeWidth={1.5}
          size={20}
          className="chevron-right rotate-0 transition-transform"
        />
        <span className="text-lg font-medium">On this page</span>
      </summary>

      <div className="relative pl-3">
        {/* Sliding Indicator bar */}
        {activeIndex !== -1 && (
          <div
            className="absolute left-0 w-[3px] rounded-full bg-primary-500 transition-all duration-300 ease-in-out dark:bg-primary-400"
            style={{
              top: indicatorStyle.top,
              height: indicatorStyle.height,
            }}
          />
        )}
        <ul className="flex flex-col space-y-2.5">
          {toc.map(({ value, depth, url }, index) => {
            const id = url.replace(/^#/, '')
            const isActive = id === activeId
            return (
              <li
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                key={url}
                className={clsx(
                  'text-[15px] transition-all duration-300 ease-in-out',
                  isActive
                    ? 'translate-x-1.5 font-bold text-primary-500 dark:text-primary-400'
                    : 'font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                )}
                style={{ paddingLeft: (depth - 2) * 16 }}
              >
                <Link href={url}>{value}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </details>
  )
}
