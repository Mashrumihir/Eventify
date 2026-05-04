import { useEffect, useMemo, useState } from 'react'
import './css/BrowseEvents.css'
import { fetchEventCategories, fetchEvents, toggleWishlist } from '../../services/dataService'

function formatDateTime(value) {
  const date = new Date(value)
  return {
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
  }
}

const FALLBACK_EVENTS = [
  {
    id: 'sample-1',
    title: 'Mumbai Music Fest',
    category: 'Music',
    location: 'Mumbai, India',
    venue: 'Gateway Gardens',
    date: '2026-09-12T18:00:00Z',
    price: 799,
    ticketsSold: 120,
    capacity: 250,
    rating: 4.7,
    reviews: 58,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1518977956813-5a6bedf98286?w=1200&q=80',
  },
  {
    id: 'sample-2',
    title: 'Food & Culture Expo',
    category: 'Food & Drink',
    location: 'Ahmedabad, India',
    venue: 'Riverfront Pavilion',
    date: '2026-10-05T11:00:00Z',
    price: 499,
    ticketsSold: 85,
    capacity: 160,
    rating: 4.4,
    reviews: 32,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80',
  },
  {
    id: 'sample-3',
    title: 'Tech Startup Summit',
    category: 'Technology',
    location: 'Pune, India',
    venue: 'Innovate Campus',
    date: '2026-11-20T09:30:00Z',
    price: 999,
    ticketsSold: 210,
    capacity: 300,
    rating: 4.9,
    reviews: 102,
    wishlisted: false,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
  },
]

function EventCard({ event, onToggleWishlist, onNavigate }) {
  const soldPercent = Math.min(100, event.progressPercent || 0)
  const { date, time } = formatDateTime(event.date)

  return (
    <div className="be-card" id={`be-card-${event.id}`}>
      <div className="be-card-img-wrap">
        {event.image ? <img src={event.image} alt={event.title} className="be-card-img" /> : <div className="be-card-img" />}
        <span className="be-card-tag">{event.category}</span>
        <button
          className={`be-card-heart ${event.wishlisted ? 'wishlisted' : ''}`}
          id={`wishlist-${event.id}`}
          onClick={() => onToggleWishlist(event.id)}
          aria-label={event.wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          ❤
        </button>
      </div>

      <div className="be-card-body">
        <h3 className="be-card-title">{event.title}</h3>

        <div className="be-card-meta">
          <span className="be-meta-row">{date} • {time}</span>
          <span className="be-meta-row">{event.location}</span>
          <span className="be-meta-row">
            {event.rating.toFixed(1)} ({event.reviews} reviews)
          </span>
        </div>

        <div className="be-sales">
          <div className="be-sales-text">Tickets Sold: {event.ticketsSold} / {event.capacity}</div>
          <div className="be-sales-track">
            <div className="be-sales-fill" style={{ width: `${soldPercent}%` }} />
          </div>
        </div>

        <div className="be-card-footer">
          <span className={`be-price ${event.price === 0 ? 'be-price--free' : ''}`}>
            {event.price === 0 ? 'Free' : `\u20B9${Number(event.price).toLocaleString('en-IN')}`}
          </span>
          <button className="be-view-btn" id={`view-${event.id}`} onClick={() => onNavigate('eventDetails', { eventData: event })}>
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BrowseEvents({ currentUser, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadBrowsePage() {
      try {
        setIsLoading(true)
        setError('')

        const [categoryResponse, eventResponse] = await Promise.all([
          fetchEventCategories(),
          fetchEvents({ userId: currentUser?.id }),
        ])

        if (!isMounted) {
          return
        }

        const loadedEvents = eventResponse.events.length ? eventResponse.events : FALLBACK_EVENTS
        const eventCategories = Array.from(new Set(loadedEvents.map((event) => event.category)))
        const categoryNames = categoryResponse.categories.length
          ? categoryResponse.categories.map((category) => category.name)
          : eventCategories

        setCategories(['All', ...Array.from(new Set([...categoryNames, ...eventCategories]))])
        setEvents(loadedEvents)
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

    loadBrowsePage()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchCat = activeCategory === 'All' || event.category === activeCategory
      const query = search.trim().toLowerCase()
      const matchSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)

      return matchCat && matchSearch
    })
  }, [activeCategory, events, search])

  const handleToggleWishlist = async (eventId) => {
    if (!currentUser?.id) {
      return
    }

    try {
      const response = await toggleWishlist(currentUser.id, eventId)
      setEvents((current) =>
        current.map((event) =>
          event.id === eventId ? { ...event, wishlisted: response.wishlisted } : event
        )
      )
    } catch (toggleError) {
      setError(toggleError.message)
    }
  }

  return (
    <div className="browse-events">
      <div className="be-header">
        <h1 className="be-title">Browse Events</h1>
        <p className="be-subtitle">Discover live event records from your database.</p>
      </div>

      {error ? <p className="me-status-message">{error}</p> : null}

      <div className="be-search-row">
        <div className="be-search-wrap">
          <input
            id="be-search-input"
            type="text"
            className="be-search-input"
            placeholder="Search events by name, location, or keyword..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="be-categories">
        {categories.map((category) => (
          <button
            key={category}
            id={`cat-${category.toLowerCase()}`}
            className={`be-cat-pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="be-empty">
          <p>Loading events...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="be-grid">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onToggleWishlist={handleToggleWishlist} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="be-empty">
          <p>No events found. Add some records to the `events` table or adjust your filters.</p>
        </div>
      )}
    </div>
  )
}
