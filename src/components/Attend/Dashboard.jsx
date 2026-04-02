import './css/Dashboard.css'

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const stats = [
  {
    id: 'total-bookings',
    value: 24,
    label: 'Total Bookings',
    color: 'blue',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'upcoming-events',
    value: 8,
    label: 'Upcoming Events',
    color: 'green',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <polyline points="9 16 11 18 15 14"/>
      </svg>
    ),
  },
  {
    id: 'canceled',
    value: 2,
    label: 'Canceled',
    color: 'red',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
  {
    id: 'saved-events',
    value: 12,
    label: 'Saved Events',
    color: 'purple',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
]

const upcomingEvents = [
  {
    id: 'summer-music',
    title: 'Summer Music Festival 2024',
    tag: 'Music',
    tagColor: '#6b7280',
    date: 'June 15, 2024',
    time: '6:00 PM',
    location: 'Central Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=240&fit=crop&auto=format',
  },
  {
    id: 'tech-summit',
    title: 'Tech Innovation Summit',
    tag: 'Tech',
    tagColor: '#6b7280',
    date: 'June 20, 2024',
    time: '9:00 AM',
    location: 'Jamnagar, Gujarat',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=240&fit=crop&auto=format',
  },
  {
    id: 'gourmet-food',
    title: 'Gourmet Food Festival',
    tag: 'Food',
    tagColor: '#6b7280',
    date: 'June 25, 2024',
    time: '12:00 PM',
    location: 'Rajkot, Gujarat',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=240&fit=crop&auto=format',
  },
]

const recommended = [
  {
    id: 'modern-art',
    title: 'Modern Art Exhibition',
    rating: 4.8,
    reviews: 256,
    price: 45,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=260&fit=crop&auto=format',
  },
  {
    id: 'championship-finals',
    title: 'Championship Finals',
    rating: 4.9,
    reviews: 432,
    price: 120,
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=260&fit=crop&auto=format',
  },
  {
    id: 'standup-comedy',
    title: 'Stand-Up Comedy Night',
    rating: 4.7,
    reviews: 189,
    price: 35,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=260&fit=crop&auto=format',
  },
]

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function StatCard({ stat }) {
  return (
    <div className={`stat-card stat-card--${stat.color}`} id={stat.id}>
      <div className={`stat-icon stat-icon--${stat.color}`}>
        {stat.icon}
      </div>
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  )
}

function UpcomingCard({ event }) {
  return (
    <div className="upcoming-card" id={`event-${event.id}`}>
      <div className="upcoming-img-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="upcoming-img"
          onError={e => { e.target.style.background = '#e5e7eb' }}
        />
        <span className="upcoming-tag">{event.tag}</span>
      </div>
      <div className="upcoming-info">
        <h3 className="upcoming-title">{event.title}</h3>
        <div className="upcoming-meta">
          <span className="upcoming-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {event.date} • {event.time}
          </span>
          <span className="upcoming-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {event.location}
          </span>
        </div>
      </div>
    </div>
  )
}

function RecommendedCard({ item }) {
  return (
    <div className="rec-card" id={`rec-${item.id}`}>
      <div className="rec-img-wrap">
        <img
          src={item.image}
          alt={item.title}
          className="rec-img"
          onError={e => { e.target.style.background = '#e5e7eb' }}
        />
      </div>
      <div className="rec-info">
        <h3 className="rec-title">{item.title}</h3>
        <div className="rec-meta">
          <span className="rec-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="rec-rating-value">{item.rating}</span>
            <span className="rec-reviews">({item.reviews})</span>
          </span>
          <span className="rec-price">₹{item.price}</span>
        </div>
        <button className="rec-book-btn" id={`book-${item.id}`}>
          Book Now
        </button>
      </div>
    </div>
  )
}

/* ─── Dashboard Page ─────────────────────────────────────────────────────────── */
export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="dashboard-welcome">
        <h1 className="welcome-heading">Welcome back, Mihir!</h1>
        <p className="welcome-sub">Here's what's happening with your events today</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => <StatCard key={s.id} stat={s} />)}
      </div>

      {/* Upcoming Events */}
      <section className="section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="upcoming-grid">
          {upcomingEvents.map(e => <UpcomingCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* Recommended */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recommended For You</h2>
          <button className="browse-all-btn" id="browse-all-events">Browse All Events</button>
        </div>
        <div className="rec-grid">
          {recommended.map(r => <RecommendedCard key={r.id} item={r} />)}
        </div>
      </section>
    </div>
  )
}
