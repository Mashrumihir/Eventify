import { useState } from 'react'
import './css/MyBookings.css'

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const BOOKINGS_DATA = [
  {
    id: 'TK2024001',
    eventId: 'tech-summit-24',
    title: 'Tech Summit 2024',
    status: 'confirmed',
    date: 'March 15, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Reshkosh, Rajkot',
    accessType: 'Regular Access',
    accessIcon: 'ticket',
    accessColor: '#10b981', // green
    purchaseStr: '1x Regular Ticket',
    price: '₹89.00',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    type: 'upcoming'
  },
  {
    id: 'MF2024007',
    eventId: 'summer-music-24',
    title: 'Summer Music Festival',
    status: 'confirmed',
    date: 'June 20, 2024',
    time: '2:00 PM - 11:00 PM',
    location: 'Reshkosh, Rajkot',
    accessType: 'VIP Access',
    accessIcon: 'star',
    accessColor: '#eab308', // yellow
    purchaseStr: '2x VIP Tickets',
    price: '₹240.00',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    type: 'upcoming'
  },
  {
    id: 'AE2024003',
    eventId: 'modern-art-24',
    title: 'Modern Art Exhibition',
    status: 'canceled',
    date: 'February 10, 2024',
    time: '10:00 AM - 8:00 PM',
    location: 'Mahatma Gandhi Museum',
    accessType: 'Standard Access',
    accessIcon: 'ticket',
    accessColor: '#10b981', // green
    purchaseStr: '1x Standard Ticket',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80',
    type: 'past' // canceled past
  },
  {
    id: 'BW2024012',
    eventId: 'business-workshop-24',
    title: 'Business Workshop',
    status: 'confirmed',
    date: 'April 5, 2024',
    time: '1:00 PM - 5:00 PM',
    location: 'Hemu Gadhvi Hall, Rajkot',
    accessType: 'Premium Access',
    accessIcon: 'crown',
    accessColor: '#a855f7', // purple
    purchaseStr: '1x Premium Ticket',
    price: '₹150.00',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80',
    type: 'upcoming'
  }
]

/* ─── Components ─────────────────────────────────────────────────────────────── */

const Icons = {
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ticket: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 9v2c1.1 0 2 .9 2 2s-.9 2-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c-1.1 0-2-.9-2-2s.9-2 2-2V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2zm16 6.5c-1.38 0-2.5 1.12-2.5 2.5h-7c0-1.38-1.12-2.5-2.5-2.5v-3c1.38 0 2.5-1.12 2.5-2.5h7c0 1.38 1.12 2.5 2.5 2.5v3z"/></svg>,
  star: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  crown: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v2H2v-2zm18-12l-4 3-6-8-6 8-4-3 2 14h16l2-14z"/></svg>
}

function BookingCard({ booking }) {
  const isCanceled = booking.status === 'canceled'

  return (
    <div className="mb-card">
      {/* Img */}
      <div className="mb-card-img-wrap">
        <img src={booking.image} alt={booking.title} />
      </div>

      {/* Main Info */}
      <div className="mb-main-info">
        <h3 className="mb-title">{booking.title}</h3>
        
        <div className={`mb-status-pill ${isCanceled ? 'canceled' : 'confirmed'}`}>
          {isCanceled ? Icons.x : Icons.check}
          {isCanceled ? 'Canceled' : 'Confirmed'}
        </div>

        <div className="mb-details-row">
          <span className="mb-icon-text">
            {Icons.calendar} {booking.date}
          </span>
          <span className="mb-icon-text">
            {Icons.pin} {booking.location}
          </span>
        </div>

        <div className="mb-price-row">
          <span className="mb-purchase-str">{booking.purchaseStr}</span>
          <span className={`mb-price-val ${booking.price === 'Free' ? 'free' : ''}`}>
            {booking.price}
          </span>
        </div>
      </div>

      {/* Secondary Info */}
      <div className="mb-sec-info">
        <span className="mb-icon-text">
          {Icons.clock} {booking.time}
        </span>
        <span className="mb-icon-text mb-access" style={{ '--icon-color': booking.accessColor }}>
          <span className="access-icon-wrap" style={{ color: booking.accessColor }}>
            {Icons[booking.accessIcon]}
          </span>
          {booking.accessType}
        </span>
      </div>

      {/* Actions */}
      <div className="mb-actions">
        <span className="mb-booking-id">Booking ID: #{booking.id}</span>
        <div className="mb-btn-group">
          {isCanceled ? (
            <button className="mb-btn-disabled" disabled>Refunded</button>
          ) : (
            <>
              <button className="mb-btn-primary">Download</button>
              <button className="mb-btn-danger">Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('all') // all, upcoming, canceled

  const filteredBookings = BOOKINGS_DATA.filter(b => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return b.type === 'upcoming' && b.status !== 'canceled'
    if (activeTab === 'canceled') return b.status === 'canceled'
    return true
  })

  return (
    <div className="mb-layout">
      {/* Header */}
      <div className="mb-header">
        <h1 className="mb-page-title">My Bookings</h1>
        <p className="mb-page-subtitle">Manage and view your event tickets</p>
      </div>

      {/* Tabs */}
      <div className="mb-tabs">
        <button 
          className={`mb-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </button>
        <button 
          className={`mb-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`mb-tab ${activeTab === 'canceled' ? 'active' : ''}`}
          onClick={() => setActiveTab('canceled')}
        >
          Canceled
        </button>
      </div>

      {/* Filtered List */}
      <div className="mb-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(b => <BookingCard key={b.id} booking={b} />)
        ) : (
          <div className="mb-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <p>No bookings found for this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
