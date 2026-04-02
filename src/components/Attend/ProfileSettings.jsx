import { useState } from 'react'
import './css/ProfileSettings.css'

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('edit-profile')

  return (
    <div className="ps-layout-main">
      <div className="ps-header">
        <h1 className="ps-page-title">Profile Settings</h1>
        <p className="ps-page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="ps-content">
        {/* Sidebar */}
        <div className="ps-sidebar">
          <button
            className={`ps-tab-btn ${activeTab === 'edit-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit-profile')}
          >
            {activeTab === 'edit-profile' && <span className="icon-placeholder user-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </span>}
            Edit Profile
          </button>

          <button
            className={`ps-tab-btn ${activeTab === 'change-password' ? 'active' : ''}`}
            onClick={() => setActiveTab('change-password')}
          >
            {activeTab === 'change-password' && <span className="icon-placeholder lock-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>}
            Change Password
          </button>

          <button
            className={`ps-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            {activeTab === 'notifications' && <span className="icon-placeholder bell-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </span>}
            Notifications
          </button>
        </div>

        {/* Main Panel */}
        <div className="ps-panel">
          {activeTab === 'edit-profile' && <EditProfilePanel />}
          {activeTab === 'change-password' && <ChangePasswordPanel />}
          {activeTab === 'notifications' && <NotificationsPanel />}
        </div>
      </div>
    </div>
  )
}

function EditProfilePanel() {
  return (
    <div className="panel-container">
      {/* Photo Section */}
      <div className="ps-photo-section">
        <div className="ps-photo-avatar">
          MM
          <div className="ps-photo-edit-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </div>
        </div>
        <div className="ps-photo-info">
          <h3>Profile Photo</h3>
          <p>Upload a new photo or change existing</p>
          <button className="ps-link-btn">Upload Photo</button>
        </div>
      </div>

      <hr className="ps-divider" />

      {/* Form Grid */}
      <div className="ps-form-grid">
        <div className="ps-form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Name" />
        </div>

        <div className="ps-form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Email" />
        </div>

        <div className="ps-form-group">
          <label>Phone Number</label>
          <input type="text" placeholder="Phone Number" />
        </div>

        <div className="ps-form-group">
          <label>Location</label>
          <input type="text" placeholder="Location" />
        </div>

        <div className="ps-form-group">
          <label>Date of Birth</label>
          <div className="ps-input-icon-right">
            <input type="text" placeholder="DD/MM/YYYY" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </div>
        </div>

        <div className="ps-form-group full-width">
          <label>Bio</label>
          <textarea rows="4" placeholder="Tell us a little bit about yourself..."></textarea>
        </div>
      </div>

      <div className="ps-actions">
        <button className="ps-btn-primary">Save Changes</button>
        <button className="ps-btn-outline">Cancel</button>
      </div>
    </div>
  )
}


function ChangePasswordPanel() {
  return (
    <div className="panel-container">
      <h2 className="panel-title">Change Password</h2>

      <div className="ps-form-column">
        <div className="ps-form-group">
          <label>Current Password</label>
          <div className="ps-input-with-icons">
            <svg className="icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <input type="password" placeholder="Enter current password" />
            <svg className="icon-right" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
        </div>

        <div className="ps-form-group">
          <label>New Password</label>
          <div className="ps-input-with-icons">
            <svg className="icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <input type="password" placeholder="Enter new password" />
            <svg className="icon-right" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
        </div>

        <div className="ps-form-group">
          <label>Confirm New Password</label>
          <div className="ps-input-with-icons">
            <svg className="icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <input type="password" placeholder="Confirm new password" />
            <svg className="icon-right" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
        </div>

        <div className="ps-password-rules">
          <h4>Password must contain:</h4>
          <ul>
            <li>At least 8 characters long</li>
            <li>Include uppercase and lowercase letters</li>
            <li>Include at least one number</li>
            <li>Include at least one special character</li>
          </ul>
        </div>
      </div>

      <div className="ps-actions">
        <button className="ps-btn-primary">Update Password</button>
        <button className="ps-btn-outline">Cancel</button>
      </div>
    </div>
  )
}


function NotificationsPanel() {
  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    reminders: true,
    promotions: false
  })

  const toggle = (key) => setPrefs({ ...prefs, [key]: !prefs[key] })

  return (
    <div className="panel-container">
      <h2 className="panel-title">Notification Preferences</h2>

      <div className="ps-toggle-list">
        <div className="ps-toggle-item">
          <div className="ps-toggle-info">
            <h4>Email Notifications</h4>
            <p>Receive updates via email</p>
          </div>
          <button className={`ps-toggle-btn ${prefs.email ? 'on' : 'off'}`} onClick={() => toggle('email')}>
            <div className="ps-toggle-knob"></div>
          </button>
        </div>

        <div className="ps-toggle-item">
          <div className="ps-toggle-info">
            <h4>Push Notifications</h4>
            <p>Receive push notifications on your device</p>
          </div>
          <button className={`ps-toggle-btn ${prefs.push ? 'on' : 'off'}`} onClick={() => toggle('push')}>
            <div className="ps-toggle-knob"></div>
          </button>
        </div>

        <div className="ps-toggle-item">
          <div className="ps-toggle-info">
            <h4>Event Reminders</h4>
            <p>Get reminded about upcoming events</p>
          </div>
          <button className={`ps-toggle-btn ${prefs.reminders ? 'on' : 'off'}`} onClick={() => toggle('reminders')}>
            <div className="ps-toggle-knob"></div>
          </button>
        </div>

        <div className="ps-toggle-item border-none">
          <div className="ps-toggle-info">
            <h4>Promotions & Offers</h4>
            <p>Receive promotional emails and special offers</p>
          </div>
          <button className={`ps-toggle-btn ${prefs.promotions ? 'on' : 'off'}`} onClick={() => toggle('promotions')}>
            <div className="ps-toggle-knob"></div>
          </button>
        </div>
      </div>

      <div className="ps-actions" style={{ marginTop: '24px' }}>
        <button className="ps-btn-primary">Save Preferences</button>
      </div>
    </div>
  )
}
