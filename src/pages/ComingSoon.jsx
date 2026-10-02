import { Link } from 'react-router-dom'

// Temporary placeholder for pages that are built in later steps.
export default function ComingSoon({ title, notFound = false }) {
  return (
    <section className="section">
      <div className="container narrow center">
        <h1 className="h2">{title}</h1>
        <p className="lead">
          {notFound
            ? "We couldn't find that page."
            : "This page is being built in the next step – accounts aren't open just yet."}
        </p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </section>
  )
}
