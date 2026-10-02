import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
// The publishable key (sb_publishable_...) or the older "anon" key - both work.
// The variable keeps its original "ANON" name so existing deployments don't break.
const publishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `supabase` is null until the two env vars are set (see .env.example), so the
// site still loads and shows a friendly message instead of crashing.
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null
export const isSupabaseConfigured = Boolean(supabase)

if (!supabase) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing. ' +
      'Copy .env.example to .env.local and fill them in. Auth is disabled until then.',
  )
}
