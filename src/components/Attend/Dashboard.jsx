import { useEffect, useState } from 'react'
import './css/Dashboard.css'
import { fetchAttendeeDashboard } from '../../services/dataService'

function BookingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16a2 2 0 0 1 2 2v3H2V9a2 2 0 0 1 2-2z" />
      <path d="M2 12h20v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
      <path d="M7 7V5a1 1 0 0 1 1-1h1" />
      <path d="M17 7V5a1 1 0 0 0-1-1h-1" />
      <path d="M8 15h3" />
    </svg>
  )
}

function CalendarCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  )
}

function CancelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M7 4.5A2.5 2.5 0 0 1 9.5 2h5A2.5 2.5 0 0 1 17 4.5V22l-5-3-5 3V4.5Z" />
    </svg>
  )
}

function CalendarMetaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

function formatDateParts(value) {
  const date = new Date(value)

  return {
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
  }
}

function formatPrice(value) {
  return value === 0 ? 'Free' : `\u20B9${Number(value || 0).toLocaleString('en-IN')}`
}

function StatCard({ stat }) {
  return (
    <div className={`stat-card stat-card--${stat.color}`} id={stat.id}>
      <div className={`stat-icon stat-icon--${stat.color}`}>{stat.icon}</div>
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  )
}

function EventCard({ event, actionLabel = 'View Details' }) {
  const { date, time } = formatDateParts(event.date)

  return (
    <div className="upcoming-card" id={`event-${event.id}`}>
      <div className="upcoming-img-wrap">
        {event.image ? <img src={event.image} alt={event.title} className="upcoming-img" /> : <div className="upcoming-img" />}
        <span className="upcoming-tag">{event.category}</span>
      </div>
      <div className="upcoming-info">
        <h3 className="upcoming-title">{event.title}</h3>
        <div className="upcoming-meta">
          <span className="upcoming-meta-item">
            <CalendarMetaIcon />
            <span>{date} · {time}</span>
          </span>
          <span className="upcoming-meta-item">
            <LocationIcon />
            <span>{event.location}</span>
          </span>
        </div>
        <div className="upcoming-footer">
          <div className="upcoming-price">{formatPrice(event.price)}</div>
          <button className="upcoming-view-btn" type="button">{actionLabel}</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ currentUser }) {
  const [data, setData] = useState({
    stats: {
      totalBookings: 0,
      upcomingEvents: 0,
      cancelled: 0,
      savedEvents: 0,
    },
    upcomingEvents: [],
    recommendedEvents: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      if (!currentUser?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchAttendeeDashboard(currentUser.id)

        if (isMounted) {
          setData(response)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const stats = [
    {
      id: 'total-bookings',
      value: data.stats.totalBookings,
      label: 'Total Bookings',
      color: 'blue',
      icon: <BookingIcon />,
    },
    {
      id: 'upcoming-events',
      value: data.stats.upcomingEvents,
      label: 'Upcoming Events',
      color: 'green',
      icon: <CalendarCheckIcon />,
    },
    {
      id: 'canceled',
      value: data.stats.cancelled,
      label: 'Canceled',
      color: 'red',
      icon: <CancelIcon />,
    },
    {
      id: 'saved-events',
      value: data.stats.savedEvents,
      label: 'Saved Events',
      color: 'purple',
      icon: <BookmarkIcon />,
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1 className="welcome-heading">Welcome back, {currentUser?.name || 'Guest'}!</h1>
        <p className="welcome-sub">Your attendee dashboard is reading live data from the database.</p>
      </div>

      {error ? <p className="me-status-message">{error}</p> : null}

      <div className="stats-grid">
        {stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
      </div>

      <section className="section">
        <h2 className="section-title">Upcoming Events</h2>
        {isLoading ? (
          <p className="welcome-sub">Loading your booked events...</p>
        ) : data.upcomingEvents.length ? (
          <div className="upcoming-grid">
            {data.upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <p className="welcome-sub">No upcoming bookings yet.</p>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recommended For You</h2>
        </div>
        {isLoading ? (
          <p className="welcome-sub">Loading recommendations...</p>
        ) : data.recommendedEvents.length ? (
          <div className="upcoming-grid">
            {data.recommendedEvents.map((event) => (
              <EventCard key={event.id} event={event} actionLabel="Book Now" />
            ))}
          </div>
        ) : (
          <p className="welcome-sub">No published events are available yet.</p>
        )}
      </section>
    </div>
  )
}
