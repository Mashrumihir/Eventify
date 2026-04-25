import { useEffect, useRef, useState } from 'react'
import './css/Profile.css'
import {
  fetchAttendeeProfile,
  updateAttendeeProfile,
  uploadAvatar,
} from '../../services/dataService'

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

export default function Profile({ currentUser }) {
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

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!currentUser?.id) {
        return
      }

      try {
        const response = await fetchAttendeeProfile(currentUser.id)

        if (isMounted && response.profile) {
          setProfile((currentProfile) => ({
            ...currentProfile,
            ...response.profile,
          }))
        }
      } catch (loadError) {
        if (isMounted) {
          setMessage(loadError.message || 'Failed to load profile.')
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

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

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!currentUser?.id) {
      setMessage('Please login again to upload photo.')
      return
    }

    try {
      setMessage('Uploading photo...')
      const response = await uploadAvatar(file, currentUser.id)
      const fullPhotoUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${response.avatarUrl}`
      setProfile((current) => ({ ...current, photo: fullPhotoUrl }))
      setMessage('Profile photo uploaded successfully.')
    } catch (uploadError) {
      setMessage(uploadError.message || 'Failed to upload photo.')
    }
  }

  const handleSaveProfile = async () => {
    if (!currentUser?.id) {
      setMessage('Please login again to update profile.')
      return
    }

    try {
      await updateAttendeeProfile({
        userId: currentUser.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
      })

      setMessage('Profile changes saved successfully.')
    } catch (saveError) {
      setMessage(saveError.message || 'Failed to save profile changes.')
    }
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
    <div className="org-page-layout">
      <div className="org-profile-header">
        <h1 className="org-page-title">Profile Settings</h1>
        <p className="org-page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="org-profile-container">
        <div className="org-profile-sidebar">
          <button
            className={`org-tab-btn ${activeTab === 'edit-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit-profile')}
            type="button"
          >
            <span className="org-tab-icon"><UserIcon /></span>
            Edit Profile
          </button>

          <button
            className={`org-tab-btn ${activeTab === 'change-password' ? 'active' : ''}`}
            onClick={() => setActiveTab('change-password')}
            type="button"
          >
            <span className="org-tab-icon"><LockIcon /></span>
            Change Password
          </button>
        </div>

        <div className="org-profile-content">
          {activeTab === 'edit-profile' ? (
            <EditProfileTab
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
            <ChangePasswordTab
              onChange={handlePasswordChange}
              onReset={handleResetPasswords}
              onSubmit={handleUpdatePassword}
              passwords={passwords}
              showPasswords={showPasswords}
              onToggleVisibility={togglePasswordVisibility}
            />
          ) : null}

          {message ? <p className="org-status-message">{message}</p> : null}
        </div>
      </div>
    </div>
  )
}

function EditProfileTab({
  fileInputRef,
  onChange,
  onPhotoChange,
  onPhotoClick,
  onReset,
  onSave,
  profile,
}) {
  return (
    <div className="org-tab-pane">
      <h2 className="org-pane-title">Edit Profile</h2>

      <div className="org-profile-photo-section">
        <div className="org-photo-avatar">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="org-photo-image" />
          ) : (
            profile.name.slice(0, 2).toUpperCase()
          )}
          <button className="org-photo-camera" onClick={onPhotoClick} type="button">
            <CameraIcon />
          </button>
          <input
            ref={fileInputRef}
            className="org-hidden-input"
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
          />
        </div>

        <div className="org-photo-info">
          <h3>Profile Photo</h3>
          <p>Upload a new photo or change existing</p>
          <button className="org-upload-btn" onClick={onPhotoClick} type="button">Upload Photo</button>
        </div>
      </div>

      <div className="org-form-grid">
        <div className="org-form-group">
          <label htmlFor="org-name">Full Name</label>
          <input id="org-name" name="name" type="text" value={profile.name} onChange={onChange} />
        </div>

        <div className="org-form-group">
          <label htmlFor="org-email">Email Address</label>
          <input id="org-email" name="email" type="email" value={profile.email} onChange={onChange} />
        </div>

        <div className="org-form-group">
          <label htmlFor="org-phone">Phone Number</label>
          <input id="org-phone" name="phone" type="text" value={profile.phone} onChange={onChange} />
        </div>

        <div className="org-form-group">
          <label htmlFor="org-location">Location</label>
          <input id="org-location" name="location" type="text" value={profile.location} onChange={onChange} />
        </div>

        <div className="org-form-group">
          <label htmlFor="org-dob">Date of Birth</label>
          <input id="org-dob" name="dob" type="date" value={profile.dob} onChange={onChange} />
        </div>

        <div className="org-form-group org-full-width">
          <label htmlFor="org-bio">Bio</label>
          <textarea id="org-bio" name="bio" rows="4" value={profile.bio} onChange={onChange} />
        </div>
      </div>

      <div className="org-form-actions">
        <button className="org-btn-primary" onClick={onSave} type="button">Save Changes</button>
        <button className="org-btn-secondary" onClick={onReset} type="button">Cancel</button>
      </div>
    </div>
  )
}

function ChangePasswordTab({
  onChange,
  onReset,
  onSubmit,
  passwords,
  showPasswords,
  onToggleVisibility,
}) {
  return (
    <div className="org-tab-pane">
      <h2 className="org-pane-title">Change Password</h2>

      <div className="org-form-stack org-form-stack-wide">
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
        <button className="org-btn-primary" onClick={onSubmit} type="button">Update Password</button>
        <button className="org-btn-secondary" onClick={onReset} type="button">Cancel</button>
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
    <div className="org-form-group">
      <label htmlFor={field}>{label}</label>
      <div className="org-input-with-icon-left-right">
        <svg className="icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <button className="org-password-toggle" onClick={() => onToggleVisibility(field)} type="button">
          <EyeIcon open={showPasswords[field]} />
        </button>
      </div>
    </div>
  )
}
