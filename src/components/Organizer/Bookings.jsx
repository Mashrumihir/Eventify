import React from 'react'
import './css/Bookings.css'

const BOOKINGS = [
  { id: '#BK001', attendee: { name: 'Sarah Johnson', email: 'sarah.j@email.com' }, event: 'Tech Conference 2024', type: 'VIP', qty: 2, amount: '₹398', status: 'Confirmed', date: 'Jan 15, 2024' },
  { id: '#BK002', attendee: { name: 'Michael Chen', email: 'm.chen@email.com' }, event: 'Marketing Summit', type: 'Standard', qty: 1, amount: '₹89', status: 'Pending', date: 'Jan 14, 2024' },
  { id: '#BK003', attendee: { name: 'Emma Davis', email: 'emma.d@email.com' }, event: 'Design Workshop', type: 'Premium', qty: 3, amount: '₹357', status: 'Confirmed', date: 'Jan 13, 2024' },
  { id: '#BK004', attendee: { name: 'Alex Wilson', email: 'alex.w@email.com' }, event: 'Startup Meetup', type: 'Free', qty: 1, amount: '₹0', status: 'Cancelled', date: 'Jan 12, 2024' },
  { id: '#BK005', attendee: { name: 'Lisa Brown', email: 'lisa.b@email.com' }, event: 'AI Conference', type: 'Early Bird', qty: 2, amount: '₹149', status: 'Confirmed', date: 'Jan 11, 2024' },
  { id: '#BK006', attendee: { name: 'David Miller', email: 'david.m@email.com' }, event: 'Business Expo', type: 'VIP', qty: 1, amount: '₹598', status: 'Confirmed', date: 'Jan 10, 2024' }
]

export default function Bookings() {
  return (
    <div className="org-page-layout">
      {/* Header */}
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Booking Management</h1>
          <p className="org-page-subtitle">Manage all event bookings and attendees.</p>
        </div>
        <div className="bk-header-actions">
          <button className="bk-btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter
          </button>
          <button className="bk-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bk-table-container">
        {/* Search */}
        <div className="bk-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search by attendee, email, or event..." />
        </div>

        {/* Table */}
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
              {BOOKINGS.map((bk) => (
                <tr key={bk.id}>
                  <td className="bk-id-cell">{bk.id}</td>
                  <td>
                    <div className="bk-attendee">
                      <span className="bk-name">{bk.attendee.name}</span>
                      <span className="bk-email">{bk.attendee.email}</span>
                    </div>
                  </td>
                  <td className="bk-cell-main">{bk.event}</td>
                  <td>
                    <span className={`bk-pill-type t-${bk.type.replace(/\s+/g, '-').toLowerCase()}`}>
                      {bk.type}
                    </span>
                  </td>
                  <td className="bk-cell-main">{bk.qty}</td>
                  <td className="bk-amount-cell">{bk.amount}</td>
                  <td>
                    <span className={`bk-status-pill s-${bk.status.toLowerCase()}`}>
                      {bk.status}
                    </span>
                  </td>
                  <td className="bk-cell-main">{bk.date}</td>
                  <td>
                    <button className="bk-action-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bk-table-footer">
          <span className="bk-showing">Showing 6 of 6 bookings</span>
          <div className="bk-pagination">
            <button disabled>Previous</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
