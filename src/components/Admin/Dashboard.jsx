import React from 'react'
import './css/Dashboard.css'

const STATS = [
  {
    id: 1,
    title: 'Total Users',
    value: '12,458',
    trend: '+12.5%',
    isPositive: true,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    id: 2,
    title: 'Total Organizers',
    value: '1,247',
    trend: '+8.2%',
    isPositive: true,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
  },
  {
    id: 3,
    title: 'Total Events',
    value: '3,892',
    trend: '+15.3%',
    isPositive: true,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  },
  {
    id: 4,
    title: 'Revenue Summary',
    value: '₹284,596',
    trend: '-3.1%',
    isPositive: false,
    icon: <div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</div>
  }
]

const PENDING_APPROVALS = [
  {
    id: 1,
    name: 'Tech Events Global',
    type: 'Organizer',
    meta: 'Submitted on Jan 15, 2024'
  },
  {
    id: 2,
    name: 'Digital Marketing Summit 2024',
    type: 'Event',
    meta: 'Scheduled for Mar 20, 2024'
  },
  {
    id: 3,
    name: 'Creative Minds Agency',
    type: 'Organizer',
    meta: 'Submitted on Jan 18, 2024'
  },
  {
    id: 4,
    name: 'AI & Machine Learning Conference',
    type: 'Event',
    meta: 'Scheduled for Apr 05, 2024'
  },
  {
    id: 5,
    name: 'Startup Ventures Inc',
    type: 'Organizer',
    meta: 'Submitted on Jan 19, 2024'
  }
]

export default function Dashboard() {
  return (
    <div className="admin-page-layout">
      {/* Top Welcome Header - Specific to Admin */}
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <h2 className="admin-section-title">Dashboard Overview</h2>
        <p className="admin-section-subtitle">Welcome back! Here's what's happening with your platform.</p>

        {/* Stats Row */}
        <div className="admin-stats-grid">
          {STATS.map(stat => (
            <div key={stat.id} className="admin-stat-card">
              <div className="admin-stat-info">
                <h4>{stat.title}</h4>
                <div className="admin-stat-value">{stat.value}</div>
                <div className={`admin-stat-trend ${stat.isPositive ? 'positive' : 'negative'}`}>
                  {stat.trend} <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="admin-stat-icon">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Approvals */}
        <div className="admin-card mt-24">
          <div className="admin-card-header">
            <h3>Pending Approvals</h3>
            <span className="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
          </div>
          
          <div className="admin-approval-list">
            {PENDING_APPROVALS.map(item => (
              <div key={item.id} className="admin-approval-item">
                <div className="admin-approval-info">
                  <h4>{item.name}</h4>
                  <p>{item.type} • {item.meta}</p>
                </div>
                <div className="admin-approval-actions">
                  <button className="admin-btn-approve">Approve</button>
                  <button className="admin-btn-reject">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
