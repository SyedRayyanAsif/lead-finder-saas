import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { friendlyAuthError } from '../lib/authErrors.js'
import AuthUnavailable from '../components/AuthUnavailable.jsx'
import Icon from '../components/Icon.jsx'
import { LEGAL } from '../config.js'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState('') // set once we've asked for the email to be sent

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const cleanEmail = email.trim()
      const { error: authError } = await resetPassword(cleanEmail)
      if (authError) {
        setError(friendlyAuthError(authError))
      } else {
        // The same message whether or not the address has an account, so this
        // form can't be used to find out who is a customer.
        setSentTo(cleanEmail)
      }
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setSubmitting(false)
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
            If there’s an account for <strong>{sentTo}</strong>, we’ve sent a link to choose a new
            password. It can take a few minutes to arrive, and it only works once.
          </p>
          <p className="auth__hint">
            Nothing after a few minutes? Check your spam folder, or email{' '}
            <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> and we’ll help. Wrong
            address?{' '}
            <button type="button" className="link-btn" onClick={() => setSentTo('')}>
              Try again
            </button>
            .
          </p>
          <p className="auth__switch">
            <Link to="/login">Back to log in</Link>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Forgot your password?</h1>
        <p className="auth__sub">
          Enter the email address you signed up with and we’ll send you a link to choose a new
          password.
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
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="auth__switch">
          Remembered it? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
