import { createServerClient } from '@supabase/ssr'

/**
 * Per-request server Supabase client — service role key, NEVER exposed to browser.
 * Uses @supabase/ssr's createServerClient without cookie handling since this app
 * does not use Supabase Auth; the service role key bypasses RLS entirely.
 *
 * Call once at the top of each API route handler — do NOT share across requests.
 */
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase server env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    // No cookie-based auth — stats table is public write, service role for API
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  })
}
