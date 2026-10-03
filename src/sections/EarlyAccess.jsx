import Icon from '../components/Icon.jsx'
import { RESULT_SIZES, TURNAROUND } from '../config.js'

const POINTS = [
  {
    icon: 'userCheck',
    title: 'Reviewed by a person',
    text: `We’re in early access, so each request is handled closely rather than by an instant machine. Expect results within ${TURNAROUND}.`,
  },
  {
    icon: 'shield',
    title: 'Nothing guessed',
    text: 'Every decision maker is labelled verified or unverified, so you always know how much to trust a contact before you reach out.',
  },
  {
    icon: 'layers',
    title: 'Capped on purpose',
    text: `Each request returns ${RESULT_SIZES.slice(0, -1).join(', ')} or ${RESULT_SIZES.at(-1)} companies, never unlimited, so quality stays high.`,
  },
]

export default function EarlyAccess() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">What to expect</p>
          <h2 className="h2">Honest about where we are</h2>
          <p className="lead">
            We’d rather under-promise and deliver a list you can trust.
          </p>
        </div>
        <div className="cards">
          {POINTS.map((p) => (
            <div key={p.title} className="card">
              <span className="card__icon">
                <Icon name={p.icon} size={22} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
