import { useEffect, useState } from 'react'
import './css/MyBookings.css'
import { createInvoiceFromBooking, setActiveInvoiceFromBooking } from './js/invoiceData'
import { buildInvoicePrintMarkup } from './js/invoicePrintTemplate'
import { cancelAttendeeBooking, fetchAttendeeBookings } from '../../services/dataService'

const Icons = {
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  x: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  calendar: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2.5" x2="16" y2="6" /><line x1="8" y1="2.5" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /></svg>,
  pin: <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" fill="#ffffff" stroke="none" /></svg>,
  clock: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>,
  ticket: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8.5V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5a2.5 2.5 0 0 0 0 5V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a2.5 2.5 0 0 0 0-5z" /><path d="M9 9.5h.01" /><path d="M9 13.5h.01" /><path d="M15 9.5h.01" /><path d="M15 13.5h.01" /></svg>,
  star: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
}

function openTaxInvoicePrintView(booking) {
  const invoiceWindow = window.open('', '_blank', 'width=1100,height=900')

  if (!invoiceWindow) {
    return false
  }

  const invoiceMarkup = buildInvoicePrintMarkup(createInvoiceFromBooking(booking))

  invoiceWindow.document.open()
  invoiceWindow.document.write(invoiceMarkup)
  invoiceWindow.document.close()
  return true
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTimeRange(startAt, endAt) {
  const start = new Date(startAt).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const end = endAt
    ? new Date(endAt).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    })
    : null

  return end ? `${start} - ${end}` : start
}

function formatPrice(amount) {
  return Number(amount || 0) === 0 ? 'Free' : `\u20B9${Number(amount).toFixed(2)}`
}

function normalizeBooking(rawBooking) {
  const status = rawBooking.status === 'cancelled' ? 'canceled' : rawBooking.status
  const isCanceled = status === 'canceled' || status === 'refunded'
  const isUpcoming = new Date(rawBooking.date) >= new Date()
  const isVip = /vip/i.test(rawBooking.ticketType || '')

  return {
    bookingId: rawBooking.bookingId,
    id: rawBooking.id,
    title: rawBooking.title,
    status,
    date: formatDate(rawBooking.date),
    time: formatTimeRange(rawBooking.date, rawBooking.endDate),
    location: rawBooking.location || 'Online',
    accessType: rawBooking.accessType || 'Regular Access',
    accessIcon: isVip ? 'star' : 'ticket',
    accessColor: isVip ? '#eab308' : '#22c55e',
    purchaseStr: `${rawBooking.purchaseQuantity || 1} x ${rawBooking.ticketType || 'Regular'}`,
    price: formatPrice(rawBooking.totalAmount),
    image: rawBooking.image || '',
    type: isCanceled ? 'canceled' : isUpcoming ? 'upcoming' : 'past',
  }
}

