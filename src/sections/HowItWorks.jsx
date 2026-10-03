import Icon from '../components/Icon.jsx'
import { TURNAROUND } from '../config.js'

const STEPS = [
  {
    icon: 'clipboard',
    title: 'Tell us your product and target market',
    text: 'Fill in a short form: what you sell, who you want to reach, and where. Plain language is fine.',
  },
  {
    icon: 'search',
    title: 'We research real companies',
    text: 'We research real companies that fit, by hand during early access, and give each one a score for how good a match it is.',
  },
  {
    icon: 'shield',
    title: 'We verify contact details',
    text: 'Decision makers are checked, never guessed. Anything we couldn’t confirm is clearly marked “unverified”.',
  },
  {
    icon: 'mail',
    title: 'You get a ready list with draft emails',
    text: `We email you personally when your list is ready, typically within ${TURNAROUND}. Each company comes with a drafted outreach email you can edit and send.`,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section section--tint">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">How it works</p>
          <h2 className="h2">From “who do I want?” to a ready list in four steps</h2>
          <p className="lead">
            No setup, no software to learn. You describe the customers; we do the
            legwork.
          </p>
        </div>

        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="step">
              <div className="step__top">
                <span className="step__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="step__icon">
                  <Icon name={step.icon} size={22} />
                </span>
              </div>
              <h3>
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
