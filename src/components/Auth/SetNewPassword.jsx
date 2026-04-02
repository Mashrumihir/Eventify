import React, { useState } from 'react'
import './css/Login.css'

export default function SetNewPassword({ onSubmit }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(password)
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
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              type="password" 
              placeholder="Create a new password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="auth-btn-eye">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>

          <div className="auth-input-wrapper">
            <svg className="auth-input-icon lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              type="password" 
              placeholder="Confirm your new password" 
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button type="button" className="auth-btn-eye">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>

          <button type="submit" className="auth-submit-btn" style={{ marginTop: '8px' }}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}
