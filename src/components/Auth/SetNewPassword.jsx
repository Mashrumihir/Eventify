import React, { useState } from 'react'
import './css/Login.css'

export default function SetNewPassword({ onSubmit }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirm: false,
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('New password and confirm password do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(password)
    } catch (submitError) {
      setError(submitError.message || 'Unable to reset password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-logo-header">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-logo-icon">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="auth-logo-text">Eventify</span>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Set New Password</h2>
          <p>Create a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error ? <p className="auth-error-text">{error}</p> : null}

          <div className="auth-input-wrapper">
            <svg className="auth-input-icon lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              type={visiblePasswords.password ? 'text' : 'password'} 
              placeholder="Create a new password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-btn-eye"
              onClick={() => togglePasswordVisibility('password')}
              aria-label={visiblePasswords.password ? 'Hide password' : 'Show password'}
              title={visiblePasswords.password ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={visiblePasswords.password} />
            </button>
          </div>

          <div className="auth-input-wrapper">
            <svg className="auth-input-icon lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              type={visiblePasswords.confirm ? 'text' : 'password'} 
              placeholder="Confirm your new password" 
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-btn-eye"
              onClick={() => togglePasswordVisibility('confirm')}
              aria-label={visiblePasswords.confirm ? 'Hide password' : 'Show password'}
              title={visiblePasswords.confirm ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={visiblePasswords.confirm} />
            </button>
          </div>

          <button type="submit" className="auth-submit-btn" style={{ marginTop: '8px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.17 4.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1 1l22 22" />
      </svg>
    )
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
