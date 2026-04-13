import './css/ContactMessages.css'

const CONTACT_MESSAGES = [
  {
    id: 1,
    name: 'Mihir Mashu',
    email: 'mashrumihir15@gmail.com',
    subject: 'Event Support',
    date: '11 Apr 2026, 09:14 PM',
    message: 'Dear Sir/Mam,\nGood morning\n\nGive contact me : 8160253134',
  },
]

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.7 6.5L5 22l3.7-2c1.1.3 2.2.5 3.3.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
      <circle cx="8" cy="11.5" r="1.1" fill="#314c85" />
      <circle cx="12" cy="11.5" r="1.1" fill="#314c85" />
      <circle cx="16" cy="11.5" r="1.1" fill="#314c85" />
    </svg>
  )
}

export default function ContactMessages() {
  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="cm-header-section">
          <h2 className="admin-section-title">Contact Messages</h2>
          <p className="admin-section-subtitle">View messages submitted from the website contact form.</p>
        </div>

        <div className="cm-card-shell">
          <div className="cm-card-header">
            <h3>Inbox</h3>
            <span className="cm-count-badge">{CONTACT_MESSAGES.length}</span>
          </div>

          <div className="cm-message-list">
            {CONTACT_MESSAGES.map((item) => (
              <article key={item.id} className="cm-message-card">
                <div className="cm-message-top">
                  <div className="cm-message-person">
                    <div className="cm-message-icon">
                      <MessageIcon />
                    </div>
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.email}</p>
                    </div>
                  </div>

                  <div className="cm-message-meta">
                    <time>{item.date}</time>
                    <button type="button" className="cm-delete-btn">Delete</button>
                  </div>
                </div>

                <span className="cm-subject-pill">{item.subject}</span>
                <p className="cm-message-text">{item.message}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
