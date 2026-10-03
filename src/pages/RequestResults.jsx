import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { leadsToCsv, csvFilename, downloadCsv } from '../lib/csv.js'
import { formatDate } from '../lib/format.js'
import Icon from '../components/Icon.jsx'
import Confetti from '../components/Confetti.jsx'
import LeadCard from '../components/LeadCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { TURNAROUND } from '../config.js'

// The celebration plays once per browser session per request, not on every
// visit. Reading and recording are separate steps so that loading the page
// twice (e.g. React dev mode, or "Try again") can't switch it off by accident.
const celebratedKey = (id) => `celebrated:${id}`

function alreadyCelebrated(id) {
  try {
    return sessionStorage.getItem(celebratedKey(id)) === '1'
  } catch {
    return false // storage blocked: just celebrate
  }
}

function markCelebrated(id) {
  try {
    sessionStorage.setItem(celebratedKey(id), '1')
  } catch {
    // ignore
  }
}

export default function RequestResults() {
  const { id } = useParams()
  const { user } = useAuth()
  const [state, setState] = useState({ status: 'loading' }) // loading | error | notfound | ready
  const [celebrate, setCelebrate] = useState(false)

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    setCelebrate(false)
    try {
      // Row Level Security means this only ever returns the signed-in
      // customer's own request - someone else's id simply comes back empty.
      const { data: request, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!request) return setState({ status: 'notfound' })

      let leads = []
      if (request.status === 'completed') {
        const res = await supabase
          .from('leads')
          .select('*')
          .eq('request_id', id)
          .order('lead_score', { ascending: false, nullsFirst: false })
          .order('company_name', { ascending: true })
        if (res.error) throw res.error
        leads = res.data
        // `prev ||` so a second, overlapping load can't switch it back off after
        // the first one has already triggered it.
        setCelebrate((prev) => prev || (leads.length > 0 && !alreadyCelebrated(id)))
      }
      setState({ status: 'ready', request, leads })
    } catch (err) {
      console.error('[load results]', err)
      setState({ status: 'error' })
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  // Remember that we've shown the celebration, once it is actually on screen.
  useEffect(() => {
    if (celebrate) markCelebrated(id)
  }, [celebrate, id])

  if (state.status === 'loading') {
    return (
      <Shell>
        <p className="lead center" role="status">
          Loading your request…
        </p>
      </Shell>
    )
  }

  if (state.status === 'error') {
    return (
      <Shell>
        <div className="empty">
          <h1 className="h2">We couldn’t load this just now</h1>
          <p className="lead">Nothing is lost — please try again.</p>
          <button type="button" className="btn btn--primary" onClick={load}>
            Try again
          </button>
        </div>
      </Shell>
    )
  }

  if (state.status === 'notfound') {
    return (
      <Shell>
        <div className="empty">
          <h1 className="h2">We couldn’t find that request</h1>
          <p className="lead">
            It may belong to a different account — make sure you’re logged in
            with the email you used to submit it.
          </p>
          <Link to="/requests" className="btn btn--primary">
            See my requests
          </Link>
        </div>
      </Shell>
    )
  }

  const { request, leads } = state

  // ---- Not ready yet: honest "pending" state ----
  if (request.status !== 'completed') {
    const researching = request.status === 'researching'
    return (
      <Shell>
        <div className="pending">
          <span className="auth__icon">
            <Icon name="clock" size={26} />
          </span>
          <StatusBadge status={request.status} />
          <h1 className="h2">
            {researching
              ? 'Your request is being researched'
              : 'Your request is in our queue'}
          </h1>
          <p className="lead">
            {researching
              ? 'We’re working through it by hand right now.'
              : 'We’ve received it and will start on it soon.'}{' '}
            We’ll email you at <strong>{user.email}</strong> when your matches
            are ready — typically within {TURNAROUND} of you sending it.
            There’s nothing you need to do, and nothing to refresh.
          </p>
          <RequestSummary request={request} />
        </div>
      </Shell>
    )
  }

  // ---- Completed ----
  const count = leads.length

  if (count === 0) {
    return (
      <Shell>
        <div className="pending">
          <span className="auth__icon">
            <Icon name="clock" size={26} />
          </span>
          <h1 className="h2">Your results aren’t showing yet</h1>
          <p className="lead">
            This request is marked complete, but no companies have been added to
            it so far. Please check back shortly, or reply to our email if this
            looks wrong.
          </p>
          <RequestSummary request={request} />
        </div>
      </Shell>
    )
  }

  function handleExport() {
    downloadCsv(csvFilename(request.company_name), leadsToCsv(leads))
  }

  return (
    <Shell>
      <header className="results-head">
        {celebrate && <Confetti />}
        <span className="results-head__icon">
          <Icon name="sparkles" size={26} />
        </span>
        <h1 className="h2">
          {count === 1 ? 'Here’s your match' : `Here are your ${count} matches`}
        </h1>
        <p className="lead">
          {request.target_customer} in {request.target_city}, {request.target_country}
          {request.completed_at && <> · ready {formatDate(request.completed_at)}</>}
        </p>
        {count < request.result_count && (
          <p className="results-head__note">
            You asked for up to {request.result_count} — this is everything we
            found for this request.
          </p>
        )}
        <div className="results-head__actions">
          <button type="button" className="btn btn--ghost" onClick={handleExport}>
            <Icon name="download" size={18} />
            Export to CSV
          </button>
        </div>
      </header>

      <aside className="legend" aria-label="What the badges mean">
        <p className="legend__item">
          <span className="badge badge--verified">
            <Icon name="check" size={14} />
            Verified
          </span>
          We confirmed this person and their role.
        </p>
        <p className="legend__item">
          <span className="badge badge--unverified">Unverified</span>
          We couldn’t confirm it — double-check before you reach out.
        </p>
      </aside>

      <div className="lead-list">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      <p className="results-foot">
        Need more? <Link to="/request">Send another request</Link>
      </p>
    </Shell>
  )
}

function RequestSummary({ request }) {
  return (
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
      <div>
        <dt>Sent</dt>
        <dd>{formatDate(request.created_at)}</dd>
      </div>
    </dl>
  )
}

function Shell({ children }) {
  return (
    <section className="section results">
      <div className="container results__inner">
        <Link to="/requests" className="back-link">
          <Icon name="arrowLeft" size={16} />
          All my requests
        </Link>
        {children}
      </div>
    </section>
  )
}
