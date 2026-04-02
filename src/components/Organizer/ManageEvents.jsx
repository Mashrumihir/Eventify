import React from 'react'
import './css/ManageEvents.css'

const EVENTS = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    status: 'Upcoming',
    date: 'March 15, 2024',
    location: 'Rajkot',
    category: 'Technology',
    revenue: '₹45,600',
    ticketsSold: 450,
    ticketsTotal: 500,
  },
  {
    id: 2,
    title: 'Music Festival',
    status: 'Ongoing',
    date: 'March 10-12, 2024',
    location: 'Central Mumbai, Maharashtra',
    category: 'Music',
    revenue: '₹89,400',
    ticketsSold: 1200,
    ticketsTotal: 1200,
  },
  {
    id: 3,
    title: 'Business Summit',
    status: 'Completed',
    date: 'February 28, 2024',
    location: 'Morbi',
    category: 'Business',
    revenue: '₹32,800',
    ticketsSold: 328,
    ticketsTotal: 400,
  },
  {
    id: 4,
    title: 'Art Exhibition',
    status: 'Upcoming',
    date: 'April 5, 2024',
    location: 'Rajkot',
    category: 'Art',
    revenue: '₹18,750',
    ticketsSold: 125,
    ticketsTotal: 200,
  }
]

export default function ManageEvents() {
  return (
    <div className="org-page-layout">
      {/* Header */}
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Manage Events</h1>
          <p className="org-page-subtitle">View and manage all your events.</p>
        </div>
      </div>

      <div className="me-search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search events by title, location, or category..." />
      </div>

      <div className="me-grid">
        {EVENTS.map(event => {
          const progressPercent = (event.ticketsSold / event.ticketsTotal) * 100
          
          return (
            <div key={event.id} className="me-card">
              <div className="me-card-top">
                <div className="me-card-header">
                  <h3>{event.title}</h3>
                  <span className="me-badge">{event.status}</span>
                </div>
                <div className="me-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {event.date}
                </div>
              </div>

              <div className="me-card-content">
                <div className="me-info-grid">
                  <div className="me-info-item">
                    <span className="me-lbl">Location</span>
                    <span className="me-val">{event.location}</span>
                  </div>
                  <div className="me-info-item">
                    <span className="me-lbl">Category</span>
                    <span className={`me-cat ${event.category.toLowerCase()}`}>{event.category}</span>
                  </div>
                  <div className="me-info-item">
                    <span className="me-lbl">Revenue</span>
                    <span className="me-val text-green">{event.revenue}</span>
                  </div>
                  <div className="me-info-item">
                    <span className="me-lbl">Tickets Sold</span>
                    <span className="me-val">{event.ticketsSold} / {event.ticketsTotal}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="me-progress-bg">
                  <div className="me-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>

                <div className="me-actions">
                  <button className="me-btn me-btn-view">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View
                  </button>
                  <button className="me-btn me-btn-edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Edit
                  </button>
                  <button className="me-btn-icon me-btn-delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
