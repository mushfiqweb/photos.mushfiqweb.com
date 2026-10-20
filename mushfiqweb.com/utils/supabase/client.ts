import { createBrowserClient } from '@supabase/ssr'

/**
 * Singleton browser Supabase client — anon key, safe to expose.
 * Module-level cache guarantees exactly ONE WebSocket connection for all
 * Realtime subscriptions across the entire browser session.
 */
let _client: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseBrowserClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}
