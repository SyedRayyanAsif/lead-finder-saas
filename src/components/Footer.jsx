import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { SITE_NAME } from '../config.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>
            Lead research for businesses entering new markets. Currently in
            early access – every request is researched by hand.
          </p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#pricing">Pricing</Link>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </nav>
      </div>
      <div className="container footer__legal">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
