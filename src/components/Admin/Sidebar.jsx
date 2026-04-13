import React from 'react'
import './css/Sidebar.css'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5h16" />
        <path d="M6.5 16l3.5-4 3 2.6 4.5-6.1" />
        <path d="M17.5 8.5H20v2.5" />
      </svg>
    ),
  },
  {
    id: 'userManagement',
    label: 'User Management',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="8" r="3.2" />
        <circle cx="16.5" cy="9" r="2.5" opacity="0.9" />
        <path d="M3.5 18.5a4.9 4.9 0 0 1 9.8 0v.5h-9.8z" />
        <path d="M13.2 18.5a4.1 4.1 0 0 1 6.3-3.5 4.4 4.4 0 0 1 1.8 3.5v.5h-8.1z" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: 'organizerApproval',
    label: 'Organizer Approval',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="10" cy="7.5" r="3.1" />
        <path d="M4.2 18.5a5 5 0 0 1 10 0v.5h-10z" />
        <path d="M16.4 9.4l1.5 1.5 3.1-3.1 1.1 1.1-4.2 4.2-2.6-2.6z" />
      </svg>
    ),
  },
  {
    id: 'systemSettings',
    label: 'System Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.6 2h2.8l.5 2.2a7.8 7.8 0 0 1 1.9.8l2-1.1 2 2-1.1 2a7.8 7.8 0 0 1 .8 1.9L22 10.6v2.8l-2.2.5a7.8 7.8 0 0 1-.8 1.9l1.1 2-2 2-2-1.1a7.8 7.8 0 0 1-1.9.8L13.4 22h-2.8l-.5-2.2a7.8 7.8 0 0 1-1.9-.8l-2 1.1-2-2 1.1-2a7.8 7.8 0 0 1-.8-1.9L2 13.4v-2.8l2.2-.5a7.8 7.8 0 0 1 .8-1.9l-1.1-2 2-2 2 1.1a7.8 7.8 0 0 1 1.9-.8z" />
        <circle cx="12" cy="12" r="2.8" fill="#314c85" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22a2.8 2.8 0 0 0 2.6-1.8H9.4A2.8 2.8 0 0 0 12 22z" />
        <path d="M18.5 16.8V11a6.5 6.5 0 1 0-13 0v5.8L3.4 19h17.2z" />
      </svg>
    ),
  },
  {
    id: 'contactMessages',
    label: 'Contact Messages',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.7 6.5L5 22l3.7-2c1.1.3 2.2.5 3.3.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
        <circle cx="8" cy="11.5" r="1.1" fill="#314c85" />
        <circle cx="12" cy="11.5" r="1.1" fill="#314c85" />
        <circle cx="16" cy="11.5" r="1.1" fill="#314c85" />
      </svg>
    ),
  },
  {
    id: 'newsletterSubscribers',
    label: 'Newsletter Subscribers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
        <path d="M4.5 6.2L12 12l7.5-5.8" fill="none" stroke="#314c85" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.8 17.5l4.9-4.3M19.2 17.5l-4.9-4.3" fill="none" stroke="#314c85" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'reviews',
    label: 'Reviews & Ratings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.8l2.7 5.4 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.3 6-.9z" />
      </svg>
    ),
  },
]

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <h2>Admin Panel</h2>
        <span className="admin-logo-subtitle">Control Center</span>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`admin-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <button className="admin-nav-item admin-logout" onClick={onLogout}>
          <span className="admin-nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5"/><path d="M15 12H4"/><path d="M20 19v-2.5a1.5 1.5 0 0 0-1.5-1.5H17"/></svg>
          </span>
          Logout
        </button>
      </div>
    </aside>
  )
}
