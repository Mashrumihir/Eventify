import React, { useState } from 'react'
import './css/Login.css'

export default function Login({ onLogin, onNavigateToRegister, onNavigateToForgot }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    onLogin({
      name: 'Eventify User',
      email,
      role: 'attend',
    })

    setIsSubmitting(false)
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
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="auth-btn-eye">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div className="auth-form-options">
            <label className="auth-checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); onNavigateToForgot && onNavigateToForgot(); }}>Forgot Password?</a>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }}>Sign Up</a></p>
        </div>
      </div>
    </div>
  )
}
