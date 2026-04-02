import { useState } from 'react'
import './css/EventDetails.css'

export default function EventDetails({ onNavigate }) {
  const [selectedTicket, setSelectedTicket] = useState('regular')
  const [quantity, setQuantity] = useState(1)

  const ticketPrices = {
    earlyBird: 79,
    regular: 99,
    vip: 199
  }

  const basePrice = ticketPrices[selectedTicket]
  const subtotal = basePrice * quantity
  const serviceFee = subtotal * 0.05 // 5% fee
  const total = subtotal + serviceFee

  return (
    <div className="event-details-layout">
      {/* ── Left Column ── */}
      <div className="event-main-col">
        {/* Hero Section */}
        <div className="ed-hero" style={{ 
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80')` 
        }}>
          <div className="ed-hero-top-actions">
            <button className="ed-icon-btn" onClick={() => onNavigate('browse')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <button className="ed-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button className="ed-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
          
          <div className="ed-hero-content">
            <span className="ed-hero-tag">Technology</span>
            <h1 className="ed-hero-title">Tech Summit 2026</h1>
            <div className="ed-hero-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>4.8</span>
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>2,847 attending</span>
              </span>
            </div>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="ed-card">
          <h2 className="ed-card-title">Event Details</h2>
          <div className="ed-info-list">
            <div className="ed-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>March 15-17, 2026</span>
            </div>
            <div className="ed-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Marvadi University, Rajkot</span>
            </div>
            <div className="ed-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>9:00 AM - 6:00 PM PST</span>
            </div>
          </div>
          <p className="ed-description">
            Join the most anticipated technology summit of 2026. Connect with industry leaders, discover cutting-edge innovations, and network with thousands of tech professionals from around the world.
          </p>
        </div>

        {/* Organizer Card */}
        <div className="ed-card ed-organizer">
          <div className="ed-org-left">
            <div className="ed-org-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <div className="ed-org-info">
              <h3 className="ed-org-name">TechCorp Events</h3>
              <div className="ed-org-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>4.9 (2.3k reviews)</span>
              </div>
            </div>
          </div>
          <button className="ed-btn-outline">Follow</button>
        </div>

        {/* Featured Speakers */}
        <div className="ed-card">
          <h2 className="ed-card-title">Featured Speakers</h2>
          <div className="ed-speakers-grid">
            <div className="ed-speaker">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" alt="Alex Chen" className="ed-speaker-img" />
              <h4 className="ed-speaker-name">Alex Chen</h4>
              <p className="ed-speaker-title">CTO, TechVision</p>
            </div>
            <div className="ed-speaker">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="Sarah Johnson" className="ed-speaker-img" />
              <h4 className="ed-speaker-name">Sarah Johnson</h4>
              <p className="ed-speaker-title">AI Researcher</p>
            </div>
            <div className="ed-speaker">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" alt="Michael Roberts" className="ed-speaker-img" />
              <h4 className="ed-speaker-name">Michael Roberts</h4>
              <p className="ed-speaker-title">Startup Founder</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="ed-card">
          <h2 className="ed-card-title">Reviews</h2>
          <div className="ed-reviews-list">
            <div className="ed-review">
              <div className="ed-review-header">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" alt="User" className="ed-reviewer-img" />
                <div className="ed-reviewer-info">
                  <h4 className="ed-reviewer-name">User</h4>
                  <div className="ed-review-stars">
                    {[1,2,3,4,5].map(i => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                  </div>
                </div>
                <span className="ed-review-time">2 days ago</span>
              </div>
              <p className="ed-review-text">Amazing event with great speakers and networking opportunities!</p>
            </div>
            <div className="ed-review">
              <div className="ed-review-header">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop" alt="User" className="ed-reviewer-img" />
                <div className="ed-reviewer-info">
                  <h4 className="ed-reviewer-name">User</h4>
                  <div className="ed-review-stars">
                    {[1,2,3,4].map(i => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                </div>
                <span className="ed-review-time">1 week ago</span>
              </div>
              <p className="ed-review-text">Well organized and informative. Definitely worth attending.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Column (Sticky Checkout) ── */}
      <div className="ed-sidebar-col">
        <div className="ed-checkout-card">
          <h2 className="ed-checkout-title">Book Tickets</h2>

          {/* Ticket Types */}
          <div className="ed-ticket-types">
            <div 
              className={`ed-ticket-option ${selectedTicket === 'earlyBird' ? 'active' : ''}`}
              onClick={() => setSelectedTicket('earlyBird')}
            >
              <div className="ed-ticket-top">
                <span className="ed-ticket-name">Early Bird</span>
                <span className="ed-ticket-price">₹79</span>
              </div>
              <ul className="ed-ticket-features">
                <li>Access to all sessions</li>
                <li>Welcome kit</li>
                <li>Networking lunch</li>
              </ul>
            </div>

            <div 
              className={`ed-ticket-option ${selectedTicket === 'regular' ? 'active' : ''}`}
              onClick={() => setSelectedTicket('regular')}
            >
              <div className="ed-ticket-top">
                <span className="ed-ticket-name">Regular</span>
                <span className="ed-ticket-price">₹99</span>
              </div>
              <ul className="ed-ticket-features">
                <li>Access to all sessions</li>
                <li>Welcome kit</li>
                <li>Networking lunch</li>
                <li>Certificate</li>
              </ul>
            </div>

            <div 
              className={`ed-ticket-option ${selectedTicket === 'vip' ? 'active' : ''}`}
              onClick={() => setSelectedTicket('vip')}
            >
              <div className="ed-ticket-top">
                <span className="ed-ticket-name">VIP</span>
                <span className="ed-ticket-price">₹199</span>
              </div>
              <ul className="ed-ticket-features">
                <li>All Regular benefits</li>
                <li>VIP seating</li>
                <li>Meet & greet</li>
                <li>Exclusive dinner</li>
              </ul>
            </div>
          </div>

          {/* Quantity */}
          <div className="ed-quantity-section">
            <label>Quantity</label>
            <div className="ed-qty-controls">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >-</button>
              <div className="ed-qty-val">{quantity}</div>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Coupon */}
          <div className="ed-coupon-section">
            <label>Coupon Code</label>
            <div className="ed-coupon-input-group">
              <input type="text" placeholder="Enter code" />
              <button>Apply</button>
            </div>
          </div>

          <hr className="ed-divider" />

          {/* Totals */}
          <div className="ed-totals">
            <div className="ed-total-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="ed-total-row">
              <span>Service Fee</span>
              <span>₹{serviceFee.toFixed(2)}</span>
            </div>
            <div className="ed-total-row ed-grand-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button className="ed-btn-primary ed-proceed-btn" onClick={() => onNavigate('payment')}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