function BookingCard({ booking, isSelected, onShow, onDownload, onCancel }) {
  const isCanceled = booking.status === 'canceled'

  return (
    <article className={`mb-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="mb-card-main">
        <div className="mb-card-img-wrap">
          <img src={booking.image} alt={booking.title} />
        </div>

        <div className="mb-main-info">
          <h3 className="mb-title">{booking.title}</h3>

          <div className={`mb-status-pill ${isCanceled ? 'canceled' : 'confirmed'}`}>
            {isCanceled ? Icons.x : Icons.check}
            {isCanceled ? 'Canceled' : 'Confirmed'}
          </div>

          <div className="mb-details-row">
            <span className="mb-icon-text">
              {Icons.calendar}
              {booking.date}
            </span>
            <span className="mb-icon-text">
              {Icons.pin}
              {booking.location}
            </span>
          </div>

          <div className="mb-price-row">
            <span className="mb-purchase-str">{booking.purchaseStr}</span>
            <span className={`mb-price-val ${booking.price === 'Free' ? 'free' : ''}`}>
              {booking.price}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-sec-info">
        <span className="mb-icon-text mb-time-line">
          {Icons.clock}
          {booking.time}
        </span>
        <span className="mb-icon-text mb-access" style={{ color: booking.accessColor }}>
          <span className="access-icon-wrap">{Icons[booking.accessIcon]}</span>
          {booking.accessType}
        </span>
      </div>

      <div className="mb-actions">
        <span className="mb-booking-id">Booking ID: {booking.id}</span>
        <div className="mb-btn-stack">
          <button className="mb-btn-outline" onClick={() => onShow(booking)} type="button">Show</button>
          {!isCanceled ? (
            <>
              <button className="mb-btn-primary" onClick={() => onDownload(booking)} type="button">Download</button>
              <button className="mb-btn-danger" onClick={onCancel} type="button">Cancel</button>
            </>
          ) : (
            <button className="mb-btn-disabled" disabled type="button">Refunded</button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function MyBookings({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('all')
  const [bookings, setBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadBookings() {
      if (!currentUser?.id) {
        if (isMounted) {
          setBookings([])
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchAttendeeBookings(currentUser.id)
        const mappedBookings = (response.bookings || []).map(normalizeBooking)

        if (isMounted) {
          setBookings(mappedBookings)
          setSelectedBookingId(mappedBookings[0]?.id || '')
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load bookings.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBookings()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const handleShowBooking = (booking) => {
    setActiveInvoiceFromBooking(booking, currentUser)
    setSelectedBookingId(booking.id)
    setActionMessage(`Showing ticket for ${booking.title}.`)
    onNavigate?.('taxInvoice')
  }

  const handleDownloadBooking = (booking) => {
    setActiveInvoiceFromBooking(booking, currentUser)
    const opened = openTaxInvoicePrintView(booking)

    if (!opened) {
      setActionMessage('Allow pop-ups to download the tax invoice.')
      return
    }

    setActionMessage(`Tax invoice opened for ${booking.title}. Choose "Save as PDF" to download.`)
  }

  const handleCancelBooking = async (booking) => {
    if (!currentUser?.id) {
      setActionMessage('Please login again to cancel this booking.')
      return
    }

    try {
      await cancelAttendeeBooking(booking.bookingId, currentUser.id)
      setBookings((currentBookings) =>
        currentBookings.map((currentBooking) =>
          currentBooking.bookingId === booking.bookingId
            ? { ...currentBooking, status: 'canceled', type: 'canceled' }
            : currentBooking
        )
      )
      setSelectedBookingId(booking.id)
      setActionMessage('Booking canceled and moved to canceled bookings.')
    } catch (cancelError) {
      setActionMessage(cancelError.message || 'Unable to cancel booking right now.')
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return booking.type === 'upcoming' && booking.status !== 'canceled'
    if (activeTab === 'canceled') return booking.status === 'canceled'
    return true
  })

  return (
    <div className="mb-layout">
      <div className="mb-header">
        <h1 className="mb-page-title">My Bookings</h1>
        <p className="mb-page-subtitle">Manage and view your event tickets</p>
      </div>

      <div className="mb-tabs">
        <button className={`mb-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')} type="button">
          All Bookings
        </button>
        <button className={`mb-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')} type="button">
          Upcoming
        </button>
        <button className={`mb-tab ${activeTab === 'canceled' ? 'active' : ''}`} onClick={() => setActiveTab('canceled')} type="button">
          Canceled
        </button>
      </div>

      <div className="mb-list">
        {actionMessage ? <p className="mb-action-message">{actionMessage}</p> : null}
        {error ? <p className="mb-action-message">{error}</p> : null}
        {isLoading ? (
          <div className="mb-empty">
            <p>Loading your bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isSelected={selectedBookingId === booking.id}
              onShow={handleShowBooking}
              onDownload={handleDownloadBooking}
              onCancel={() => handleCancelBooking(booking)}
            />
          ))
        ) : (
          <div className="mb-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <p>No bookings found for this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
