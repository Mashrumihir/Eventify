import React from 'react'
import './css/Dashboard.css'

const STATS = [
  {
    id: 1,
    title: 'Total Users',
    value: '10',
    trend: '+100.0%',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Total Organizers',
    value: '3',
    trend: '+100.0%',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 8v6" />
        <path d="M17 11h6" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Total Events',
    value: '9',
    trend: '+100.0%',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Revenue Summary',
    value: '₹3,367',
    trend: '+100.0%',
    icon: <span className="admin-rupee-icon">₹</span>,
  },
]

const PENDING_APPROVALS = [
  { id: 1, name: 'Tech Events Inc', type: 'Organizer', meta: 'Submitted on Jan 15, 2024' },
  { id: 2, name: 'Music Festival Co', type: 'Organizer', meta: 'Submitted on Jan 18, 2024' },
  { id: 3, name: 'Mihir Mashru', type: 'Organizer', meta: 'Submitted on Apr 06, 2026' },
  { id: 4, name: 'Krupansi', type: 'Organizer', meta: 'Submitted on Apr 11, 2026' },
  { id: 5, name: 'Mihir', type: 'Organizer', meta: 'Submitted on Apr 11, 2026' },
]

export default function Dashboard() {
  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <h2 className="admin-section-title">Dashboard Overview</h2>
        <p className="admin-section-subtitle">Welcome back! Here's what's happening with your platform.</p>

        <div className="admin-stats-grid">
          {STATS.map((stat) => (
            <article key={stat.id} className="admin-stat-card">
              <div className="admin-stat-copy">
                <span className="admin-stat-label">{stat.title}</span>
                <strong className="admin-stat-value">{stat.value}</strong>
                <p className="admin-stat-trend">{stat.trend} <span>vs last month</span></p>
              </div>

              <div className="admin-stat-icon">
                {stat.icon}
              </div>
            </article>
          ))}
        </div>

        <section className="admin-approvals-card">
          <h3>Pending Approvals</h3>

          <div className="admin-approval-list">
            {PENDING_APPROVALS.map((item) => (
              <div key={item.id} className="admin-approval-item">
                <div className="admin-approval-info">
                  <h4>{item.name}</h4>
                  <p>{item.type} • {item.meta}</p>
                </div>

                <div className="admin-approval-actions">
                  <button className="admin-btn-approve" type="button">Approve</button>
                  <button className="admin-btn-reject" type="button">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
