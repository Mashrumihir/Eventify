import React from 'react'
import './css/Announcements.css'

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Venue Change for Summer Festival',
    meta: 'Summer Music Festival • Feb 16, 2026',
    content: 'Due to weather conditions, the venue has been moved to Indoor Arena. All ticket holders will receive updated location details via email. The event timing remains the same.'
  },
  {
    id: 2,
    title: 'Early Bird Tickets Available',
    meta: 'Tech Conference 2026 • Feb 14, 2026',
    content: 'Get 20% off on tickets purchased before March 1st! Limited time offer for our most anticipated technology conference of the year. Secure your spot today and save big.'
  },
  {
    id: 3,
    title: 'New VIP Package Launched',
    meta: 'Business Summit 2026 • Feb 12, 2026',
    content: 'Exclusive VIP packages now available with backstage access and premium seating. Includes meet and greet with speakers, premium networking lounge access, and complimentary refreshments.'
  }
]

export default function Announcements() {
  return (
    <div className="org-page-layout">
      {/* Header */}
      <div className="org-page-header manage-header">
        <div className="ann-header-left">
          <div className="org-header-icon bg-cyan text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <h1 className="org-page-title">Announcements</h1>
            <p className="org-page-subtitle">Send updates and notifications to attendees.</p>
          </div>
        </div>
        
        <button className="ann-btn-new">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Announcement
        </button>
      </div>

      {/* List */}
      <div className="ann-list">
        {ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className="ann-card">
            <div className="ann-icon bg-blue text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <div className="ann-content-wrap">
              <h3 className="ann-title">{ann.title}</h3>
              <p className="ann-meta">{ann.meta}</p>
              <p className="ann-text">{ann.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
