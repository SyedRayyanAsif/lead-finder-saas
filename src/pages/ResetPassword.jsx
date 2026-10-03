import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { friendlyAuthError } from '../lib/authErrors.js'
import Icon from '../components/Icon.jsx'

const MIN_PASSWORD = 8

// The link in the reset email brings people here already logged in with a
// short-lived session. Nobody arrives with that session by any other route, so
// "no session" means the link has expired, was already used, or this page was
// opened directly.
export default function ResetPassword() {
  const { user, loading, updatePassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < MIN_PASSWORD) {
      setError(`Please choose a password with at least ${MIN_PASSWORD} characters.`)
      return
    }
    if (password !== confirm) {
      setError('The two passwords don’t match. Please type the same one twice.')
      return
    }
    setSubmitting(true)
    try {
      const { error: authError } = await updatePassword(password)
      if (authError) {
        setError(friendlyAuthError(authError))
      } else {
        setDone(true)
      }
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="auth">
        <div className="auth__card center">
          <p className="auth__sub" role="status">
            Checking your link…
          </p>
        </div>
      </section>
    )
  }

  if (done) {
    return (
      <section className="auth">
        <div className="auth__card center">
          <span className="auth__icon auth__icon--success">
            <Icon name="check" size={28} />
          </span>
          <h1 className="auth__title">Password updated</h1>
          <p className="auth__sub">You’re logged in with your new password.</p>
          <Link to="/requests" className="btn btn--primary btn--lg btn--block">
            Go to my requests
          </Link>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="auth">
        <div className="auth__card center">
          <span className="auth__icon">
            <Icon name="clock" size={26} />
          </span>
          <h1 className="auth__title">This link has expired</h1>
          <p className="auth__sub">
            Reset links only work once, and only for a short time. Request a new one and we’ll
            email it to you.
          </p>
          <Link to="/forgot-password" className="btn btn--primary btn--lg btn--block">
            Request a new link
          </Link>
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
        <h1 className="auth__title">Choose a new password</h1>
        <p className="auth__sub">For {user.email}.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD}
              aria-describedby="password-hint"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
            <small id="password-hint">At least {MIN_PASSWORD} characters.</small>
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                setError('')
              }}
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
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      </div>
    </section>
  )
}
