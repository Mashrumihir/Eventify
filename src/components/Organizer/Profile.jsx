import React, { useState } from 'react'
import './css/Profile.css'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('edit-profile')

  return (
    <div className="org-page-layout">
      {/* Header */}
      <div className="org-profile-header">
        <h1 className="org-page-title">Profile Settings</h1>
        <p className="org-page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="org-profile-container">
        {/* Left Tabs */}
        <div className="org-profile-sidebar">
          <button 
            className={`org-tab-btn ${activeTab === 'edit-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit-profile')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Edit Profile
          </button>
          <button 
            className={`org-tab-btn ${activeTab === 'change-password' ? 'active' : ''}`}
            onClick={() => setActiveTab('change-password')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Change Password
          </button>
          <button 
            className={`org-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="org-profile-content">
          {activeTab === 'edit-profile' && <EditProfileTab />}
          {activeTab === 'change-password' && <ChangePasswordTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  )
}

function EditProfileTab() {
  return (
    <div className="org-tab-pane">
      <div className="org-profile-photo-section">
        <div className="org-photo-avatar">
          MM
          <div className="org-photo-camera">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>
        <div className="org-photo-info">
          <h3>Profile Photo</h3>
          <p>Upload a new photo or change existing</p>
          <button className="org-upload-btn">Upload Photo</button>
        </div>
      </div>

      <div className="org-form-grid">
        <div className="org-form-group">
          <label>Full Name</label>
          <input type="text" placeholder="" defaultValue="Mihir Mashru" />
        </div>
        <div className="org-form-group">
          <label>Email Address</label>
          <input type="email" placeholder="" defaultValue="mihir@example.com" />
        </div>
        <div className="org-form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="" />
        </div>
        <div className="org-form-group">
          <label>Location</label>
          <input type="text" placeholder="" />
        </div>
        <div className="org-form-group">
          <label>Date of Birth</label>
          <div className="org-input-with-icon">
            <input type="text" placeholder="" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>
      </div>
      
      <div className="org-form-group" style={{ marginTop: '20px' }}>
        <label>Bio</label>
        <textarea rows="4" placeholder=""></textarea>
      </div>

      <div className="org-form-actions">
        <button className="org-btn-primary">Save Changes</button>
        <button className="org-btn-secondary">Cancel</button>
      </div>
    </div>
  )
}

function ChangePasswordTab() {
  return (
    <div className="org-tab-pane">
      <h2 className="org-pane-title">Change Password</h2>
      
      <div className="org-form-stack">
        <div className="org-form-group">
          <label>Current Password</label>
          <div className="org-input-with-icon-left-right">
            <svg className="icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" placeholder="Enter current password" />
            <svg className="icon-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
        
        <div className="org-form-group">
          <label>New Password</label>
          <div className="org-input-with-icon-left-right">
            <svg className="icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" placeholder="Enter new password" />
            <svg className="icon-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>

        <div className="org-form-group">
          <label>Confirm New Password</label>
          <div className="org-input-with-icon-left-right">
            <svg className="icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" placeholder="Confirm new password" />
            <svg className="icon-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
      </div>

      <div className="org-password-rules">
        <p className="org-rules-title">Password must contain:</p>
        <ul>
          <li>At least 8 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>

      <div className="org-form-actions">
        <button className="org-btn-primary">Update Password</button>
        <button className="org-btn-secondary">Cancel</button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="org-tab-pane">
      <h2 className="org-pane-title">Notification Preferences</h2>

      <div className="org-notification-list">
        <div className="org-notification-item">
          <div className="org-notification-info">
            <div className="org-notification-title">Email Notifications</div>
            <div className="org-notification-desc">Receive updates via email</div>
          </div>
          <label className="org-toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="org-slider round"></span>
          </label>
        </div>

        <div className="org-notification-item">
          <div className="org-notification-info">
            <div className="org-notification-title">Push Notifications</div>
            <div className="org-notification-desc">Receive push notifications on your device</div>
          </div>
          <label className="org-toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="org-slider round"></span>
          </label>
        </div>

        <div className="org-notification-item">
          <div className="org-notification-info">
            <div className="org-notification-title">Event Reminders</div>
            <div className="org-notification-desc">Get reminded about upcoming events</div>
          </div>
          <label className="org-toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="org-slider round"></span>
          </label>
        </div>

        <div className="org-notification-item">
          <div className="org-notification-info">
            <div className="org-notification-title">Promotions & Offers</div>
            <div className="org-notification-desc">Receive promotional emails and special offers</div>
          </div>
          <label className="org-toggle-switch">
            <input type="checkbox" />
            <span className="org-slider round"></span>
          </label>
        </div>
      </div>
    </div>
  )
}
