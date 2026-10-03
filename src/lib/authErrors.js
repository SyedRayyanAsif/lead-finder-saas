import { LEGAL } from '../config.js'

// Turn Supabase auth errors into plain, friendly sentences for customers.
export function friendlyAuthError(error) {
  if (!error) return ''
  const code = error.code || ''
  const msg = (error.message || '').toLowerCase()

  // Supabase's built-in email sender only delivers to members of your own Supabase
  // organization. Until a custom SMTP provider is set up, this is what everyone
  // else sees when they ask for an email, so point them to a person.
  if (code === 'email_address_not_authorized' || msg.includes('email address not authorized')) {
    return `We can’t send email to this address just yet. Please email ${LEGAL.contactEmail} and we’ll help.`
  }
  if (code === 'same_password' || msg.includes('different from the old password')) {
    return 'Your new password needs to be different from your old one.'
  }
  if (code === 'session_not_found' || msg.includes('auth session missing')) {
    return 'This link has expired or was already used. Please request a new one.'
  }

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'That email and password don’t match. Please check them and try again.'
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Please confirm your email first. Check your inbox for the link we sent you.'
  }
  if (code === 'weak_password' || msg.includes('password should be')) {
    return 'That password is too weak. Please use at least 8 characters.'
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return 'An account with this email may already exist. Try logging in instead.'
  }
  if (
    error.status === 429 ||
    code === 'over_request_rate_limit' ||
    code === 'over_email_send_rate_limit'
  ) {
    return 'Too many attempts just now. Please wait a few minutes and try again.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'We couldn’t reach the server. Please check your connection and try again.'
  }
  return 'Something went wrong on our side. Please try again in a moment.'
}
