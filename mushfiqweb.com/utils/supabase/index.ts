/**
 * Supabase utility — server-side DB functions and shared types.
 *
 * Client architecture:
 *   - Server (API routes): uses getSupabaseServerClient() from ./server
 *   - Browser (realtime): uses getSupabaseBrowserClient() from ./client
 *
 * All DB functions here are server-only (they call getSupabaseServerClient).
 */
import { getSupabaseServerClient } from './server'

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatsType = 'blog' | 'snippet'

export interface SelectStats {
  type: StatsType
  slug: string
  views: number
  loves: number
  applauses: number
  ideas: number
  bullseyes: number
}

/** Deltas for atomic increment — all values must be non-negative integers */
export type StatsDelta = Partial<Omit<SelectStats, 'type' | 'slug'>>

// ─── New functions ────────────────────────────────────────────────────────────

/**
 * Fetch stats for a single post.
 * Returns zeros without auto-creating a DB row (bots can't pollute the table).
 */
export async function getStats(type: StatsType, slug: string): Promise<SelectStats> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('type', type)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ?? { type, slug, views: 0, loves: 0, applauses: 0, ideas: 0, bullseyes: 0 }
}

/**
 * Batch fetch stats for multiple slugs in a single query — eliminates N+1 on listing pages.
 * Slugs with no existing row get zero-filled entries.
 */
export async function getBatchStats(type: StatsType, slugs: string[]): Promise<SelectStats[]> {
  if (!slugs.length) return []
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('type', type)
    .in('slug', slugs)

  if (error) throw error

  const map = new Map((data as SelectStats[]).map((s) => [s.slug, s]))
  return slugs.map(
    (slug) =>
      map.get(slug) ?? { type, slug, views: 0, loves: 0, applauses: 0, ideas: 0, bullseyes: 0 }
  )
}

/**
 * Atomically increment stats via the `increment_stats` PostgreSQL RPC.
 * Accepts positive deltas — the DB adds them to the current values atomically.
 * Creates the row via UPSERT if it doesn't exist yet.
 */
export async function incrementStats(
  type: StatsType,
  slug: string,
  deltas: StatsDelta
): Promise<SelectStats> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.rpc('increment_stats', {
    p_type: type,
    p_slug: slug,
    p_views: deltas.views ?? 0,
    p_loves: deltas.loves ?? 0,
    p_applauses: deltas.applauses ?? 0,
    p_ideas: deltas.ideas ?? 0,
    p_bullseyes: deltas.bullseyes ?? 0,
  })
  if (error) throw error
  return (data as SelectStats[])[0]
}

// ─── Backward-compatible aliases (used during migration, will be removed) ─────

/** @deprecated Use getStats() instead */
export async function getBlogStats(type: StatsType, slug: string): Promise<SelectStats> {
  return getStats(type, slug)
}

/** @deprecated Use incrementStats() with deltas instead */
export async function updateBlogStats(
  type: StatsType,
  slug: string,
  updates: Partial<Omit<SelectStats, 'type' | 'slug'>>
): Promise<SelectStats> {
  const clampedUpdates = { ...updates }
  for (const key of Object.keys(clampedUpdates) as Array<keyof typeof updates>) {
    const val = clampedUpdates[key]
    if (typeof val === 'number') {
      clampedUpdates[key] = Math.max(0, val) as any
    }
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('stats')
    .upsert({ type, slug, ...clampedUpdates })
    .select()
    .single()
  if (error) throw error
  return data as SelectStats
}
