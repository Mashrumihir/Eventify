import React from 'react'
import { BsBell, BsCalendarEvent, BsCheckCircle, BsMegaphone } from 'react-icons/bs'
import './css/Notifications.css'

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'confirmed',
    title: 'Booking Confirmed',
    content: 'Your ticket for "Tech Conference 2024" has been confirmed.',
    time: '1 week ago',
    status: 'Unread',
    Icon: BsCheckCircle,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Event Reminder',
    content: '"Digital Marketing Summit" starts in 2 days.',
    time: '1 week ago',
    status: 'Unread',
    Icon: BsCalendarEvent,
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Venue Change for Summer Festival',
    content:
      'Due to weather conditions, the venue has been moved to Indoor Arena. All ticket holders will receive updated location details via email. The event timing remains the same.',
    time: '1 week ago',
    status: 'Unread',
    Icon: BsMegaphone,
  },
  {
    id: 4,
    type: 'announcement',
    title: 'Early Bird Tickets Available',
    content:
      'Get 20% off on tickets purchased before March 1st! Limited time offer for our most anticipated technology conference of the year. Secure your spot today and save big.',
    time: '1 week ago',
    status: 'Unread',
    Icon: BsMegaphone,
  },
  {
    id: 5,
    type: 'announcement',
    title: 'New VIP Package Launched',
    content:
      'Exclusive VIP packages now available with backstage access and premium seating. Includes meet and greet with speakers, premium networking lounge access, and complimentary refreshments.',
    time: '1 week ago',
    status: 'Unread',
    Icon: BsMegaphone,
  },
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
          <h2 className="admin-section-title" style={{ color: '#1e3a8a' }}>Notifications Center</h2>
          <p className="admin-section-subtitle">Stay updated with all platform activities and announcements.</p>
        </div>

        <div className="nc-list-container">
          <div className="nc-list-header">
            <h3>Recent Notifications</h3>

            <div className="nc-list-actions">
              <select className="nc-filter-select" defaultValue="All" aria-label="Filter notifications">
                <option value="All">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Reminder">Reminder</option>
                <option value="Announcement">Announcement</option>
              </select>

              <button type="button" className="nc-mark-read-btn">
                Mark all as read
              </button>
            </div>
          </div>

          <div className="nc-list">
            {NOTIFICATIONS.map(({ id, type, title, content, time, status, Icon: NotificationIcon }) => (
              <div key={id} className={`nc-item nc-item-${type}`}>
                <div className={`nc-item-icon nc-item-icon-${type}`}>
                  {React.createElement(NotificationIcon, { size: 14 })}
                </div>

                <div className="nc-item-content">
                  <div className="nc-item-top-row">
                    <h4>{title}</h4>
                    <span className="nc-item-badge">{status}</span>
                  </div>

                  <p className="nc-item-text">{content}</p>
                  <span className="nc-item-time">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
