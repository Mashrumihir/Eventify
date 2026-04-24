import { useEffect, useState } from 'react'
import './css/Notifications.css'
import {
  fetchAttendeeNotifications,
  markAllAttendeeNotificationsRead,
  markAttendeeNotificationRead,
} from '../../services/dataService'

function getRelativeTime(value) {
  const now = Date.now()
  const createdAt = new Date(value).getTime()
  const diffHours = Math.max(1, Math.floor((now - createdAt) / (1000 * 60 * 60)))

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

function NotificationIcon({ type }) {
  if (type === 'success') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }

  if (type === 'warning') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }

  if (type === 'danger') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export default function Notifications({ currentUser }) {
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadNotifications() {
      if (!currentUser?.id) {
        if (isMounted) {
          setNotifications([])
        }
        return
      }

      try {
        setError('')
        const response = await fetchAttendeeNotifications(currentUser.id)

        if (isMounted) {
          setNotifications(response.notifications || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load notifications.')
        }
      }
    }

    loadNotifications()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllAsRead = async () => {
    if (!currentUser?.id) {
      return
    }

    await markAllAttendeeNotificationsRead(currentUser.id)
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, isRead: true }))
    )
  }

  const markAsRead = async (id) => {
    const target = notifications.find((notification) => notification.id === id)

    if (!target || target.isRead || !currentUser?.id) {
      return
    }

    await markAttendeeNotificationRead(id, currentUser.id)
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
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
      {error ? <p className="notif-page-subtitle">{error}</p> : null}

      {/* List */}
      <div className="notif-list">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`notif-card ${notif.isRead ? '' : 'unread'}`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className={`notif-icon-wrap bg-${notif.type} text-${notif.type}`}>
              <NotificationIcon type={notif.type} />
            </div>
            
            <div className="notif-content">
              <h3 className="notif-title">{notif.title}</h3>
              <p className="notif-message">{notif.message}</p>
            </div>
            
            <div className="notif-time">
              {getRelativeTime(notif.createdAt)}
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
