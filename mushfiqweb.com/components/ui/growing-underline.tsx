import { clsx } from 'clsx'
import type { CSSProperties } from 'react'

export function GrowingUnderline({
  as: Component = 'span',
  children,
  active,
  className,
  duration,
  ...rest
}: {
  children: React.ReactNode
  as?: React.ElementType
  active?: boolean
  className?: string
  duration?: number
  [key: string]: any
}) {
  return (
    <Component
      className={clsx(['link link--metis w-full whitespace-normal', className])}
      style={{ '--duration': `${duration || 300}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Component>
  )
}
