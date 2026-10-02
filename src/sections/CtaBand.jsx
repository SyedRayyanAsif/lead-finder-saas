import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function CtaBand() {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <h2>Ready to find your next customers?</h2>
        <p>Create a free account and send us your first request.</p>
        <Link to="/signup" className="btn btn--light btn--lg">
          Sign up free
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </section>
  )
}
