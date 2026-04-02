import { useState } from 'react'
import './css/Reviews.css'

const INITIAL_REVIEWS = [
  {
    id: 1,
    title: 'Tech Summit 2026',
    date: 'Feb 15, 2026',
    rating: 5,
    text: 'Amazing event! The speakers were incredibly knowledgeable and the networking opportunities were outstanding. I learned so much about emerging technologies and made valuable connections. The venue was well-organized and the sessions were perfectly timed.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'
  },
  {
    id: 2,
    title: 'Music Festival Summer',
    date: 'Feb 10, 2026',
    rating: 4,
    text: 'Great lineup and fantastic atmosphere! The sound quality was excellent and the crowd was amazing. Only minor issue was the long wait times for food and drinks. Would definitely attend again next year. The headlining acts were worth every penny.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80'
  },
  {
    id: 3,
    title: 'Contemporary Art Expo',
    date: 'Feb 8, 2026',
    rating: 5,
    text: 'Absolutely stunning collection! The curators did an exceptional job showcasing diverse artists. The interactive installations were my favorite part. Staff was friendly and knowledgeable. A must-visit for any art enthusiast.',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&q=80'
  }
]

const PENDING_REVIEWS = [
  {
    id: 101,
    title: 'Food & Wine Festival',
    date: 'Attended on Feb 12, 2026',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80'
  },
  {
    id: 102,
    title: 'Startup Pitch Night',
    date: 'Attended on Feb 9, 2026',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80'
  }
]

const StarRating = ({ rating }) => {
  return (
    <div className="rev-stars">
      {[...Array(5)].map((_, index) => (
        <svg 
          key={index}
          width="16" height="16" 
          viewBox="0 0 24 24" 
          fill={index < rating ? "#facc15" : "none"} 
          stroke={index < rating ? "#facc15" : "#cbd5e1"} 
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)

  const handleDelete = (id) => {
    setReviews(reviews.filter(r => r.id !== id))
  }

  return (
    <div className="rev-layout">
      {/* Header */}
      <div className="rev-header">
        <h1 className="rev-page-title">My Reviews</h1>
        <p className="rev-page-subtitle">Your feedback helps others discover great events</p>
      </div>

      <div className="rev-content">
        {/* Main List */}
        <div className="rev-list">
          {reviews.map(review => (
            <div key={review.id} className="rev-card">
              <div className="rev-img-wrap">
                <img src={review.image} alt={review.title} />
              </div>
              <div className="rev-info">
                <div className="rev-card-header">
                  <h3 className="rev-card-title">{review.title}</h3>
                  <div className="rev-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {review.date}
                  </div>
                </div>
                
                <StarRating rating={review.rating} />
                
                <p className="rev-text">{review.text}</p>
                
                <div className="rev-actions">
                  <button className="rev-btn-edit">Edit Review</button>
                  <button className="rev-btn-delete" onClick={() => handleDelete(review.id)}>Delete Review</button>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="rev-empty">
              You haven't written any reviews yet.
            </div>
          )}
        </div>

        {/* Pending Reviews Section */}
        {PENDING_REVIEWS.length > 0 && (
          <div className="rev-pending-section">
            <h2 className="rev-section-title">Events Waiting for Your Review</h2>
            <div className="rev-pending-list">
              {PENDING_REVIEWS.map(event => (
                <div key={event.id} className="rev-pending-card">
                  <div className="rev-pending-img">
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className="rev-pending-info">
                    <h4 className="rev-pending-title">{event.title}</h4>
                    <p className="rev-pending-date">{event.date}</p>
                  </div>
                  <button className="rev-btn-primary">Review</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
