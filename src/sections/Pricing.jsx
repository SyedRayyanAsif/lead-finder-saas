import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { RESULT_SIZES, TURNAROUND } from '../config.js'

const INCLUDED = [
  `Choose ${RESULT_SIZES.slice(0, -1).join(', ')} or ${RESULT_SIZES.at(-1)} companies per request`,
  'Decision maker name & title, marked verified or unverified',
  'A lead score for every company',
  'A drafted outreach email for each one',
  'Export your list to CSV',
]

export default function Pricing() {
  return (
    <section id="pricing" className="section section--tint">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Pricing</p>
          <h2 className="h2">Start free</h2>
          <p className="lead">
            Early access is free. No credit card, and you won’t be charged for
            anything.
          </p>
        </div>

        <div className="pricing">
          <div className="plan plan--featured">
            <span className="plan__flag">Early access</span>
            <h3>Free</h3>
            <p className="plan__price">
              <strong>$0</strong>
              <span>while we’re in early access</span>
            </p>
            <ul className="plan__list">
              {INCLUDED.map((item) => (
                <li key={item}>
                  <Icon name="check" size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn btn--primary btn--block">
              Sign up free
            </Link>
            <p className="plan__fine">
              Results typically arrive within {TURNAROUND}.
            </p>
          </div>

          <div className="plan plan--later">
            <span className="plan__flag plan__flag--muted">Later</span>
            <h3>Paid plans</h3>
            <p className="plan__price">
              <strong>Coming soon</strong>
              <span>pricing not decided yet</span>
            </p>
            <p className="plan__text">
              We may introduce paid plans once we move beyond early access.
              We’ll tell you well in advance, and you’ll never be charged
              without clearly agreeing to it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
