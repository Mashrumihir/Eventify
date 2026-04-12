import React, { useMemo, useState } from 'react'
import './css/ManageEvents.css'

const EVENTS = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    status: 'Upcoming',
    date: '2024-03-15',
    dateLabel: 'March 15, 2024',
    location: 'Rajkot',
    category: 'Technology',
    revenue: '₹45,600',
    ticketsSold: 450,
    ticketsTotal: 500,
    description: 'Join top founders, builders, and product leaders for a full day of talks, demos, and networking.',
    time: '09:30',
    venue: 'Rajkot Convention Center, Rajkot',
    ticketType: 'Paid',
    ticketPrice: '1999',
    quantity: '500',
    earlyBirdEnabled: true,
    earlyBirdPrice: '1499',
    refundPolicy: 'Up to 7 days before event',
    bannerPreview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 420'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e40af'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='420' fill='url(%23g)'/%3E%3Ccircle cx='950' cy='320' r='170' fill='%23f97316' fill-opacity='0.9'/%3E%3Cpath d='M840 210c50 35 120 80 210 95' stroke='%23120f0f' stroke-width='8' fill='none'/%3E%3Cpath d='M950 145c0 100 0 200 0 350' stroke='%23120f0f' stroke-width='8' fill='none'/%3E%3Ctext x='80' y='130' fill='white' font-size='56' font-family='Arial, sans-serif' font-weight='700'%3ETech Conference%3C/text%3E%3Ctext x='80' y='190' fill='%23bfdbfe' font-size='26' font-family='Arial, sans-serif'%3ERajkot%3C/text%3E%3C/svg%3E",
  },
  {
    id: 2,
    title: 'Music Festival',
    status: 'Ongoing',
    date: '2024-03-10',
    dateLabel: 'March 10-12, 2024',
    location: 'Central Mumbai, Maharashtra',
    category: 'Music',
    revenue: '₹89,400',
    ticketsSold: 1200,
    ticketsTotal: 1200,
    description: 'A multi-day live music experience featuring headline artists, local acts, and food stalls.',
    time: '18:00',
    venue: 'Central Grounds, Mumbai',
    ticketType: 'VIP',
    ticketPrice: '3500',
    quantity: '1200',
    earlyBirdEnabled: false,
    earlyBirdPrice: '0',
    refundPolicy: 'No Refunds',
  },
  {
    id: 3,
    title: 'Business Summit',
    status: 'Completed',
    date: '2024-02-28',
    dateLabel: 'February 28, 2024',
    location: 'Morbi',
    category: 'Business',
    revenue: '₹32,800',
    ticketsSold: 328,
    ticketsTotal: 400,
    description: 'A focused summit for entrepreneurs and teams exploring strategy, growth, and partnerships.',
    time: '10:00',
    venue: 'Business Hub, Morbi',
    ticketType: 'Paid',
    ticketPrice: '999',
    quantity: '400',
    earlyBirdEnabled: true,
    earlyBirdPrice: '799',
    refundPolicy: 'Up to 24 hours before event',
  },
  {
    id: 4,
    title: 'Art Exhibition',
    status: 'Upcoming',
    date: '2024-04-05',
    dateLabel: 'April 5, 2024',
    location: 'Rajkot',
    category: 'Art',
    revenue: '₹18,750',
    ticketsSold: 125,
    ticketsTotal: 200,
    description: 'Explore contemporary pieces, installations, and artist talks in a thoughtfully curated showcase.',
    time: '16:30',
    venue: 'City Art Gallery, Rajkot',
    ticketType: 'Free',
    ticketPrice: '0',
    quantity: '200',
    earlyBirdEnabled: false,
    earlyBirdPrice: '0',
    refundPolicy: 'No Refunds',
  },
  {
    id: 5,
    title: 'Championship Basketball',
    status: 'Upcoming',
    date: '2026-08-05',
    dateLabel: 'August 5, 2026',
    location: 'R.K. University, Rajkot',
    category: 'Sports',
    revenue: '₹255',
    ticketsSold: 3,
    ticketsTotal: 200,
    description: 'Watch elite teams compete in an action-packed basketball final.',
    time: '19:30',
    venue: 'R.K. University, Rajkot',
    ticketType: 'Paid',
    ticketPrice: '85',
    quantity: '200',
    earlyBirdEnabled: false,
    earlyBirdPrice: '0',
    refundPolicy: '',
    bannerPreview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 420'%3E%3Cdefs%3E%3CradialGradient id='bg' cx='55%25' cy='45%25' r='70%25'%3E%3Cstop offset='0' stop-color='%23271b1b'/%3E%3Cstop offset='1' stop-color='%23040208'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1200' height='420' fill='url(%23bg)'/%3E%3Crect y='0' width='1200' height='130' fill='%23000000' fill-opacity='0.45'/%3E%3Cpath d='M340 10c-18 72-8 152 30 220 48 86 135 141 187 181' stroke='%23f5e7d9' stroke-width='18' fill='none' stroke-linecap='round'/%3E%3Cpath d='M395 8c-8 64 4 130 33 187 42 81 118 126 168 175' stroke='%23f5e7d9' stroke-width='18' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='210' cy='370' r='72' fill='%23c65a3c'/%3E%3Cpath d='M138 370h144M210 298c28 21 46 45 53 72-7 26-25 51-53 72M210 298c-28 21-46 45-53 72 7 26 25 51 53 72' stroke='%23612f20' stroke-width='6' fill='none'/%3E%3C/svg%3E",
  },
]

