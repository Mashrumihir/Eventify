import React, { useState } from 'react'
import './css/Login.css'
import './css/AuthFlows.css'

export default function VerifyEmail({ onBack, onSubmit }) {
  // A simplistic state for the 6 boxes.
  const [code, setCode] = useState(['', '', '', '', '', ''])

  const handleChange = (index, val) => {
    // Basic update - a real implementation would use refs to auto-focus next boxes.
    const newCode = [...code]
    newCode[index] = val.slice(-1) // keep only 1 char
    setCode(newCode)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(code.join(''))
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
          <p>We have sent a code to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '0' }}>
          <label style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>Enter 6-digit code</label>
          
          <div className="otp-container">
            {code.map((digit, idx) => (
              <input 
                key={idx}
                type="text" 
                className="otp-box"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                maxLength="1"
                required
              />
            ))}
          </div>

          <p className="auth-resend-text">
            Resend code in <span>46s</span>
          </p>

          <button type="submit" className="auth-submit-btn">
            Verify Code
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
