import { useEffect, useMemo, useState } from 'react'
import './css/ManageEvents.css'
import { deleteEvent, fetchEvents } from '../../services/dataService'

function formatDateTime(value) {
  const date = new Date(value)
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getStatusLabel(status, date) {
  if (status === 'cancelled') {
    return 'Cancelled'
  }

  if (status === 'draft') {
    return 'Draft'
  }

  return new Date(date) > new Date() ? 'Upcoming' : 'Completed'
}

export default function ManageEvents({ currentUser, onEditEvent }) {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      if (!currentUser?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchEvents({ organizerId: currentUser.id })

        if (isMounted) {
          setEvents(response.events)
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

    loadEvents()
    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null

  const handleDeleteEvent = async (eventToDelete) => {
    try {
      await deleteEvent(eventToDelete.id)
      setEvents((current) => current.filter((event) => event.id !== eventToDelete.id))
      setSelectedEventId((current) => (current === eventToDelete.id ? null : current))
      setActionMessage(`"${eventToDelete.title}" deleted successfully.`)
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return events
    }

    return events.filter((event) => (
      event.title.toLowerCase().includes(normalizedQuery)
      || event.location.toLowerCase().includes(normalizedQuery)
      || event.category.toLowerCase().includes(normalizedQuery)
    ))
  }, [events, query])

  if (selectedEvent) {
    return (
      <div className="org-page-layout">
        <article className="me-detail-card">
          <div className="me-card-top me-detail-top">
            <div className="me-card-header">
              <h2>{selectedEvent.title}</h2>
              <span className="me-badge">{getStatusLabel(selectedEvent.status, selectedEvent.date)}</span>
            </div>
            <div className="me-date me-detail-date">{formatDateTime(selectedEvent.date)}</div>
          </div>

          <div className="me-detail-body">
            <div className="me-detail-grid">
              <div className="me-detail-item">
                <span className="me-lbl">Location</span>
                <span className="me-detail-hero">{selectedEvent.location}</span>
              </div>
              <div className="me-detail-item">
                <span className="me-lbl">Category</span>
                <span className="me-detail-hero">{selectedEvent.category}</span>
              </div>
              <div className="me-detail-item">
                <span className="me-lbl">Revenue</span>
                <span className="me-detail-value text-green">\u20B9{Number(selectedEvent.revenue).toLocaleString('en-IN')}</span>
              </div>
              <div className="me-detail-item">
                <span className="me-lbl">Tickets Sold</span>
                <span className="me-detail-value">{selectedEvent.ticketsSold} / {selectedEvent.capacity}</span>
              </div>
            </div>

            <div className="me-progress-bg me-detail-progress">
              <div className="me-progress-fill" style={{ width: `${selectedEvent.progressPercent}%` }} />
            </div>

            <p className="me-detail-description">{selectedEvent.description || 'No description added yet.'}</p>

            <div className="me-detail-actions">
              <button className="me-btn me-btn-back" onClick={() => setSelectedEventId(null)} type="button">
                Back
              </button>
              <button className="me-btn me-btn-primary" onClick={() => onEditEvent?.(selectedEvent)} type="button">
                Edit Event
              </button>
              <button className="me-btn-icon me-btn-delete" onClick={() => handleDeleteEvent(selectedEvent)} type="button" aria-label={`Delete ${selectedEvent.title}`}>
                Delete
              </button>
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="org-page-layout">
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Manage Events</h1>
          <p className="org-page-subtitle">All organizer events are now coming from the database.</p>
        </div>
      </div>

      <div className="me-search-bar">
        <input
          type="text"
          placeholder="Search events by title, location, or category..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {actionMessage ? <p className="me-status-message">{actionMessage}</p> : null}
      {error ? <p className="me-status-message">{error}</p> : null}

      {isLoading ? (
        <div className="me-empty-state">
          <h3>Loading events...</h3>
        </div>
      ) : (
        <div className="me-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="me-card">
              <div className="me-card-top">
                <div className="me-card-header">
                  <h3>{event.title}</h3>
                  <span className="me-badge">{getStatusLabel(event.status, event.date)}</span>
                </div>
                <div className="me-date">{formatDateTime(event.date)}</div>
              </div>

              <div className="me-card-content">
                <div className="me-info-grid">
                  <div className="me-info-item">
                    <span className="me-lbl">Location</span>
                    <span className="me-val">{event.location}</span>
                  </div>
                  <div className="me-info-item">
                    <span className="me-lbl">Category</span>
                    <span className="me-val">{event.category}</span>
                  </div>
                  <div className="me-info-item">
                    <span className="me-lbl">Revenue</span>
                    <span className="me-val text-green">\u20B9{Number(event.revenue).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="me-info-item">
                    <span className="me-lbl">Tickets Sold</span>
                    <span className="me-val">{event.ticketsSold} / {event.capacity}</span>
                  </div>
                </div>

                <div className="me-progress-bg">
                  <div className="me-progress-fill" style={{ width: `${event.progressPercent}%` }} />
                </div>

                <div className="me-actions">
                  <button className="me-btn me-btn-view" onClick={() => setSelectedEventId(event.id)} type="button">
                    View
                  </button>
                  <button className="me-btn me-btn-edit" onClick={() => onEditEvent?.(event)} type="button">
                    Edit
                  </button>
                  <button className="me-btn-icon me-btn-delete" onClick={() => handleDeleteEvent(event)} type="button" aria-label={`Delete ${event.title}`}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !filteredEvents.length ? (
        <div className="me-empty-state">
          <h3>No events found</h3>
          <p>Create your first event from the organizer panel to populate this page.</p>
        </div>
      ) : null}
    </div>
  )
}
