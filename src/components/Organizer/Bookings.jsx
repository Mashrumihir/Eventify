import React, { useMemo, useState } from 'react'
import './css/Bookings.css'

const BOOKINGS = [
  { id: '#EVT-20260412133625-001', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Tech Summit 2026', type: 'VIP', qty: 10, amount: '\u20B91,990', status: 'Booked', date: 'Apr 12, 2026', refunded: false },
  { id: '#EVT-20260412115743-001', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Tech Summit 2026', type: 'Early Bird', qty: 1, amount: '\u20B979', status: 'Booked', date: 'Apr 12, 2026', refunded: false },
  { id: '#EVT-20260412083648-007', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Jazz Night Live', type: 'Regular', qty: 1, amount: '\u20B955', status: 'Booked', date: 'Apr 12, 2026', refunded: false },
  { id: '#FR-20260411162726-003', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Modern Art Exhibition', type: 'Regular', qty: 1, amount: '\u20B900', status: 'Canceled', date: 'Apr 11, 2026', refunded: true },
  { id: '#FR-20260411162645-009', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Mihir Mashru', type: 'Regular', qty: 1, amount: '\u20B900', status: 'Canceled', date: 'Apr 11, 2026', refunded: true },
  { id: '#EVT-20260411161310-001', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Tech Summit 2026', type: 'Regular', qty: 3, amount: '\u20B9297', status: 'Canceled', date: 'Apr 11, 2026', refunded: true },
  { id: '#EVT-20260411161240-001', attendee: { name: 'Mashrumihir15', email: 'mashrumihir15@gmail.com' }, event: 'Tech Summit 2026', type: 'Regular', qty: 3, amount: '\u20B9297', status: 'Booked', date: 'Apr 11, 2026', refunded: false },
]

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState(BOOKINGS)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [draftStatusFilter, setDraftStatusFilter] = useState('all')
  const [draftEventFilter, setDraftEventFilter] = useState('all')
  const [actionMessage, setActionMessage] = useState('')

  const eventOptions = useMemo(() => (
    Array.from(new Set(bookings.map((booking) => booking.event)))
  ), [bookings])

  const filteredBookings = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesSearch = !normalizedQuery || [
        booking.id,
        booking.attendee.name,
        booking.attendee.email,
        booking.event,
      ].some((value) => value.toLowerCase().includes(normalizedQuery))

      const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter
      const matchesEvent = eventFilter === 'all' || booking.event === eventFilter

      return matchesSearch && matchesStatus && matchesEvent
    })
  }, [bookings, searchTerm, statusFilter, eventFilter])

  const handleRefund = (bookingId) => {
    setBookings((current) => current.map((booking) => (
      booking.id === bookingId
        ? { ...booking, refunded: true, status: 'Canceled' }
        : booking
    )))

    const refundedBooking = bookings.find((booking) => booking.id === bookingId)
    if (refundedBooking) {
      setActionMessage(`Refund completed for ${refundedBooking.id}.`)
    }
  }

  const handleToggleFilters = () => {
    setDraftStatusFilter(statusFilter)
    setDraftEventFilter(eventFilter)
    setShowFilters((current) => !current)
  }

  const handleApplyFilters = () => {
    setStatusFilter(draftStatusFilter)
    setEventFilter(draftEventFilter)
    setShowFilters(false)
  }

  const handleResetFilters = () => {
    setDraftStatusFilter('all')
    setDraftEventFilter('all')
    setStatusFilter('all')
    setEventFilter('all')
    setShowFilters(false)
  }

  const handleExportCsv = () => {
    const headers = ['Booking ID', 'Attendee Name', 'Attendee Email', 'Event', 'Ticket Type', 'Quantity', 'Amount', 'Status', 'Date', 'Refund State']
    const rows = filteredBookings.map((booking) => ([
      booking.id,
      booking.attendee.name,
      booking.attendee.email,
      booking.event,
      booking.type,
      String(booking.qty),
      booking.amount,
      booking.status,
      booking.date,
      booking.refunded ? 'Refunded' : 'Refund Available',
    ]))

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().slice(0, 10)

    link.href = url
    link.download = `bookings-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setActionMessage(`Exported ${filteredBookings.length} booking${filteredBookings.length === 1 ? '' : 's'} to CSV.`)
  }

  return (
    <div className="org-page-layout">
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Booking Management</h1>
          <p className="org-page-subtitle">Manage all event bookings and attendees.</p>
        </div>
        <div className="bk-header-actions">
          <button className={`bk-btn-outline ${showFilters ? 'is-active' : ''}`} onClick={handleToggleFilters} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter
          </button>
          <button className="bk-btn-outline" onClick={handleExportCsv} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {actionMessage ? <p className="bk-status-message">{actionMessage}</p> : null}

      <div className="bk-search-shell">
        <div className="bk-search-row">
          <div className="bk-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search by attendee, email, or event..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </div>

      {showFilters ? (
        <div className="bk-filter-shell">
          <div className="bk-filters-panel">
            <div className="bk-filter-group">
              <label htmlFor="booking-status-filter">Status</label>
              <select id="booking-status-filter" value={draftStatusFilter} onChange={(event) => setDraftStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="booked">Booked</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="bk-filter-group">
              <label htmlFor="booking-event-filter">Event</label>
              <select id="booking-event-filter" value={draftEventFilter} onChange={(event) => setDraftEventFilter(event.target.value)}>
                <option value="all">All events</option>
                {eventOptions.map((eventName) => (
                  <option key={eventName} value={eventName}>{eventName}</option>
                ))}
              </select>
            </div>

            <div className="bk-filter-actions">
              <button className="bk-filter-btn bk-filter-apply" onClick={handleApplyFilters} type="button">Apply</button>
              <button className="bk-filter-btn bk-filter-reset" onClick={handleResetFilters} type="button">Reset</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bk-table-shell">
        <div className="bk-table-overflow">
          <table className="bk-table">
            <thead>
              <tr>
                <th>BOOKING ID</th>
                <th>ATTENDEE</th>
                <th>EVENT</th>
                <th>TICKET TYPE</th>
                <th>QTY</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="bk-id-cell">{booking.id}</td>
                  <td>
                    <div className="bk-attendee">
                      <span className="bk-name">{booking.attendee.name}</span>
                      <span className="bk-email">{booking.attendee.email}</span>
                    </div>
                  </td>
                  <td className="bk-cell-main">{booking.event}</td>
                  <td>
                    <span className={`bk-pill-type t-${booking.type.replace(/\s+/g, '-').toLowerCase()}`}>
                      {booking.type}
                    </span>
                  </td>
                  <td className="bk-cell-main">{booking.qty}</td>
                  <td className="bk-amount-cell">{booking.amount}</td>
                  <td>
                    <span className={`bk-status-pill s-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="bk-cell-main">{booking.date}</td>
                  <td>
                    <button
                      className={`bk-action-btn ${booking.refunded ? 'is-disabled' : ''}`}
                      onClick={() => handleRefund(booking.id)}
                      disabled={booking.refunded}
                      type="button"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3.36-7.03"/><polyline points="21 3 21 9 15 9"/></svg>
                      {booking.refunded ? 'Refunded' : 'Refund'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredBookings.length ? (
          <div className="bk-empty-state">
            <h3>No bookings found</h3>
            <p>Try a different search or filter combination.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
