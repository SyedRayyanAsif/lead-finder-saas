import { useAuth } from '../context/AuthContext.jsx'

// Temporary landing spot after login. Replaced by the real request form in the
// next build step.
export default function RequestPlaceholder() {
  const { user } = useAuth()
  return (
    <section className="section">
      <div className="container narrow center">
        <h1 className="h2">You’re in</h1>
        <p className="lead">
          Logged in as <strong>{user.email}</strong>. The request form is the
          next thing we’re building — it will live right here.
        </p>
      </div>
    </section>
  )
}
