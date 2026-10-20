import NextLink from 'next/link'
import type { ComponentProps } from 'react'

export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const isString = typeof href === 'string'
  const hrefString = isString ? href : (href?.pathname || '')
  const isInternalLink = hrefString.startsWith('/')
  const isAnchorLink = hrefString.startsWith('#')

  if (isInternalLink) {
    return <NextLink href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a href={hrefString} {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" href={hrefString} {...rest} />
}
