'use client'

import { useEffect } from 'react'
import type { StatsType } from '~/utils/supabase'
import { useBlogStats, useUpdateBlogStats } from '~/hooks/use-blog-stats'

export function ViewsCounter({
  type,
  slug,
  className,
  writeView = false,
}: {
  type: StatsType
  slug: string
  className?: string
  writeView?: boolean
}) {
  let [stats, isLoading] = useBlogStats(type, slug)
  let updateView = useUpdateBlogStats()

  useEffect(() => {
    if (writeView && !isLoading && stats) {
      const newKey = `viewed/${type}/${slug}`
      const alreadyViewed = localStorage.getItem(newKey) || localStorage.getItem(slug)

      if (alreadyViewed) {
        return // Skip the view update
      }

      // Update localStorage
      localStorage.setItem(newKey, 'true')
      updateView({ type, slug, views: stats['views'] + 1 })
    }
  }, [stats, isLoading, writeView, type, slug])

  return <span className={className}>{isLoading ? '...' : (stats['views'] || 0) + ' views'}</span>
}
