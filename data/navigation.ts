export interface NavLink {
  href: string
  title: string
  isExternal?: boolean
}

export const HEADER_NAV_LINKS: NavLink[] = [
  { href: '/', title: 'Gallery' },
  { href: '/about', title: 'About' },
  { href: 'https://mushfiqweb.com', title: 'Blog', isExternal: true },
]

export const MORE_NAV_LINKS: NavLink[] = [
  { href: 'https://mushfiqweb.com/tags', title: 'Tags', isExternal: true },
]
