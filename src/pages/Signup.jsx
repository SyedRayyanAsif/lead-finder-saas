import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { friendlyAuthError } from '../lib/authErrors.js'
import AuthUnavailable from '../components/AuthUnavailable.jsx'
import Icon from '../components/Icon.jsx'
import { TURNAROUND } from '../config.js'

const MIN_PASSWORD = 8

export default function Signup() {
  const { user, loading, signUp, resendConfirmation } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState('') // set once a confirmation email is on its way
  const [resendMsg, setResendMsg] = useState('')

  // Already logged in (or just confirmed) -> straight to the app.
  if (!loading && user) return <Navigate to="/request" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < MIN_PASSWORD) {
      setError(`Please choose a password with at least ${MIN_PASSWORD} characters.`)
      return
    }
    setSubmitting(true)
    try {
      const cleanEmail = email.trim()
      const { data, error: authError } = await signUp(cleanEmail, password)
      if (authError) {
        setError(friendlyAuthError(authError))
      } else if (!data.session) {
        // Email confirmation is on: no session until they click the link.
        // We show the same message whether or not the address already exists,
        // so the form can't be used to discover who has an account.
        setSentTo(cleanEmail)
      }
      // If a session came back, AuthContext updates and we redirect above.
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    setResendMsg('')
    try {
      const { error: resendError } = await resendConfirmation(sentTo)
      setResendMsg(
        resendError ? friendlyAuthError(resendError) : 'Sent again — please check your inbox.',
      )
    } catch (err) {
      setResendMsg(friendlyAuthError(err))
    }
  }

  if (sentTo) {
    return (
      <section className="auth">
        <div className="auth__card center">
          <span className="auth__icon">
            <Icon name="mail" size={26} />
          </span>
          <h1 className="auth__title">Check your email</h1>
          <p className="auth__sub">
            We’ve sent a confirmation link to <strong>{sentTo}</strong>. Click
            it to activate your account. If you already have an account, you can{' '}
            <Link to="/login">log in</Link> instead.
          </p>
          <p className="auth__hint">
            Can’t see it? Check your spam folder, or{' '}
            <button type="button" className="link-btn" onClick={handleResend}>
              send it again
            </button>
            .
          </p>
          {resendMsg && (
            <p className="form-note" role="status">
              {resendMsg}
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create your free account</h1>
        <p className="auth__sub">
          Early access is free. Requests are researched by hand, so results
          typically arrive within {TURNAROUND}.
        </p>

        <AuthUnavailable />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isSupabaseConfigured}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD}
              aria-describedby="password-hint"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isSupabaseConfigured}
            />
            <small id="password-hint">At least {MIN_PASSWORD} characters.</small>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--lg btn--block"
            disabled={submitting || !isSupabaseConfigured}
          >
            {submitting ? 'Creating account…' : 'Sign up free'}
          </button>
        </form>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
