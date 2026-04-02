import { useState } from 'react'
import './css/Notifications.css'

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Booking Confirmed',
    message: 'Your ticket for "Tech Conference 2024" has been confirmed.',
    time: '2 hours ago',
    type: 'success',
    isRead: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6V4h16v2h-2v4h2v2h-2v4h2v2H4v-2h2v-4H4v-2h2V6H4zm4 2v2h8V8H8zm0 6v2h8v-2H8z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Event Reminder',
    message: '"Digital Marketing Summit" starts in 2 days.',
    time: '5 hours ago',
    type: 'info',
    isRead: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Wishlist Event Update',
    message: 'New dates available for "Music Festival 2024".',
    time: '1 day ago',
    type: 'danger',
    isRead: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Leave a Review',
    message: 'How was "Web Development Workshop"? Share your experience.',
    time: '2 days ago',
    type: 'warning',
    isRead: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Payment Successful',
    message: 'Payment of $299 for "Business Conference" processed successfully.',
    time: '3 days ago',
    type: 'success',
    isRead: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  return (
    <div className="notif-layout">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-left">
          <h1 className="notif-page-title">Notifications</h1>
          <p className="notif-page-subtitle">
            You have {unreadCount} unread notification{unreadCount !== 1 && 's'}
          </p>
        </div>
        <button className="notif-mark-all-btn" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="notif-list">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`notif-card ${notif.isRead ? '' : 'unread'}`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className={`notif-icon-wrap bg-${notif.type} text-${notif.type}`}>
              {notif.icon}
            </div>
            
            <div className="notif-content">
              <h3 className="notif-title">{notif.title}</h3>
              <p className="notif-message">{notif.message}</p>
            </div>
            
            <div className="notif-time">
              {notif.time}
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="notif-empty">
            <p>You have no notifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
