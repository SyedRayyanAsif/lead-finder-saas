import { Link } from 'react-router-dom'
import { SITE_NAME } from '../config.js'

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${SITE_NAME} home`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <circle cx="14" cy="14" r="6" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="m19 19 5 5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span>{SITE_NAME}</span>
    </Link>
  )
}
