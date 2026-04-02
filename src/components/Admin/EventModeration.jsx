import React, { useState } from 'react'
import './css/EventModeration.css'

const EVENTS = [
  {
    id: 1,
    initials: 'TC',
    title: 'Tech Conference 2024',
    organizer: 'Tech Events Inc',
    status: 'pending',
    date: '2024-03-15',
    location: 'RKU,Rajkot',
    capacity: '500 capacity',
    price: '₹299'
  },
  {
    id: 2,
    initials: 'SM',
    title: 'Summer Music Festival',
    organizer: 'Music Festival Co',
    status: 'pending',
    date: '2024-07-20',
    location: 'XYZ',
    capacity: '2000 capacity',
    price: '₹89'
  }
]

export default function EventModeration() {
  const [activeTab, setActiveTab] = useState('Pending (2)')
  
  const tabs = ['Pending (2)', 'Approved (1)', 'Featured (1)', 'Rejected (0)']

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="em-header-section">
          <h2 className="admin-section-title" style={{color: '#1e3a8a'}}>Event Moderation</h2>
          <p className="admin-section-subtitle">Review, approve, and feature events on the platform.</p>
        </div>

        <div className="em-tabs-container">
          <div className="em-tabs">
            {tabs.map((tab) => (
              <button 
                key={tab}
                className={`em-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="em-grid">
          {EVENTS.map(event => (
            <div key={event.id} className="em-card">
              <div className="em-card-cover">
                {event.initials}
              </div>
              <div className="em-card-body">
                <div className="em-card-title-row">
                  <div>
                    <h3>{event.title}</h3>
                    <p className="em-organizer">{event.organizer}</p>
                  </div>
                  <span className="em-status-label">{event.status}</span>
                </div>

                <div className="em-card-details">
                  <div className="em-detail-col">
                    <div className="em-detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {event.date}
                    </div>
                    <div className="em-detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {event.location}
                    </div>
                    <div className="em-detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {event.capacity}
                    </div>
                  </div>
                  <div className="em-price">{event.price}</div>
                </div>
              </div>

              <div className="em-card-footer">
                <button className="em-btn-view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </button>
                <div className="em-action-group">
                  <button className="em-btn-approve-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button className="em-btn-reject-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
