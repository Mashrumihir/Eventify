import React from 'react'
import './css/ReviewsRatings.css'

const REVIEW_STATS = [
  { id: 'total', label: 'Total Reviews', count: 4, color: 'yellow', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'approved', label: 'Approved', count: 2, color: 'green', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> },
  { id: 'pending', label: 'Pending', count: 1, color: 'orange', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
  { id: 'reported', label: 'Reported', count: 1, color: 'red', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> }
]

const REVIEWS = [
  {
    id: 1,
    initials: 'JS',
    name: 'John Smith',
    event: 'Tech Conference 2024',
    rating: 5,
    time: '2 days ago',
    text: 'Amazing event! Great speakers and excellent organization. Learned so much about the latest tech trends.',
    status: 'Approved',
    statusColor: 'green'
  },
  {
    id: 2,
    initials: 'EW',
    name: 'Emma Wilson',
    event: 'Summer Music Festival',
    rating: 4,
    time: '3 days ago',
    text: 'Good music festival but the sound system could be better.',
    status: 'Approved',
    statusColor: 'green'
  },
  {
    id: 3,
    initials: 'MB',
    name: 'Michael Brown',
    event: 'Sports Championship',
    rating: 2,
    time: '5 days ago',
    text: 'Very disappointing. Poor organization and overpriced tickets.',
    status: 'Reported',
    statusColor: 'red'
  },
  {
    id: 4,
    initials: 'SD',
    name: 'Sarah Davis',
    event: 'Art Exhibition 2024',
    rating: 5,
    time: '1 week ago',
    text: 'Absolutely stunning exhibition!',
    status: 'Pending',
    statusColor: 'orange'
  }
]

export default function ReviewsRatings() {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill={idx < rating ? "#facc15" : "none"} stroke={idx < rating ? "#facc15" : "#cbd5e1"} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="rr-header-section">
          <div>
            <h2 className="admin-section-title" style={{color: '#1e3a8a'}}>Reviews & Ratings</h2>
            <p className="admin-section-subtitle">Monitor and moderate user reviews across all events.</p>
          </div>
          <button className="rr-btn-write">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Write Review
          </button>
        </div>

        <div className="rr-stats-container">
          {REVIEW_STATS.map(stat => (
            <div key={stat.id} className={`rr-stat-card rr-border-${stat.color} rr-bg-light-${stat.color}`}>
              <div className="rr-stat-content">
                <span className={`rr-stat-label rr-text-${stat.color}`}>{stat.label}</span>
                <span className="rr-stat-count">{stat.count}</span>
              </div>
              <div className={`rr-stat-icon rr-icon-bg-${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="rr-list-container">
          {REVIEWS.map(review => (
            <div key={review.id} className="rr-card">
              <div className="rr-card-left">
                <div className="rr-avatar">{review.initials}</div>
              </div>
              <div className="rr-card-main">
                <div className="rr-main-header">
                  <div className="rr-user-info">
                    <h4>{review.name}</h4>
                    <span className="rr-event-name">{review.event}</span>
                    <div className="rr-rating-row">
                      <div className="rr-stars">{renderStars(review.rating)}</div>
                      <span className="rr-time">{review.time}</span>
                    </div>
                  </div>
                  <div className={`rr-status rr-text-${review.statusColor}`}>
                    {review.status}
                  </div>
                </div>

                <div className="rr-review-text">
                  {review.text}
                </div>

                <div className="rr-action-row">
                  <button className="rr-btn-secondary">View Details</button>
                  {review.status === 'Pending' && (
                    <button className="rr-btn-success">Approve</button>
                  )}
                  {review.status === 'Reported' && (
                    <button className="rr-btn-danger">Remove</button>
                  )}
                  <button className="rr-btn-danger-light">Report</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
