import { useRef, useState } from 'react'
import './css/ProfileSettings.css'

const DEFAULT_PROFILE = {
  name: 'Mihir Mashru',
  email: 'mashrumihir15@gmail.com',
  phone: '+91 8180253134',
  location: 'Jamnagar, Gujarat',
  dob: '2006-04-06',
  bio: '',
  photo: '',
}

const DEFAULT_PASSWORDS = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.17 4.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('edit-profile')
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [passwords, setPasswords] = useState(DEFAULT_PASSWORDS)
  const [message, setMessage] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const fileInputRef = useRef(null)

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswords((current) => ({ ...current, [name]: value }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const photoUrl = URL.createObjectURL(file)
    setProfile((current) => ({ ...current, photo: photoUrl }))
    setMessage('Profile photo selected successfully.')
  }

  const handleSaveProfile = () => {
    setMessage('Profile changes saved successfully.')
  }

  const handleResetProfile = () => {
    setProfile(DEFAULT_PROFILE)
    setMessage('Profile form reset.')
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((current) => ({ ...current, [field]: !current[field] }))
  }

  const handleUpdatePassword = () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage('Fill in all password fields.')
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('New password and confirm password do not match.')
      return
    }

    if (passwords.newPassword.length < 8) {
      setMessage('New password must be at least 8 characters long.')
      return
    }

    setPasswords(DEFAULT_PASSWORDS)
    setMessage('Password updated successfully.')
  }

  const handleResetPasswords = () => {
    setPasswords(DEFAULT_PASSWORDS)
    setMessage('Password form cleared.')
  }

  return (
    <div className="ps-layout-main">
      <div>
        <h1 className="ps-page-title">Profile Settings</h1>
        <p className="ps-page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="ps-content">
        <div className="ps-sidebar">
          <button
            className={`ps-tab-btn ${activeTab === 'edit-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit-profile')}
            type="button"
          >
            <span className="icon-placeholder"><UserIcon /></span>
            Edit Profile
          </button>

          <button
            className={`ps-tab-btn ${activeTab === 'change-password' ? 'active' : ''}`}
            onClick={() => setActiveTab('change-password')}
            type="button"
          >
            <span className="icon-placeholder"><LockIcon /></span>
            Change Password
          </button>
        </div>

        <div className="ps-panel">
          {activeTab === 'edit-profile' ? (
            <EditProfilePanel
              fileInputRef={fileInputRef}
              onChange={handleProfileChange}
              onPhotoChange={handlePhotoChange}
              onPhotoClick={handlePhotoClick}
              onReset={handleResetProfile}
              onSave={handleSaveProfile}
              profile={profile}
            />
          ) : null}

          {activeTab === 'change-password' ? (
            <ChangePasswordPanel
              onChange={handlePasswordChange}
              onReset={handleResetPasswords}
              onSubmit={handleUpdatePassword}
              passwords={passwords}
              showPasswords={showPasswords}
              onToggleVisibility={togglePasswordVisibility}
            />
          ) : null}

          {message ? <p className="ps-status-message">{message}</p> : null}
        </div>
      </div>
    </div>
  )
}

function EditProfilePanel({
  fileInputRef,
  onChange,
  onPhotoChange,
  onPhotoClick,
  onReset,
  onSave,
  profile,
}) {
  return (
    <div className="panel-container">
      <h2 className="panel-title">Edit Profile</h2>

      <div className="ps-photo-section">
        <div className="ps-photo-avatar">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="ps-photo-image" />
          ) : (
            profile.name.slice(0, 2).toUpperCase()
          )}
          <button className="ps-photo-edit-btn" onClick={onPhotoClick} type="button">
            <CameraIcon />
          </button>
          <input
            ref={fileInputRef}
            className="ps-hidden-input"
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
          />
        </div>

        <div className="ps-photo-info">
          <h3>Profile Photo</h3>
          <p>Upload a new photo or change existing</p>
          <button className="ps-link-btn" onClick={onPhotoClick} type="button">Upload Photo</button>
        </div>
      </div>

      <hr className="ps-divider" />

      <div className="ps-form-grid">
        <div className="ps-form-group">
          <label htmlFor="attend-name">Full Name</label>
          <input id="attend-name" name="name" type="text" value={profile.name} onChange={onChange} />
        </div>

        <div className="ps-form-group">
          <label htmlFor="attend-email">Email Address</label>
          <input id="attend-email" name="email" type="email" value={profile.email} onChange={onChange} />
        </div>

        <div className="ps-form-group">
          <label htmlFor="attend-phone">Phone Number</label>
          <input id="attend-phone" name="phone" type="text" value={profile.phone} onChange={onChange} />
        </div>

        <div className="ps-form-group">
          <label htmlFor="attend-location">Location</label>
          <input id="attend-location" name="location" type="text" value={profile.location} onChange={onChange} />
        </div>

        <div className="ps-form-group">
          <label htmlFor="attend-dob">Date of Birth</label>
          <input id="attend-dob" name="dob" type="date" value={profile.dob} onChange={onChange} />
        </div>

        <div className="ps-form-group full-width">
          <label htmlFor="attend-bio">Bio</label>
          <textarea id="attend-bio" name="bio" rows="4" value={profile.bio} onChange={onChange} />
        </div>
      </div>

      <div className="ps-actions">
        <button className="ps-btn-primary" onClick={onSave} type="button">Save Changes</button>
        <button className="ps-btn-outline" onClick={onReset} type="button">Cancel</button>
      </div>
    </div>
  )
}

function ChangePasswordPanel({
  onChange,
  onReset,
  onSubmit,
  passwords,
  showPasswords,
  onToggleVisibility,
}) {
  return (
    <div className="panel-container">
      <h2 className="panel-title">Change Password</h2>

      <div className="ps-form-column ps-form-column-wide">
        <PasswordField
          field="currentPassword"
          label="Current Password"
          onChange={onChange}
          onToggleVisibility={onToggleVisibility}
          placeholder="Enter current password"
          showPasswords={showPasswords}
          value={passwords.currentPassword}
        />
        <PasswordField
          field="newPassword"
          label="New Password"
          onChange={onChange}
          onToggleVisibility={onToggleVisibility}
          placeholder="Enter new password"
          showPasswords={showPasswords}
          value={passwords.newPassword}
        />
        <PasswordField
          field="confirmPassword"
          label="Confirm New Password"
          onChange={onChange}
          onToggleVisibility={onToggleVisibility}
          placeholder="Confirm new password"
          showPasswords={showPasswords}
          value={passwords.confirmPassword}
        />

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
        <button className="ps-btn-primary" onClick={onSubmit} type="button">Update Password</button>
        <button className="ps-btn-outline" onClick={onReset} type="button">Cancel</button>
      </div>
    </div>
  )
}

function PasswordField({
  field,
  label,
  onChange,
  onToggleVisibility,
  placeholder,
  showPasswords,
  value,
}) {
  return (
    <div className="ps-form-group">
      <label htmlFor={field}>{label}</label>
      <div className="ps-input-with-icons">
        <svg className="icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input
          id={field}
          name={field}
          type={showPasswords[field] ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          className="ps-password-toggle"
          onClick={() => onToggleVisibility(field)}
          type="button"
        >
          <EyeIcon open={showPasswords[field]} />
        </button>
      </div>
    </div>
  )
}
