let isProduction = process.env.NODE_ENV === 'production'

export function coreContent<T>(content: T): T {
  return content
}

export function allCoreContent<T extends { draft?: boolean }>(contents: T[]): T[] {
  if (isProduction) return contents.filter((c) => c.draft !== true)
  return contents
}
