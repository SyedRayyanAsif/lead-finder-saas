import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // True until we know whether someone is already logged in (e.g. after a
  // page refresh, or after clicking the confirmation link in an email).
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signUp: (email, password) =>
        supabase.auth.signUp({
          email,
          password,
          // Where the confirmation link in the email sends people back to.
          // Must be allowed under Supabase > Authentication > URL Configuration.
          options: { emailRedirectTo: `${window.location.origin}/request` },
        }),
      signIn: (email, password) =>
        supabase.auth.signInWithPassword({ email, password }),
      signOut: () => supabase.auth.signOut(),
      // Emails a link that opens /reset-password with a short-lived login.
      // Like the sign-up link, this URL must be allowed under Supabase >
      // Authentication > URL Configuration (the `/**` entry already covers it).
      resetPassword: (email) =>
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      // Only works while someone is logged in, which is what the emailed link gives them.
      updatePassword: (password) => supabase.auth.updateUser({ password }),
      resendConfirmation: (email) =>
        supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: `${window.location.origin}/request` },
        }),
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
