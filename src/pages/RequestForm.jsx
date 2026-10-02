import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { FIELD_LIMITS, MAX_RESULTS, RESULT_SIZES, TURNAROUND } from '../config.js'
import Icon from '../components/Icon.jsx'

const EMPTY = {
  company_name: '',
  industry: '',
  target_customer: '',
  target_country: '',
  target_city: '',
  result_count: String(RESULT_SIZES[0]),
}

export default function RequestForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Trim everything and make sure nothing is blank (whitespace passes `required`).
    const clean = {
      company_name: values.company_name.trim(),
      industry: values.industry.trim(),
      target_customer: values.target_customer.trim(),
      target_country: values.target_country.trim(),
      target_city: values.target_city.trim(),
      result_count: Number(values.result_count),
    }
    if (Object.values(clean).some((v) => v === '')) {
      setError('Please fill in every field so we know exactly who to look for.')
      return
    }
    if (!RESULT_SIZES.includes(clean.result_count)) {
      setError(`Please choose ${RESULT_SIZES.join(', ')} or ${MAX_RESULTS} results.`)
      return
    }

    setSubmitting(true)
    try {
      // Only the six form fields are sent. The owner, status and email are set
      // by the database itself, so they can't be faked from the browser.
      const { data, error: insertError } = await supabase
        .from('requests')
        .insert(clean)
        .select('id')
        .single()

      if (insertError) {
        console.error('[request insert]', insertError)
        setError(
          'We couldn’t save your request just now. Nothing has been lost — please try again in a moment.',
        )
        return
      }
      navigate('/request/received', { replace: true, state: { id: data.id, request: clean } })
    } catch (err) {
      console.error('[request insert]', err)
      setError('We couldn’t reach the server. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth">
      <div className="auth__card auth__card--wide">
        <h1 className="auth__title">Tell us who you’re looking for</h1>
        <p className="auth__sub">
          The more specific you are, the better your matches will be.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="company_name">Your company name</label>
            <input
              id="company_name"
              type="text"
              autoComplete="organization"
              required
              maxLength={FIELD_LIMITS.company_name}
              value={values.company_name}
              onChange={set('company_name')}
            />
          </div>

          <div className="field">
            <label htmlFor="industry">Industry / product type</label>
            <input
              id="industry"
              type="text"
              required
              maxLength={FIELD_LIMITS.industry}
              placeholder="e.g. organic skincare, industrial valves"
              value={values.industry}
              onChange={set('industry')}
            />
          </div>

          <div className="field">
            <label htmlFor="target_customer">Who do you want to find?</label>
            <input
              id="target_customer"
              type="text"
              required
              maxLength={FIELD_LIMITS.target_customer}
              aria-describedby="target-hint"
              placeholder="e.g. distributors, importers, buyers"
              value={values.target_customer}
              onChange={set('target_customer')}
            />
            <small id="target-hint">Describe your ideal customer in a few words.</small>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="target_country">Target country</label>
              <input
                id="target_country"
                type="text"
                autoComplete="country-name"
                required
                maxLength={FIELD_LIMITS.target_country}
                placeholder="e.g. Germany"
                value={values.target_country}
                onChange={set('target_country')}
              />
            </div>
            <div className="field">
              <label htmlFor="target_city">Target city</label>
              <input
                id="target_city"
                type="text"
                required
                maxLength={FIELD_LIMITS.target_city}
                placeholder="e.g. Hamburg"
                value={values.target_city}
                onChange={set('target_city')}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="result_count">How many companies?</label>
            <select
              id="result_count"
              required
              aria-describedby="count-hint"
              value={values.result_count}
              onChange={set('result_count')}
            >
              {RESULT_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n} companies
                </option>
              ))}
            </select>
            <small id="count-hint">
              Each request is capped at {MAX_RESULTS} companies — you can send
              another request any time.
            </small>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? 'Sending…' : 'Submit request'}
          </button>

          <p className="form-honest">
            <Icon name="clock" size={16} />
            <span>
              We’re in early access and reviewing requests closely, so results
              typically arrive within {TURNAROUND} — not instantly. We’ll email
              you as soon as your matches are ready.
            </span>
          </p>
        </form>
      </div>
    </section>
  )
}
