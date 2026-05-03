import React, { useState } from 'react'
import './css/Login.css'
import './css/AuthFlows.css'

export default function VerifyEmail({ email, onBack, onSubmit }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (index, val) => {
    const newCode = [...code]
    newCode[index] = val.replace(/\D/g, '').slice(-1)
    setCode(newCode)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(code.join(''))
    } catch (submitError) {
      setError(submitError.message || 'Unable to verify OTP.')
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
          <h2>Verify Your Email</h2>
          <p>We sent a 6-digit OTP to {email || 'your email'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '0' }}>
          {error ? <p className="auth-error-text" style={{ marginBottom: '16px' }}>{error}</p> : null}

          <label style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>Enter 6-digit code</label>
          
          <div className="otp-container">
            {code.map((digit, idx) => (
              <input 
                key={idx}
                type="text" 
                inputMode="numeric"
                className="otp-box"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                maxLength="1"
                required
              />
            ))}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
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
