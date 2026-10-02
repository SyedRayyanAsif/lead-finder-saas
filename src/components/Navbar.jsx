import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the user navigates.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Logo />

        <nav
          id="site-nav"
          className={`nav__links ${open ? 'is-open' : ''}`}
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="nav__link">
              {link.label}
            </Link>
          ))}
          <div className="nav__auth">
            <Link to="/login" className="nav__link">
              Log in
            </Link>
            <Link to="/signup" className="btn btn--primary btn--sm">
              Sign up
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  )
}
