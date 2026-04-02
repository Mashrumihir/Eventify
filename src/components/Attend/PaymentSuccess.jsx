import './css/PaymentSuccess.css'

export default function PaymentSuccess({ onNavigate }) {
  return (
    <div className="ps-layout">
      <div className="ps-card">
        {/* Success Header */}
        <div className="ps-header">
          <div className="ps-check-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="ps-title">Payment Successful!</h1>
          <p className="ps-subtitle">Your booking has been confirmed</p>
          <p className="ps-booking-id">
            Booking ID: <a href="#">EVT-2026-00124</a>
          </p>
        </div>

        {/* Event Summary Box */}
        <div className="ps-event-box">
          <div className="ps-event-img-wrap">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" 
              alt="Tech Summit" 
              className="ps-event-img" 
            />
          </div>
          <div className="ps-event-info">
            <h2 className="ps-event-title">Tech Summit 2026</h2>
            <div className="ps-meta-grid">
              <div className="ps-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                February 28, 2026
              </div>
              <div className="ps-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                10:00 AM - 6:00 PM
              </div>
              <div className="ps-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                R.K University, Rajkot
              </div>
              <div className="ps-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>
                Regular Ticket
              </div>
              <div className="ps-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Quantity: 2
              </div>
            </div>
          </div>
        </div>

        {/* Total Box */}
        <div className="ps-total-box">
          <span className="ps-total-label">Total Paid</span>
          <span className="ps-total-val">₹178.20</span>
        </div>

        {/* Action Buttons */}
        <div className="ps-actions">
          <button className="ps-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Ticket
          </button>
          <button className="ps-btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share Ticket
          </button>
        </div>

        {/* Navigation Links */}
        <div className="ps-nav-links">
          <button onClick={() => onNavigate('bookings')}>View My Bookings</button>
          <span className="ps-nav-sep">|</span>
          <button onClick={() => onNavigate('browse')}>Browse More Events</button>
          <span className="ps-nav-sep">|</span>
          <button onClick={() => onNavigate('dashboard')}>Go to Dashboard</button>
        </div>

        {/* Email Notice */}
        <div className="ps-email-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <p>A confirmation email with your ticket has been sent to your registered email address.</p>
        </div>

      </div>
    </div>
  )
}
