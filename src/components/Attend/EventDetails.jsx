import { useState } from 'react'
import './css/EventDetails.css'

export default function EventDetails({ onNavigate }) {
  const [selectedTicket, setSelectedTicket] = useState('regular')
  const [quantity, setQuantity] = useState(1)

  const ticketPrices = {
    earlyBird: 79,
    regular: 99,
    vip: 199,
  }

  const total = ticketPrices[selectedTicket] * quantity

  return (
    <div className="event-details-layout">
      <div className="event-main-col">
        <div
          className="ed-hero"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80')",
          }}
        >
          <div className="ed-hero-top-actions">
            <button className="ed-icon-btn" onClick={() => onNavigate('browse')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button className="ed-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="ed-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          <div className="ed-hero-content">
            <span className="ed-hero-tag">Technology</span>
            <h1 className="ed-hero-title">Tech Summit 2026</h1>
            <div className="ed-hero-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>4.8</span>
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>2,847 attending</span>
              </span>
            </div>
          </div>
        </div>

        <div className="ed-card">
          <h2 className="ed-card-title">Event Details</h2>
          <div className="ed-info-list">
            <div className="ed-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>March 15-17, 2026</span>
            </div>
            <div className="ed-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Marvadi University, Rajkot</span>
            </div>
            <div className="ed-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>9:00 AM - 6:00 PM PST</span>
            </div>
          </div>
          <p className="ed-description">
            Join the most anticipated technology summit of 2026. Connect with industry leaders, discover cutting-edge
            innovations, and network with thousands of tech professionals from around the world.
          </p>
        </div>
      </div>

      <div className="ed-sidebar-col">
        <div className="ed-checkout-card">
          <h2 className="ed-checkout-title">Book Tickets</h2>

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

          <div className="ed-quantity-section">
            <label>Quantity</label>
            <div className="ed-qty-controls">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                -
              </button>
              <div className="ed-qty-val">{quantity}</div>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <hr className="ed-divider" />

          <div className="ed-totals">
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
