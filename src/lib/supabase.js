import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `supabase` is null until the two env vars are set (see .env.example), so the
// site still loads and shows a friendly message instead of crashing.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const isSupabaseConfigured = Boolean(supabase)

if (!supabase) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing. ' +
      'Copy .env.example to .env.local and fill them in. Auth is disabled until then.',
  )
}
