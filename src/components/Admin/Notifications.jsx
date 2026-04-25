import { useEffect, useState } from 'react'
import { BsBell, BsCalendarEvent, BsCheckCircle, BsMegaphone, BsExclamationTriangle, BsPerson, BsCreditCard, BsGear } from 'react-icons/bs'
import './css/Notifications.css'
import {
  fetchAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
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

function getNotificationIcon(type) {
  const iconMap = {
    success: BsCheckCircle,
    confirmed: BsCheckCircle,
    warning: BsExclamationTriangle,
    danger: BsExclamationTriangle,
    alert: BsExclamationTriangle,
    reminder: BsCalendarEvent,
    event: BsCalendarEvent,
    announcement: BsMegaphone,
    promotion: BsMegaphone,
    user: BsPerson,
    booking: BsCheckCircle,
    payment: BsCreditCard,
    system: BsGear,
    general: BsBell,
  }
  return iconMap[type] || BsBell
}

export default function Notifications({ currentUser }) {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadNotifications() {
      if (!currentUser?.id) {
        if (isMounted) {
          setNotifications([])
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchAdminNotifications(currentUser.id)

        if (isMounted) {
          setNotifications(response.notifications || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load notifications.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadNotifications()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const filteredNotifications = filter === 'All'
    ? notifications
    : notifications.filter(n => n.type?.toLowerCase() === filter.toLowerCase())

  const markAllAsRead = async () => {
    if (!currentUser?.id) {
      return
    }

    await markAllAdminNotificationsRead(currentUser.id)
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, isRead: true }))
    )
  }

  const markAsRead = async (id) => {
    const target = notifications.find((notification) => notification.id === id)

    if (!target || target.isRead || !currentUser?.id) {
      return
    }

    await markAdminNotificationRead(id, currentUser.id)
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="nc-header-section">
          <h2 className="admin-section-title" style={{ color: '#1e3a8a' }}>Notifications Center</h2>
          <p className="admin-section-subtitle">
            You have {unreadCount} unread notification{unreadCount !== 1 && 's'}
          </p>
        </div>

        {error ? <p className="admin-section-subtitle" style={{ color: '#ef4444' }}>{error}</p> : null}

        <div className="nc-list-container">
          <div className="nc-list-header">
            <h3>Recent Notifications</h3>

            <div className="nc-list-actions">
              <select
                className="nc-filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter notifications"
              >
                <option value="All">All</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="announcement">Announcement</option>
                <option value="user">User Activity</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="system">System</option>
              </select>

              <button type="button" className="nc-mark-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            </div>
          </div>

          <div className="nc-list">
            {isLoading ? (
              <div className="nc-empty">Loading notifications...</div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const NotificationIcon = getNotificationIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`nc-item nc-item-${notification.type} ${notification.isRead ? '' : 'unread'}`}
                    onClick={() => markAsRead(notification.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`nc-item-icon nc-item-icon-${notification.type}`}>
                      <NotificationIcon size={14} />
                    </div>

                    <div className="nc-item-content">
                      <div className="nc-item-top-row">
                        <h4>{notification.title}</h4>
                        {!notification.isRead && <span className="nc-item-badge">Unread</span>}
                      </div>

                      <p className="nc-item-text">{notification.message}</p>
                      <span className="nc-item-time">{getRelativeTime(notification.createdAt)}</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="nc-empty">
                <BsBell size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                <p>No notifications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
