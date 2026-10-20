import clsx from 'clsx'
import type { ReactNode } from 'react'

export function HeaderContainer({
  children,
  as: Component = 'header',
  className,
  ...rest
}: {
  children: ReactNode
  as?: React.ElementType
  className?: string
  [key: string]: any
}) {
  return (
    <Component className={clsx('w-full px-4 sm:px-6 xl:px-12', className)} {...rest}>
      {children}
    </Component>
  )
}
