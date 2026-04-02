import { useState } from 'react'
import './css/Wishlist.css'

const INITIAL_WISHLIST = [
  {
    id: 1,
    title: 'Digital Marketing Summit 2024',
    category: 'Business',
    date: 'March 15, 2024',
    location: 'Hemu Gadvi Hall, Rajkot',
    rating: '4.8',
    reviewsCount: '120',
    price: '₹49',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
  },
  {
    id: 2,
    title: 'Gourmet Food Festival',
    category: 'Food',
    date: 'April 2, 2024',
    location: 'Reshkosh, Rajkot',
    rating: '4.9',
    reviewsCount: '85',
    price: '₹75',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
  },
  {
    id: 3,
    title: 'Contemporary Art Exhibition',
    category: 'Arts',
    date: 'May 10, 2024',
    location: 'Mahatma Gandhi Museum, Rajkot',
    rating: '4.7',
    reviewsCount: '95',
    price: '₹99',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80'
  }
]

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST)

  const handleRemove = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  return (
    <div className="wl-layout">
      {/* Header */}
      <div className="wl-header">
        <div className="wl-header-left">
          <h1 className="wl-page-title">My Wishlist</h1>
          <p className="wl-page-subtitle">Events you want to attend</p>
        </div>
        <div className="wl-saved-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {wishlist.length} {wishlist.length === 1 ? 'Event' : 'Events'} Saved
        </div>
      </div>

      {/* Grid */}
      {wishlist.length > 0 ? (
        <div className="wl-grid">
          {wishlist.map(event => (
            <div key={event.id} className="wl-card">
              <div className="wl-card-img" style={{ backgroundImage: `url(${event.image})` }}>
                <span className="wl-category">{event.category}</span>
                <button className="wl-heart-active" onClick={() => handleRemove(event.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div className="wl-card-content">
                <h3 className="wl-card-title">{event.title}</h3>
                
                <div className="wl-card-details">
                  <div className="wl-detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {event.date}
                  </div>
                  <div className="wl-detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {event.location}
                  </div>
                  <div className="wl-detail-item wl-rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {event.rating} <span className="wl-rating-count">({event.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="wl-card-footer">
                  <span className="wl-price">{event.price}</span>
                  <div className="wl-footer-actions">
                    <button className="wl-trash-btn" onClick={() => handleRemove(event.id)} title="Remove from Wishlist">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                    <button className="wl-book-btn">Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="wl-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p>Your wishlist is empty. Browse events to add some!</p>
        </div>
      )}
    </div>
  )
}
