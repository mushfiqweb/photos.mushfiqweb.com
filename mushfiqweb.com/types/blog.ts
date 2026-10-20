export interface ReadingTime {
  text: string
  minutes: number
  time: number
  words: number
}

export interface TocItem {
  value: string
  url: string
  depth: number
}

export interface BlogPost {
  title: string
  slug: string
  date: string
  tags: string[]
  lastmod?: string
  draft?: boolean
  summary?: string
  images?: string[]
  authors?: string[]
  layout?: string
  bibliography?: string
  canonicalUrl?: string
  readingTime: ReadingTime
  toc: TocItem[]
  filePath: string
  path: string
  type: 'Blog'
  customPage?: boolean
}

export interface Snippet {
  heading: string
  title: string
  icon: string
  slug: string
  date: string
  tags: string[]
  lastmod?: string
  draft?: boolean
  summary?: string
  images?: string[]
  authors?: string[]
  layout?: string
  bibliography?: string
  canonicalUrl?: string
  readingTime: ReadingTime
  toc: TocItem[]
  filePath: string
  path: string
  type: 'Snippet'
}

export interface Author {
  name: string
  slug: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  layout?: string
  type: 'Author'
}

export type Blog = BlogPost | Snippet
