import { useState } from 'react'
import './css/NewsletterSubscribers.css'

const INITIAL_SUBSCRIBERS = [
  {
    id: 1,
    email: 'mashrumihir15@gmail.com',
    addedOn: '11 Apr 2026, 07:33 PM',
  },
]

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

export default function NewsletterSubscribers() {
  const [email, setEmail] = useState('')
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS)

  const handleCreateSubscriber = () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      return
    }

    setSubscribers((current) => [
      {
        id: Date.now(),
        email: trimmedEmail,
        addedOn: '13 Apr 2026, 08:00 PM',
      },
      ...current,
    ])
    setEmail('')
  }

  const handleDeleteSubscriber = (id) => {
    setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id))
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="ns-header-section">
          <h2 className="admin-section-title">Newsletter Subscribers</h2>
          <p className="admin-section-subtitle">View everyone who subscribed from the admin dashboard newsletter section.</p>
        </div>

        <div className="ns-creator-shell">
          <input
            className="ns-email-input"
            type="email"
            placeholder="Enter subscriber email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="button" className="ns-create-btn" onClick={handleCreateSubscriber}>
            Create Subscriber
          </button>
        </div>

        <div className="ns-card-shell">
          <div className="ns-card-header">
            <h3>Subscriber List</h3>
            <span className="ns-count-badge">{subscribers.length}</span>
          </div>

          <div className="ns-list">
            {subscribers.map((subscriber) => (
              <article key={subscriber.id} className="ns-subscriber-card">
                <div className="ns-subscriber-left">
                  <div className="ns-mail-icon">
                    <MailIcon />
                  </div>
                  <strong>{subscriber.email}</strong>
                </div>

                <div className="ns-subscriber-right">
                  <time>Added on {subscriber.addedOn}</time>
                  <button
                    type="button"
                    className="ns-delete-btn"
                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
