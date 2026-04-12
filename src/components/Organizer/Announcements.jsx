import React, { useMemo, useState } from 'react'
import './css/Announcements.css'

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Venue Change for Summer Festival',
    event: 'Summer Music Festival 2024',
    date: 'Apr 4, 2026',
    content: 'Due to weather conditions, the venue has been moved to Indoor Arena. All ticket holders will receive updated location details via email. The event timing remains the same.',
  },
  {
    id: 2,
    title: 'Early Bird Tickets Available',
    event: 'Tech Summit 2026',
    date: 'Apr 2, 2026',
    content: 'Get 20% off on tickets purchased before March 1st! Limited time offer for our most anticipated technology conference of the year. Secure your spot today and save big.',
  },
  {
    id: 3,
    title: 'New VIP Package Launched',
    event: 'Modern Art Exhibition',
    date: 'Mar 31, 2026',
    content: 'Exclusive VIP packages now available with backstage access and premium seating. Includes meet and greet with speakers, premium networking lounge access, and complimentary refreshments.',
  },
]

const INITIAL_FORM = {
  title: '',
  event: '',
  content: '',
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS)
  const [showComposer, setShowComposer] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [statusMessage, setStatusMessage] = useState('')

  const eventOptions = useMemo(() => (
    Array.from(new Set(announcements.map((announcement) => announcement.event)))
  ), [announcements])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleToggleComposer = () => {
    setShowComposer((current) => !current)
    setStatusMessage('')
  }

  const handleCancel = () => {
    setShowComposer(false)
    setForm(INITIAL_FORM)
  }

  const handleSubmit = () => {
    if (!form.title.trim() || !form.event.trim() || !form.content.trim()) {
      setStatusMessage('Please fill in the title, event, and message.')
      return
    }

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    setAnnouncements((current) => [
      {
        id: Date.now(),
        title: form.title.trim(),
        event: form.event.trim(),
        date: today,
        content: form.content.trim(),
      },
      ...current,
    ])

    setForm(INITIAL_FORM)
    setShowComposer(false)
    setStatusMessage('Announcement sent successfully.')
  }

  return (
    <div className="org-page-layout">
      <div className="org-page-header ann-header">
        <div className="ann-header-left">
          <div className="ann-header-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <h1 className="org-page-title">Announcements</h1>
            <p className="org-page-subtitle">Send updates and notifications to attendees.</p>
          </div>
        </div>

        <button className="ann-btn-new" onClick={handleToggleComposer} type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {showComposer ? <line x1="18" y1="6" x2="6" y2="18" /> : <line x1="12" y1="5" x2="12" y2="19" />}
            {showComposer ? <line x1="6" y1="6" x2="18" y2="18" /> : <line x1="5" y1="12" x2="19" y2="12" />}
          </svg>
          {showComposer ? 'Close' : 'New Announcement'}
        </button>
      </div>

      {statusMessage ? <p className="ann-status-message">{statusMessage}</p> : null}

      {showComposer ? (
        <section className="ann-compose-card">
          <h2 className="ann-compose-title">Create Announcement</h2>

          <div className="ann-form-group">
            <label htmlFor="announcement-title">Title</label>
            <input
              id="announcement-title"
              name="title"
              type="text"
              placeholder="Announcement title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="ann-form-group">
            <label htmlFor="announcement-event">Event</label>
            <select id="announcement-event" name="event" value={form.event} onChange={handleChange}>
              <option value="">Select or type event name</option>
              {eventOptions.map((eventName) => (
                <option key={eventName} value={eventName}>{eventName}</option>
              ))}
            </select>
          </div>

          <div className="ann-form-group">
            <label htmlFor="announcement-message">Message</label>
            <textarea
              id="announcement-message"
              name="content"
              rows="6"
              placeholder="Type your announcement message..."
              value={form.content}
              onChange={handleChange}
            />
          </div>

          <div className="ann-compose-actions">
            <button className="ann-btn-cancel" onClick={handleCancel} type="button">Cancel</button>
            <button className="ann-btn-send" onClick={handleSubmit} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send Announcement
            </button>
          </div>
        </section>
      ) : null}

      <div className="ann-list">
        {announcements.map((announcement) => (
          <article key={announcement.id} className="ann-card">
            <div className="ann-card-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>

            <div className="ann-content-wrap">
              <h3 className="ann-title">{announcement.title}</h3>
              <p className="ann-meta">{announcement.event} • {announcement.date}</p>
              <p className="ann-text">{announcement.content}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
