import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from '../components/Icon.jsx'
import { TURNAROUND } from '../config.js'

// Shown right after a request is submitted. Deliberately calm and static:
// nothing is being processed live, so we don't pretend it is.
export default function RequestReceived() {
  const { user } = useAuth()
  const { state } = useLocation()

  // Opened directly (e.g. bookmarked or refreshed): nothing to confirm.
  if (!state?.request) return <Navigate to="/request" replace />

  const { id, request } = state

  return (
    <section className="auth">
      <div className="auth__card auth__card--wide center">
        <span className="auth__icon auth__icon--success">
          <Icon name="check" size={28} />
        </span>
        <h1 className="auth__title">Request received, thank you!</h1>
        <p className="auth__sub">
          We’re on it. During early access we research each request by hand and
          email you personally at <strong>{user.email}</strong> when your
          matches are ready, typically within {TURNAROUND}.
        </p>

        <dl className="summary">
          <div>
            <dt>Your company</dt>
            <dd>{request.company_name}</dd>
          </div>
          <div>
            <dt>Looking for</dt>
            <dd>
              {request.target_customer} <span>({request.industry})</span>
            </dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>
              {request.target_city}, {request.target_country}
            </dd>
          </div>
          <div>
            <dt>How many</dt>
            <dd>Up to {request.result_count} companies</dd>
          </div>
        {request.product_details && (
          <div className="summary__long">
            <dt>Your product</dt>
            <dd>{request.product_details}</dd>
          </div>
        )}
        {request.extra_notes && (
          <div className="summary__long">
            <dt>Extra notes</dt>
            <dd>{request.extra_notes}</dd>
          </div>
        )}
        </dl>

        <p className="auth__hint">Reference: {id.slice(0, 8)}</p>

        <div className="auth__actions">
          <Link to="/request" className="btn btn--ghost">
            Send another request
          </Link>
          <Link to={`/requests/${id}`} className="btn btn--primary">
            View this request
          </Link>
        </div>
      </div>
    </section>
  )
}
