import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { TURNAROUND } from '../config.js'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Early access · Researched by hand</p>
          <h1 className="hero__title">
            Tell us who you’re looking for. <span>We’ll find them.</span>
          </h1>
          <p className="lead">
            Describe the customers you want to reach. We research real
            companies that match, check who the right person is, and draft an
            outreach email for each one, delivered as a ready-to-use list.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn btn--primary btn--lg">
              Request your first list
              <Icon name="arrowRight" size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn--ghost btn--lg">
              See how it works
            </a>
          </div>
          <p className="hero__note">
            <Icon name="clock" size={16} />
            We’re in early access, so every request is reviewed closely.
            Results typically arrive within {TURNAROUND}, not instantly.
          </p>
        </div>

        <SampleResults />
      </div>
    </section>
  )
}

// A fictional, clearly-labelled preview of what a finished list looks like.
function SampleResults() {
  return (
    <div className="sample" role="img" aria-label="Illustrative example of a results card showing a company, a verified decision maker, a lead score and a draft email">
      <div className="sample__tag">Example only · fictional company</div>

      <article className="sample__card">
        <header className="sample__head">
          <span className="sample__logo">
            <Icon name="building" size={20} />
          </span>
          <div>
            <h3>Example Foods Distribution</h3>
            <p>Rotterdam, Netherlands</p>
          </div>
          <span className="score" title="Lead score">
            <strong>87</strong>
            <small>score</small>
          </span>
        </header>

        <div className="sample__contact">
          <div>
            <span className="sample__label">Decision maker</span>
            <p>
              Alex Morgan <em>· Head of Purchasing</em>
            </p>
          </div>
          <span className="badge badge--verified">
            <Icon name="check" size={14} />
            Verified
          </span>
        </div>

        <div className="sample__email">
          <span className="sample__label">Draft outreach email</span>
          <p>
            <strong>Subject: A supplier for your specialty range</strong>
            <br />
            Hi Alex, I noticed Example Foods Distribution imports specialty
            goods across the Benelux region. We make…
          </p>
          <span className="sample__more">Read full email ▾</span>
        </div>
      </article>

      <article className="sample__card sample__card--compact">
        <span className="sample__logo">
          <Icon name="building" size={18} />
        </span>
        <div className="sample__compact-text">
          <h3>Sample Imports Ltd</h3>
          <p>Hamburg, Germany</p>
        </div>
        <span className="badge badge--unverified">Unverified</span>
        <span className="score score--sm">
          <strong>72</strong>
        </span>
      </article>
    </div>
  )
}
