// Turn Supabase auth errors into plain, friendly sentences for customers.
export function friendlyAuthError(error) {
  if (!error) return ''
  const code = error.code || ''
  const msg = (error.message || '').toLowerCase()

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