export default function ManageEvents({ onNavigate, onEditEvent }) {
  const [events, setEvents] = useState(EVENTS)
  const [query, setQuery] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [actionMessage, setActionMessage] = useState('')

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null

  const handleDeleteEvent = (eventToDelete) => {
    setEvents((current) => current.filter((event) => event.id !== eventToDelete.id))
    setSelectedEventId((current) => (current === eventToDelete.id ? null : current))
    setActionMessage(`"${eventToDelete.title}" deleted successfully.`)
  }

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return events
    }

    return events.filter((event) => (
      event.title.toLowerCase().includes(normalizedQuery)
      || event.location.toLowerCase().includes(normalizedQuery)
      || event.category.toLowerCase().includes(normalizedQuery)
    ))
  }, [events, query])

  if (selectedEvent) {
    const progressPercent = (selectedEvent.ticketsSold / selectedEvent.ticketsTotal) * 100

    return (
      <div className="org-page-layout">
        <article className="me-detail-card">
          <div className="me-card-top me-detail-top">
            <div className="me-card-header">
              <h2>{selectedEvent.title}</h2>
              <span className="me-badge">{selectedEvent.status}</span>
            </div>
            <div className="me-date me-detail-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {selectedEvent.dateLabel || selectedEvent.date}
            </div>
          </div>

          <div className="me-detail-body">
            <div className="me-detail-grid">
              <div className="me-detail-item">
                <span className="me-lbl">Location</span>
                <span className="me-detail-hero">{selectedEvent.location}</span>
              </div>
              <div className="me-detail-item">
                <span className="me-lbl">Category</span>
                <span className={`me-detail-hero me-cat ${selectedEvent.category.toLowerCase()}`}>{selectedEvent.category}</span>
              </div>
              <div className="me-detail-item">
                <span className="me-lbl">Revenue</span>
                <span className="me-detail-value text-green">{selectedEvent.revenue}</span>
              </div>
              <div className="me-detail-item">
                <span className="me-lbl">Tickets Sold</span>
                <span className="me-detail-value">{selectedEvent.ticketsSold} / {selectedEvent.ticketsTotal}</span>
              </div>
            </div>

            <div className="me-progress-bg me-detail-progress">
              <div className="me-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <p className="me-detail-description">{selectedEvent.description}</p>

            <div className="me-detail-actions">
              <button className="me-btn me-btn-back" onClick={() => setSelectedEventId(null)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
              </button>
              <button className="me-btn me-btn-primary" onClick={() => onEditEvent?.(selectedEvent)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Edit Event
              </button>
              <button className="me-btn-icon me-btn-delete" onClick={() => handleDeleteEvent(selectedEvent)} type="button" aria-label={`Delete ${selectedEvent.title}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="org-page-layout">
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Manage Events</h1>
          <p className="org-page-subtitle">View and manage all your events.</p>
        </div>
      </div>

      <div className="me-search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          placeholder="Search events by title, location, or category..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {actionMessage ? <p className="me-status-message">{actionMessage}</p> : null}

      <div className="me-grid">
        {filteredEvents.map((event) => {
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
                  {event.dateLabel || event.date}
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

                <div className="me-progress-bg">
                  <div className="me-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>

                <div className="me-actions">
                  <button className="me-btn me-btn-view" onClick={() => setSelectedEventId(event.id)} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View
                  </button>
                  <button className="me-btn me-btn-edit" onClick={() => onEditEvent?.(event)} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Edit
                  </button>
                  <button className="me-btn-icon me-btn-delete" onClick={() => handleDeleteEvent(event)} type="button" aria-label={`Delete ${event.title}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!filteredEvents.length ? (
        <div className="me-empty-state">
          <h3>No events found</h3>
          <p>{events.length ? 'Try a different search term.' : 'All events have been deleted.'}</p>
        </div>
      ) : null}
    </div>
  )
}
