import React from 'react'
import './css/Notifications.css'

const NOTIFICATION_STATS = [
  { id: 'bookings', label: 'Bookings', count: 12, color: 'green', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
  { id: 'reminders', label: 'Reminders', count: 8, color: 'blue', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'payments', label: 'Payments', count: 15, color: 'purple', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'cancellations', label: 'Cancellations', count: 3, color: 'red', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> },
  { id: 'announcements', label: 'Announcements', count: 6, color: 'orange', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20h2V4h-2v16zm7.25-10.74l1.41-1.42c1.4 1.41 2.34 3.32 2.34 5.46s-.94 4.05-2.34 5.46l-1.41-1.42A5.94 5.94 0 0 0 20 13.3c0-1.66-.67-3.16-1.75-4.24v-.2zm-12.5.2A5.94 5.94 0 0 1 4 13.3c0 1.66.67 3.16 1.75 4.24l-1.41 1.42A7.95 7.95 0 0 1 2 13.3c0-2.14.94-4.05 2.34-5.46l1.41 1.42z"/></svg> } // Megaphone alternative or wait, let's use a simpler polygon outline for megaphone
]

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking',
    color: 'green',
    title: 'Booking Confirmation',
    content: 'Your booking for "Tech Conference 2024" has been confirmed. Check your email for details.',
    time: '2 minutes ago',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
  },
  {
    id: 2,
    type: 'reminder',
    color: 'blue',
    title: 'Event Reminder',
    content: 'Summer Music Festival starts in 3 days. Don\'t forget to check the venue details!',
    time: '1 hour ago',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  },
  {
    id: 3,
    type: 'payment',
    color: 'purple',
    title: 'Payment Success',
    content: 'Payment of $299 processed successfully for your event booking.',
    time: '3 hours ago',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  },
  {
    id: 4,
    type: 'cancellation',
    color: 'red',
    title: 'Event Cancellation',
    content: 'Unfortunately, "Workshop Series" has been cancelled. Full refund will be processed within 5-7 business days.',
    time: '5 hours ago',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  },
  {
    id: 5,
    type: 'announcement',
    color: 'orange',
    title: 'Organizer Announcement',
    content: 'New update from Tech Events Inc: Venue location has been changed. Please check the updated details.',
    time: '1 day ago',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
  },
  {
    id: 6,
    type: 'booking',
    color: 'green',
    title: 'Booking Confirmation',
    content: 'Successfully booked 2 tickets for "Sports Championship". See you there!',
    time: '2 days ago',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
  }
]

export default function Notifications() {
  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="nc-header-section">
          <h2 className="admin-section-title" style={{color: '#1e3a8a'}}>Notifications Center</h2>
          <p className="admin-section-subtitle">Stay updated with all platform activities and announcements.</p>
        </div>

        <div className="nc-stats-grid">
          {NOTIFICATION_STATS.map(stat => (
            <div key={stat.id} className={`nc-stat-card nc-border-${stat.color}`}>
              <div className={`nc-stat-icon-wrapper nc-bg-${stat.color}`}>
                {stat.icon}
              </div>
              <div className="nc-stat-count">{stat.count}</div>
              <div className="nc-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="nc-list-container">
          <div className="nc-list-header">
            <h3>Recent Notifications</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          
          <div className="nc-list">
            {NOTIFICATIONS.map(notification => (
              <div key={notification.id} className={`nc-item nc-item-${notification.color}`}>
                <div className="nc-item-border"></div>
                <div className={`nc-item-icon nc-bg-${notification.color}`}>
                  {notification.icon}
                </div>
                <div className="nc-item-content">
                  <div className="nc-item-title-row">
                    <h4>{notification.title}</h4>
                  </div>
                  <p className="nc-item-text">{notification.content}</p>
                  <span className="nc-item-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
