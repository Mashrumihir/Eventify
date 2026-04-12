import { useState } from 'react'
import './css/Reviews.css'

const INITIAL_REVIEWS = [
  {
    id: 1,
    title: 'Startup Networking Event',
    date: 'Apr 7, 2026',
    rating: 5,
    text: 'good event',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80',
  },
  {
    id: 2,
    title: 'Tech Summit 2026',
    date: 'Apr 5, 2026',
    rating: 5,
    text: 'Amazing event! Great speakers and strong networking opportunities.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  },
  {
    id: 3,
    title: 'Summer Music Festival 2024',
    date: 'Apr 4, 2026',
    rating: 5,
    text: 'Great lineup and atmosphere. Would attend again.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  },
  {
    id: 4,
    title: 'Modern Art Exhibition',
    date: 'Apr 3, 2026',
    rating: 5,
    text: 'Excellent experience and very well organized.',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80',
  },
]

const PENDING_REVIEWS = [
  {
    id: 101,
    title: 'Championship Basketball',
    date: 'Attended on Apr 6, 2026',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
  },
]

function StarRating({ rating }) {
  return (
    <div className="rev-stars" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={index < rating ? '#facc15' : 'none'}
          stroke={index < rating ? '#facc15' : '#cbd5e1'}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function ReviewModal({ draft, onChange, onClose, onSubmit, isEditing }) {
  return (
    <div className="rev-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="rev-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rev-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="rev-modal-header">
          <h2 id="rev-modal-title" className="rev-modal-title">
            {isEditing ? 'Edit Review' : 'Write Review'}
          </h2>
          <p className="rev-modal-event">{draft.title}</p>
        </div>

        <form className="rev-form" onSubmit={onSubmit}>
          <label className="rev-field">
            <span>Rating (1-5)</span>
            <input
              min="1"
              max="5"
              name="rating"
              type="number"
              value={draft.rating}
              onChange={onChange}
              required
            />
          </label>

          <label className="rev-field">
            <span>Comment</span>
            <textarea
              name="text"
              rows="6"
              value={draft.text}
              onChange={onChange}
              required
            />
          </label>

          <div className="rev-modal-actions">
            <button className="rev-btn-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="rev-btn-submit" type="submit">
              {isEditing ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReviewCard({ review, onDelete, onEdit }) {
  return (
    <article className="rev-card">
      <div className="rev-img-wrap">
        <img src={review.image} alt={review.title} />
      </div>

      <div className="rev-info">
        <div className="rev-card-top">
          <div>
            <h3 className="rev-card-title">{review.title}</h3>
            <StarRating rating={review.rating} />
          </div>

          <div className="rev-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{review.date}</span>
          </div>
        </div>

        <p className="rev-text">{review.text}</p>

        <div className="rev-actions">
          <button className="rev-btn-edit" onClick={() => onEdit(review)} type="button">Edit Review</button>
          <button className="rev-btn-delete" onClick={() => onDelete(review.id)} type="button">Delete Review</button>
        </div>
      </div>
    </article>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [reviewDraft, setReviewDraft] = useState(null)

  const handleDelete = (id) => {
    setReviews((current) => current.filter((review) => review.id !== id))
  }

  const openEditModal = (review) => {
    setReviewDraft({
      id: review.id,
      title: review.title,
      image: review.image,
      date: review.date,
      rating: review.rating,
      text: review.text,
      mode: 'edit',
    })
  }

  const openCreateModal = (event) => {
    setReviewDraft({
      id: event.id,
      title: event.title,
      image: event.image,
      date: 'Apr 12, 2026',
      rating: 5,
      text: '',
      mode: 'create',
    })
  }

  const closeModal = () => {
    setReviewDraft(null)
  }

  const handleDraftChange = (event) => {
    const { name, value } = event.target

    setReviewDraft((current) => ({
      ...current,
      [name]: name === 'rating' ? Math.min(5, Math.max(1, Number(value) || 1)) : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!reviewDraft) {
      return
    }

    if (reviewDraft.mode === 'edit') {
      setReviews((current) => current.map((review) => (
        review.id === reviewDraft.id
          ? {
              ...review,
              rating: reviewDraft.rating,
              text: reviewDraft.text.trim(),
            }
          : review
      )))
    } else {
      setReviews((current) => [
        {
          id: Date.now(),
          title: reviewDraft.title,
          date: reviewDraft.date,
          rating: reviewDraft.rating,
          text: reviewDraft.text.trim(),
          image: reviewDraft.image,
        },
        ...current,
      ])
    }

    closeModal()
  }

  return (
    <div className="rev-layout">
      <header className="rev-header">
        <h1 className="rev-page-title">My Reviews</h1>
        <p className="rev-page-subtitle">Your feedback helps others discover great events</p>
      </header>

      <section className="rev-list">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onDelete={handleDelete} onEdit={openEditModal} />
        ))}

        {reviews.length === 0 ? (
          <div className="rev-empty">You haven&apos;t written any reviews yet.</div>
        ) : null}
      </section>

      <section className="rev-pending-section">
        <h2 className="rev-section-title">Events Waiting for Your Review</h2>

        <div className="rev-pending-list">
          {PENDING_REVIEWS.map((event) => (
            <article key={event.id} className="rev-pending-card">
              <div className="rev-pending-img">
                <img src={event.image} alt={event.title} />
              </div>

              <div className="rev-pending-info">
                <h3 className="rev-pending-title">{event.title}</h3>
                <p className="rev-pending-date">{event.date}</p>
              </div>

              <button className="rev-btn-primary" onClick={() => openCreateModal(event)} type="button">Review</button>
            </article>
          ))}
        </div>
      </section>

      {reviewDraft ? (
        <ReviewModal
          draft={reviewDraft}
          onChange={handleDraftChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isEditing={reviewDraft.mode === 'edit'}
        />
      ) : null}
    </div>
  )
}
