import { useEffect, useState } from 'react'
import './css/Dashboard.css'
import { fetchAttendeeDashboard } from '../../services/dataService'

function formatDateParts(value) {
  const date = new Date(value)

  return {
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
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
  const soldPercent = Math.min(100, event.progressPercent || 0)
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
          <span className="upcoming-meta-item">{date} • {time}</span>
          <span className="upcoming-meta-item">{event.location}</span>
        </div>
        <div className="upcoming-rating">
          <span className="upcoming-rating-score">{event.rating.toFixed(1)}</span>
          <span className="upcoming-rating-reviews">({event.reviews} reviews)</span>
        </div>
        <div className="upcoming-sales">
          <div className="upcoming-sales-text">Tickets Sold: {event.ticketsSold} / {event.capacity}</div>
          <div className="upcoming-sales-track">
            <div className="upcoming-sales-fill" style={{ width: `${soldPercent}%` }} />
          </div>
        </div>
        <div className="upcoming-footer">
          <div className="upcoming-price">{formatPrice(event.price)}</div>
          <button className="upcoming-view-btn">{actionLabel}</button>
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
      icon: <span>B</span>,
    },
    {
      id: 'upcoming-events',
      value: data.stats.upcomingEvents,
      label: 'Upcoming Events',
      color: 'green',
      icon: <span>U</span>,
    },
    {
      id: 'canceled',
      value: data.stats.cancelled,
      label: 'Canceled',
      color: 'red',
      icon: <span>C</span>,
    },
    {
      id: 'saved-events',
      value: data.stats.savedEvents,
      label: 'Saved Events',
      color: 'purple',
      icon: <span>S</span>,
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1 className="welcome-heading">Welcome back, {currentUser?.name || 'Guest'}!</h1>
        <p className="welcome-sub">Your attendee dashboard is now reading live data from the database.</p>
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
