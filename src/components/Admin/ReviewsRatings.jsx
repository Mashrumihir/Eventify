import React, { useState } from 'react'
import './css/ReviewsRatings.css'

const REVIEW_STATS = [
  { id: 'total', label: 'Total Reviews', count: 1, color: 'yellow', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'approved', label: 'Approved', count: 1, color: 'green', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> },
  { id: 'pending', label: 'Pending', count: 1, color: 'orange', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
  { id: 'reported', label: 'Reported', count: 0, color: 'red', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> }
]

const REVIEWS = [
  {
    id: 1,
    initials: 'MI',
    name: 'Mihir',
    event: 'Summer Music Festival',
    rating: 5,
    time: '4 week ago',
    text: 'Good Music',
    status: 'Approved',
    statusColor: 'green'
  },
]

export default function ReviewsRatings() {
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [newReview, setNewReview] = useState({
    event: '',
    rating: 5,
    text: '',
    user: 'Admin'
  })

  const handleWriteReview = () => {
    setShowWriteModal(true)
  }

  const handleCloseModal = () => {
    setShowWriteModal(false)
    setNewReview({ event: '', rating: 5, text: '', user: 'Admin' })
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    // TODO: Add API call to submit review
    console.log('Submitting review:', newReview)
    alert('Review submitted successfully!')
    handleCloseModal()
  }

  const handleRatingClick = (rating) => {
    setNewReview({ ...newReview, rating })
  }

  const handleEdit = (id) => {
    console.log('Edit review', id)
  }

  const handleReport = (id) => {
    console.log('Report review', id)
  }

  const handleDelete = (id) => {
    console.log('Delete review', id)
  }

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
            <h2 className="admin-section-title">Reviews & Ratings</h2>
            <p className="admin-section-subtitle">Monitor and moderate user reviews across all events.</p>
          </div>
          <button className="rr-btn-write" onClick={handleWriteReview}>
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
            <div key={review.id} className="rr-shell-card">
              <div className="rr-card">
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
                    <div className="rr-status-select">
                      <span className={`rr-status rr-text-${review.statusColor}`}>
                        {review.status}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  <div className="rr-review-text">
                    {review.text}
                  </div>

                  <div className="rr-action-row">
                    <button className="rr-btn-secondary" onClick={() => handleEdit(review.id)}>Edit</button>
                    <button className="rr-btn-danger-light" onClick={() => handleReport(review.id)}>Report</button>
                    <button className="rr-btn-danger-light" onClick={() => handleDelete(review.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {showWriteModal && (
        <div className="rr-modal-overlay" onClick={handleCloseModal}>
          <div className="rr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rr-modal-header">
              <h3>Write a Review</h3>
              <button className="rr-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmitReview} className="rr-modal-form">
              <div className="rr-form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  value={newReview.event}
                  onChange={(e) => setNewReview({ ...newReview, event: e.target.value })}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="rr-form-group">
                <label>Rating</label>
                <div className="rr-rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="rr-star-btn"
                      onClick={() => handleRatingClick(star)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={star <= newReview.rating ? "#facc15" : "none"} stroke={star <= newReview.rating ? "#facc15" : "#cbd5e1"} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rr-form-group">
                <label>Review</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  placeholder="Write your review..."
                  rows={4}
                  required
                />
              </div>
              <div className="rr-modal-actions">
                <button type="button" className="rr-btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="rr-btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
