import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { formatDate } from '../lib/format.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Icon from '../components/Icon.jsx'

export default function MyRequests() {
  const [state, setState] = useState({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    const { data, error } = await supabase
      .from('requests')
      .select('id, created_at, status, company_name, target_customer, target_city, target_country, result_count')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[load requests]', error)
      setState({ status: 'error' })
    } else {
      setState({ status: 'ready', requests: data })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <section className="section results">
      <div className="container results__inner">
        <div className="list-head">
          <h1 className="h2">My requests</h1>
          <Link to="/request" className="btn btn--primary btn--sm">
            New request
          </Link>
        </div>

        {state.status === 'loading' && (
          <p className="lead" role="status">
            Loading…
          </p>
        )}

        {state.status === 'error' && (
          <div className="empty">
            <p className="lead">We couldn’t load your requests just now.</p>
            <button type="button" className="btn btn--primary" onClick={load}>
              Try again
            </button>
          </div>
        )}

        {state.status === 'ready' && state.requests.length === 0 && (
          <div className="empty">
            <h2 className="h2">No requests yet</h2>
            <p className="lead">Tell us who you’re looking for and we’ll get started.</p>
            <Link to="/request" className="btn btn--primary">
              Send your first request
            </Link>
          </div>
        )}

        {state.status === 'ready' && state.requests.length > 0 && (
          <ul className="req-list">
            {state.requests.map((r) => (
              <li key={r.id}>
                <Link to={`/requests/${r.id}`} className="req">
                  <div className="req__main">
                    <h2>{r.company_name}</h2>
                    <p>
                      {r.target_customer} in {r.target_city}, {r.target_country} · up to{' '}
                      {r.result_count} companies · sent {formatDate(r.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                  <span className="req__go">
                    {r.status === 'completed' ? 'View results' : 'View status'}
                    <Icon name="arrowRight" size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
