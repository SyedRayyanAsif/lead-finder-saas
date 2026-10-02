import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
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
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

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
            {/* Render nothing while we check for an existing session, so the
                buttons don't flash "Log in" for someone who's already in. */}
            {!loading && user && (
              <>
                <Link to="/request" className="nav__link">
                  New request
                </Link>
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                  Log out
                </button>
              </>
            )}
            {!loading && !user && (
              <>
                <Link to="/login" className="nav__link">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn--primary btn--sm">
                  Sign up
                </Link>
              </>
            )}
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
