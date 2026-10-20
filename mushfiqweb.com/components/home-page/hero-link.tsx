import clsx from 'clsx'
import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

export interface HeroLinkProps {
  href: string
  children: ReactNode
  variant?: 'linkedin' | 'agt' | 'indigo' | 'emerald'
  delay?: string
  className?: string
}

export function HeroLink({
  href,
  children,
  variant = 'linkedin',
  delay = '200ms',
  className,
}: HeroLinkProps) {
  const isLinkedIn = variant === 'linkedin' || variant === 'indigo'

  return (
    <span
      style={{ animationDelay: delay }}
      className="relative inline-flex align-baseline overflow-hidden rounded animate-hero-reveal"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'group relative inline-flex items-center gap-0.5 align-baseline',
          'px-1.5 py-0 mx-0.5 rounded font-semibold text-[0.95em]',
          'transition-all duration-200 ease-out cursor-pointer overflow-hidden',
          'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          isLinkedIn
            ? clsx(
                'text-[#0077B5] dark:text-[#38bdf8]',
                'bg-[#0077B5]/10 hover:bg-[#0077B5]/15 dark:bg-[#0077B5]/20 dark:hover:bg-[#0077B5]/30',
                'hover:shadow-[0_2px_10px_rgba(0,119,181,0.22)] dark:hover:shadow-[0_2px_12px_rgba(56,189,248,0.25)]',
                'focus-visible:ring-[#0077B5]'
              )
            : clsx(
                'text-[#0987A3] dark:text-[#53C1DE]',
                'bg-[#0987A3]/10 hover:bg-[#0987A3]/15 dark:bg-[#0987A3]/20 dark:hover:bg-[#0987A3]/30',
                'hover:shadow-[0_2px_10px_rgba(9,135,163,0.22)] dark:hover:shadow-[0_2px_12px_rgba(83,193,222,0.25)]',
                'focus-visible:ring-[#0987A3]'
              ),
          className
        )}
      >
        {/* On-load shimmer sheen sweep */}
        <span
          style={{ animationDelay: delay }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full animate-hero-sheen bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent"
        />

        {/* On-load ambient glow bloom */}
        <span
          style={{ animationDelay: delay }}
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 rounded animate-hero-glow',
            isLinkedIn ? 'hero-glow-linkedin' : 'hero-glow-agt'
          )}
        />

        {/* Text content */}
        <span className="relative z-10">{children}</span>

        {/* Compact micro-arrow indicator */}
        <ArrowUpRight
          aria-hidden="true"
          className={clsx(
            'relative z-10 w-3 h-3 transition-transform duration-200 ease-out',
            'opacity-70 group-hover:opacity-100',
            'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          )}
        />

        {/* Bottom accent hairline */}
        <span
          aria-hidden="true"
          className={clsx(
            'absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full',
            'origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out',
            isLinkedIn
              ? 'bg-[#0077B5] dark:bg-[#38bdf8]'
              : 'bg-gradient-to-r from-[#0987A3] to-[#53C1DE]'
          )}
        />
      </a>
    </span>
  )
}
