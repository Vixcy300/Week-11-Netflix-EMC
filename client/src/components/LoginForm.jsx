import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../App'

/* ── Inline icons ─────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

/* ── Email regex ──────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginForm() {
  const navigate = useNavigate()

  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [apiError, setApiError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  /* ── Handlers ───────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    // Clear field error on type
    setErrors(prev => ({ ...prev, [name]: '' }))
    // Clear API error when user edits
    setApiError('')
  }

  const validate = () => {
    const errs = { email: '', password: '' }
    let valid = true

    if (!fields.email.trim()) {
      errs.email = 'Please enter your email or phone number.'
      valid = false
    } else if (!EMAIL_RE.test(fields.email)) {
      errs.email = 'Please enter a valid email address.'
      valid = false
    }

    if (!fields.password) {
      errs.password = 'Your password must be between 4 and 60 characters.'
      valid = false
    } else if (fields.password.length < 4 || fields.password.length > 60) {
      errs.password = 'Your password must be between 4 and 60 characters.'
      valid = false
    }

    setErrors(errs)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError('')

    try {
      const response = await axios.post('/api/login', {
        email: fields.email,
        password: fields.password,
      })

      if (response.data.success) {
        setUser(response.data.user)
        navigate('/dashboard')
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong. Please try again later.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  const emailHasValue = fields.email.length > 0
  const pwHasValue    = fields.password.length > 0

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} noValidate id="netflix-login-form">

      {/* API Error Banner */}
      {apiError && (
        <div className="error-banner" role="alert" id="api-error-banner">
          <AlertIcon />
          <span>{apiError}</span>
        </div>
      )}

      {/* Email field */}
      <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
        <input
          id="login-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          autoComplete="email"
          aria-label="Email or phone number"
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={emailHasValue ? 'has-value' : ''}
        />
        <label htmlFor="login-email">Email or phone number</label>
        {errors.email && (
          <p className="field-error" id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
        <div className="pw-wrapper">
          <input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            name="password"
            value={fields.password}
            onChange={handleChange}
            autoComplete="current-password"
            aria-label="Password"
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={pwHasValue ? 'has-value' : ''}
            style={{ paddingRight: '48px' }}
          />
          <label htmlFor="login-password">Password</label>
          <button
            type="button"
            className="pw-toggle"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            id="toggle-password-btn"
          >
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <p className="field-error" id="password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-signin"
        disabled={loading}
        id="signin-btn"
      >
        {loading ? (
          <>
            <span className="spinner" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Remember me + Need help? */}
      <div className="form-meta">
        <label className="remember-me" htmlFor="remember-me-checkbox">
          <input
            type="checkbox"
            id="remember-me-checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <span className="help-link" tabIndex={0} role="button" id="need-help-link">
          Need help?
        </span>
      </div>

      {/* Sign-up prompt */}
      <div className="login-card-footer">
        <p>
          New to Netflix?{' '}
          <a href="#" id="signup-link">Sign up now</a>.
        </p>
        <p className="recaptcha-notice">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
          <a href="#">Learn more.</a>
        </p>
      </div>
    </form>
  )
}
