import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow center">
        <h1 className="h2">Page not found</h1>
        <p className="lead">We couldn’t find that page.</p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </section>
  )
}
