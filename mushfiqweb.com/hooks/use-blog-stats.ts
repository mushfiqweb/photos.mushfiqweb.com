import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { supabaseClient } from '~/utils/supabase-client'
import type { SelectStats, StatsType } from '~/utils/supabase'
import { fetcher } from '~/utils/misc'

export function useBlogStats(type: StatsType, slug: string) {
  let { data, isLoading, mutate } = useSWR<SelectStats>(
    `/api/stats?slug=${slug}&type=${type}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 15000, // Poll every 15 seconds as a fallback
    }
  )

  useEffect(() => {
    const client = supabaseClient
    if (!client) return

    // Generate a unique channel ID for this hook instance to prevent
    // 'cannot add callbacks after subscribe()' errors when multiple
    // components on the same page (e.g. ViewsCounter and Reactions) subscribe.
    const channelId = Math.random().toString(36).slice(2, 9)
    const channel = client
      .channel(`stats-realtime-${type}-${slug}-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stats',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          if (payload.new && (payload.new as SelectStats).type === type) {
            mutate(payload.new as SelectStats, { revalidate: false })
          }
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [type, slug, mutate])

  let { views, loves, applauses, ideas, bullseyes } = data || {}
  let stats = useMemo<SelectStats>(() => {
    return {
      type,
      slug,
      views: views || 0,
      loves: loves || 0,
      applauses: applauses || 0,
      ideas: ideas || 0,
      bullseyes: bullseyes || 0,
    }
  }, [type, slug, views, loves, applauses, ideas, bullseyes])
  return [stats, isLoading] as const
}

export function useUpdateBlogStats() {
  let { trigger } = useSWRMutation(
    '/api/stats',
    async (url: string, { arg }: { arg: Partial<SelectStats> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      }).catch(console.error)
    }
  )
  return trigger
}
