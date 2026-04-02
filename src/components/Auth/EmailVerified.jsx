import React from 'react'
import './css/Login.css'
import './css/AuthFlows.css'

export default function EmailVerified({ onContinue, onGoHome }) {
  return (
    <div className="auth-layout">
      <div className="auth-logo-header">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-logo-icon">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="auth-logo-text">Eventify</span>
      </div>

      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="auth-card-header" style={{ marginBottom: '32px' }}>
          <h2>Email Verified!</h2>
          <p style={{ marginTop: '12px' }}>
            Your email has been successfully<br/>
            verified. You can now access all features<br/>
            of Eventify.
          </p>
        </div>

        <button className="auth-submit-btn" onClick={onContinue}>
          Continue to Sign In
        </button>

        <a className="auth-back-link" style={{ marginTop: '24px' }} onClick={(e) => { e.preventDefault(); onGoHome(); }}>
          Go to Homepage
        </a>
      </div>
    </div>
  )
}
