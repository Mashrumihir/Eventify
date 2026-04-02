import React from 'react'
import './css/UserManagement.css'

const USERS = [
  { id: 1, initials: 'JS', name: 'John Smith', email: 'john.smith@email.com', status: 'active', joinDate: '2024-01-15', bookings: 12 },
  { id: 2, initials: 'EW', name: 'Emma Wilson', email: 'emma.wilson@email.com', status: 'active', joinDate: '2024-02-03', bookings: 8 },
  { id: 3, initials: 'MB', name: 'Mike Brown', email: 'mike.brown@email.com', status: 'blocked', joinDate: '2023-12-20', bookings: 3 },
  { id: 4, initials: 'SJ', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', status: 'active', joinDate: '2024-02-10', bookings: 15 },
  { id: 5, initials: 'DL', name: 'David Lee', email: 'david.lee@email.com', status: 'active', joinDate: '2024-01-28', bookings: 7 },
]

export default function UserManagement() {
  return (
    <div className="admin-page-layout">
      {/* Top Welcome Header is expected to be present in main App layout or rendered here. 
          Actually, we rendered it inside Dashboard previously. Let's move it to App.jsx or render it in each page. 
          For now, just render the content area. */}
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <h2 className="admin-section-title">User Management</h2>
        <p className="admin-section-subtitle">Manage and monitor all registered users on the platform.</p>

        <div className="um-search-container">
          <div className="um-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search users by name or email..." />
          </div>
        </div>

        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="um-user-cell">
                      <div className="um-avatar">{user.initials}</div>
                      <span className="um-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="um-email">{user.email}</td>
                  <td>
                    <span className={`um-status ${user.status.toLowerCase()}`}>{user.status}</span>
                  </td>
                  <td className="um-date">{user.joinDate}</td>
                  <td className="um-bookings"><strong>{user.bookings}</strong></td>
                  <td>
                    <div className="um-actions">
                      <button className="um-action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="um-action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
