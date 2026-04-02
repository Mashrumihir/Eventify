import { useState } from 'react'
import './css/BrowseEvents.css'

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Music', 'Technology', 'Arts', 'Sports', 'Food', 'Business']

const EVENTS = [
  {
    id: 'summer-music',
    title: 'Summer Music Festival 2024',
    category: 'Music',
    date: 'June 15, 2024',
    time: '6:00 PM',
    location: 'Central Mumbai, Maharashtra',
    rating: 4.8,
    reviews: 234,
    price: 45,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'tech-summit',
    title: 'Tech Innovation Summit',
    category: 'Technology',
    date: 'July 22, 2024',
    time: '9:00 AM',
    location: 'Marvadi college, Rajkot',
    rating: 4.9,
    reviews: 512,
    price: 120,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'modern-art',
    title: 'Modern Art Exhibition',
    category: 'Arts',
    date: 'June 10, 2024',
    time: '10:00 AM',
    location: 'Ahmedabad, Gujarat',
    rating: 4.7,
    reviews: 89,
    price: 0,
    wishlisted: true,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'championship-basketball',
    title: 'Championship Basketball',
    category: 'Sports',
    date: 'Aug 5, 2024',
    time: '7:30 PM',
    location: 'R.K. University, Rajkot',
    rating: 4.9,
    reviews: 678,
    price: 85,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1546519638405-a2f5e0494b39?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'food-festival',
    title: 'International Food Festival',
    category: 'Food',
    date: 'July 8, 2024',
    time: '11:00 AM',
    location: 'Reshkosh, Rajkot',
    rating: 4.6,
    reviews: 345,
    price: 30,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'startup-networking',
    title: 'Startup Networking Event',
    category: 'Business',
    date: 'June 28, 2024',
    time: '6:00 PM',
    location: 'R.K. University, Rajkot',
    rating: 4.8,
    reviews: 156,
    price: 0,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'jazz-night',
    title: 'Jazz Night Live',
    category: 'Music',
    date: 'July 12, 2024',
    time: '8:00 PM',
    location: 'Hemu Gadhvi Hall, Rajkot',
    rating: 5.0,
    reviews: 423,
    price: 55,
    wishlisted: true,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=280&fit=crop&auto=format',
  },
  {
    id: 'vr-ai',
    title: 'VR & AI Experience',
    category: 'Technology',
    date: 'Aug 18, 2024',
    time: '2:00 PM',
    location: 'Jaipur, Rajasthan',
    rating: 4.9,
    reviews: 267,
    price: 75,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&h=280&fit=crop&auto=format',
  },
]

/* ─── Event Card ─────────────────────────────────────────────────────────────── */
function EventCard({ event, onToggleWishlist, onNavigate }) {
  return (
    <div className="be-card" id={`be-card-${event.id}`}>
      <div className="be-card-img-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="be-card-img"
          onError={e => { e.target.style.background = '#e5e7eb'; e.target.style.display = 'none' }}
        />
        <span className="be-card-tag">{event.category}</span>
        <button
          className={`be-card-heart ${event.wishlisted ? 'wishlisted' : ''}`}
          id={`wishlist-${event.id}`}
          onClick={() => onToggleWishlist(event.id)}
          aria-label={event.wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={event.wishlisted ? '#ef4444' : 'none'} stroke={event.wishlisted ? '#ef4444' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="be-card-body">
        <h3 className="be-card-title">{event.title}</h3>

        <div className="be-card-meta">
          <span className="be-meta-row">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {event.date} • {event.time}
          </span>
          <span className="be-meta-row">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {event.location}
          </span>
          <span className="be-meta-row">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="be-rating-val">{event.rating}</span>
            <span className="be-reviews">({event.reviews} reviews)</span>
          </span>
        </div>

        <div className="be-card-footer">
          <span className={`be-price ${event.price === 0 ? 'be-price--free' : ''}`}>
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
          <button className="be-view-btn" id={`view-${event.id}`} onClick={() => onNavigate('eventDetails')}>
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Browse Events Page ─────────────────────────────────────────────────────── */
export default function BrowseEvents({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState(EVENTS)

  const toggleWishlist = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, wishlisted: !e.wishlisted } : e))
  }

  const filtered = events.filter(e => {
    const matchCat = activeCategory === 'All' || e.category === activeCategory
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="browse-events">
      {/* Header */}
      <div className="be-header">
        <h1 className="be-title">Browse Events</h1>
        <p className="be-subtitle">Discover amazing events happening around you</p>
      </div>

      {/* Search + Filter Row */}
      <div className="be-search-row">
        <div className="be-search-wrap">
          <svg className="be-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="be-search-input"
            type="text"
            className="be-search-input"
            placeholder="Search events by name, location, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="be-filter-btn" id="be-filter-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          Filters
        </button>
      </div>

      {/* Category Pills */}
      <div className="be-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`cat-${cat.toLowerCase()}`}
            className={`be-cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filtered.length > 0 ? (
        <div className="be-grid">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} onToggleWishlist={toggleWishlist} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="be-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No events found. Try a different search or category.</p>
        </div>
      )}
    </div>
  )
}
