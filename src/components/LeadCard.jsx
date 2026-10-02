import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { copyText } from '../lib/clipboard.js'

function scoreTier(score) {
  if (score >= 80) return 'high'
  if (score >= 60) return 'good'
  return 'fair'
}

function websiteHref(url) {
  if (!url) return null
  const trimmed = url.trim()
  // Only ever link out to http(s) addresses.
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(withScheme)
    return /^https?:$/.test(parsed.protocol) ? parsed.href : null
  } catch {
    return null
  }
}

export default function LeadCard({ lead }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const location = [lead.city, lead.country].filter(Boolean).join(', ')
  const href = websiteHref(lead.website)
  const hasEmail = Boolean(lead.email_body || lead.email_subject)
  const bodyId = `email-${lead.id}`

  async function handleCopy() {
    const text = [lead.email_subject && `Subject: ${lead.email_subject}`, lead.email_body]
      .filter(Boolean)
      .join('\n\n')
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <article className="lead-card">
      <header className="lead-card__head">
        <span className="lead-card__logo" aria-hidden="true">
          <Icon name="building" size={20} />
        </span>
        <div className="lead-card__title">
          <h3>{lead.company_name}</h3>
          <p>
            {location || 'Location not provided'}
            {href && (
              <>
                {' · '}
                <a href={href} target="_blank" rel="noopener noreferrer">
                  Website
                  <Icon name="externalLink" size={13} />
                </a>
              </>
            )}
          </p>
        </div>
        {lead.lead_score === null || lead.lead_score === undefined ? (
          <span className="score score--none" title="No score">
            <strong>—</strong>
            <small>score</small>
          </span>
        ) : (
          <span
            className={`score score--${scoreTier(lead.lead_score)}`}
            role="img"
            aria-label={`Lead score ${lead.lead_score} out of 100`}
          >
            <strong>{lead.lead_score}</strong>
            <small>score</small>
          </span>
        )}
      </header>

      <div className="lead-card__person">
        <div>
          <span className="sample__label">Decision maker</span>
          {lead.decision_maker_name ? (
            <p className="lead-card__name">
              {lead.decision_maker_name}
              {lead.decision_maker_title && <em> · {lead.decision_maker_title}</em>}
            </p>
          ) : (
            <p className="lead-card__name lead-card__name--none">Not identified yet</p>
          )}
          {lead.contact_email && (
            <p className="lead-card__contact">
              <Icon name="mail" size={14} />
              <a href={`mailto:${lead.contact_email}`}>{lead.contact_email}</a>
            </p>
          )}
        </div>
        {lead.decision_maker_name &&
          (lead.decision_maker_verified ? (
            <span className="badge badge--verified">
              <Icon name="check" size={14} />
              Verified
            </span>
          ) : (
            <span className="badge badge--unverified">Unverified</span>
          ))}
      </div>

      <div className="lead-card__email">
        <span className="sample__label">Draft outreach email</span>
        {hasEmail ? (
          <>
            {lead.email_subject && (
              <p className="lead-card__subject">Subject: {lead.email_subject}</p>
            )}
            {lead.email_body && (
              <p
                id={bodyId}
                className={`lead-card__body ${expanded ? 'is-expanded' : ''}`}
              >
                {lead.email_body}
              </p>
            )}
            <div className="lead-card__email-actions">
              {lead.email_body && (
                <button
                  type="button"
                  className="link-btn lead-card__toggle"
                  aria-expanded={expanded}
                  aria-controls={bodyId}
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? 'Show less' : 'Read full email'}
                  <Icon
                    name="chevronDown"
                    size={16}
                    className={expanded ? 'chev chev--up' : 'chev'}
                  />
                </button>
              )}
              <button type="button" className="btn btn--ghost btn--xs" onClick={handleCopy}>
                <Icon name={copied ? 'check' : 'copy'} size={14} />
                {copied ? 'Copied!' : 'Copy email'}
              </button>
              <span className="sr-only" role="status">
                {copied ? 'Email copied to clipboard' : ''}
              </span>
            </div>
          </>
        ) : (
          <p className="lead-card__body lead-card__body--none">No draft email for this company yet.</p>
        )}
      </div>
    </article>
  )
}
