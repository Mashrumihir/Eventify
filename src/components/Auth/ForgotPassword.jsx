import React, { useState } from 'react'
import './css/Login.css'
import './css/AuthFlows.css'

export default function ForgotPassword({ onBack, onSubmit }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(email)
    } catch (submitError) {
      setError(submitError.message || 'Unable to send OTP right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-logo-header">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-logo-icon">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          <line x1="12" y1="2" x2="12" y2="-2" />
          <line x1="5" y1="5" x2="2" y2="2" />
          <line x1="19" y1="5" x2="22" y2="2" />
          <line x1="2" y1="12" x2="-2" y2="12" />
          <line x1="22" y1="12" x2="26" y2="12" />
        </svg>
        <span className="auth-logo-text">Eventify</span>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Forgot Password?</h2>
          <p>No worries, we will send you reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error ? <p className="auth-error-text">{error}</p> : null}

          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" style={{ marginTop: '16px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Sending OTP...' : 'Send Email OTP'}
          </button>
        </form>

        <a className="auth-back-link" onClick={(e) => { e.preventDefault(); onBack(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Sign In
        </a>
      </div>
    </div>
  )
}
