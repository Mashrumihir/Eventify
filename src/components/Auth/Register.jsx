import React, { useState } from 'react'
import './css/Register.css'

export default function Register({ onRegister, onNavigateToLogin, onSelectRole }) {
  const [role, setRole] = useState('attend') // 'attend', 'organize', 'admin'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Trigger the register flow. The app might use the role for appMode.
    onRegister(role)
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

      <div className="auth-card register-card">
        <div className="auth-card-header">
          <h2>Create Account</h2>
          <p>Join Eventify and discover amazing events</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input 
              type="text" 
              name="name"
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-role-section">
            <label className="register-role-label">I want to:-</label>
            <div className="register-role-options">
              <div className="register-role-row">
                <button 
                  type="button" 
                  className={`role-btn ${role === 'attend' ? 'active' : ''}`}
                  onClick={() => setRole('attend')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="12" rx="2"/><line x1="8" y1="5" x2="16" y2="5"/><path d="M7 11h1M7 15h1M11 11h6M11 15h6"/></svg>
                  Attend Events
                </button>
                <button 
                  type="button"  
                  className={`role-btn ${role === 'organize' ? 'active' : ''}`}
                  onClick={() => setRole('organize')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="13" x2="12" y2="19"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
                  Organize Events
                </button>
              </div>
              <button 
                type="button" 
                className={`role-btn admin-role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M19 11v6"/><path d="M16 14h6"/><path d="M22 11h-2v-2h-2v2h-2v2h2v2h2v-2h2z"/></svg>
                Admin Panel
              </button>
            </div>
          </div>

          <div className="auth-input-wrapper">
            <svg className="auth-input-icon lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              type="password" 
              name="password"
              placeholder="Create a password" 
              value={formData.password}
              onChange={handleChange}
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
              name="confirmPassword"
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="button" className="auth-btn-eye">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>

          <button type="submit" className="auth-submit-btn">
            Create Account
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>Sign In</a></p>
        </div>
      </div>
    </div>
  )
}
