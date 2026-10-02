import { isSupabaseConfigured } from '../lib/supabase.js'

// Shown instead of the form if Supabase isn't configured on this deployment.
export default function AuthUnavailable() {
  if (isSupabaseConfigured) return null
  return (
    <div className="notice notice--warn" role="alert">
      <strong>Accounts are temporarily unavailable.</strong> Please try again
      later.
      {import.meta.env.DEV && (
        <p className="notice__dev">
          Developer note: set <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> (see{' '}
          <code>.env.example</code>), then restart the dev server.
        </p>
      )}
    </div>
  )
}
