import { useEffect, useState } from 'react'
import './css/Dashboard.css'
import { fetchAdminDashboard, updateOrganizerApplication } from '../../services/dataService'

export default function Dashboard() {
  const [data, setData] = useState({
    stats: {
      totalUsers: 0,
      totalOrganizers: 0,
      totalEvents: 0,
      revenueSummary: 0,
    },
    pendingApprovals: [],
  })
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAdminDashboard() {
      try {
        setError('')
        const response = await fetchAdminDashboard()

        if (isMounted) {
          setData(response)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      }
    }

    loadAdminDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const stats = [
    { id: 1, title: 'Total Users', value: data.stats.totalUsers },
    { id: 2, title: 'Total Organizers', value: data.stats.totalOrganizers },
    { id: 3, title: 'Total Events', value: data.stats.totalEvents },
    { id: 4, title: 'Revenue Summary', value: `\u20B9${Number(data.stats.revenueSummary).toLocaleString('en-IN')}` },
  ]

  const handleApproval = async (applicationId, status) => {
    try {
      await updateOrganizerApplication(applicationId, status)
      setData((current) => ({
        ...current,
        pendingApprovals: current.pendingApprovals.filter((item) => item.id !== applicationId),
      }))
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform with live database data.</p>
      </div>

      {error ? <p className="me-status-message">{error}</p> : null}

      <div className="admin-content-area">
        <h2 className="admin-section-title">Dashboard Overview</h2>
        <p className="admin-section-subtitle">The values below are now pulled from your PostgreSQL tables.</p>

        <div className="admin-stats-grid">
          {stats.map((stat) => (
            <article key={stat.id} className="admin-stat-card">
              <div className="admin-stat-copy">
                <span className="admin-stat-label">{stat.title}</span>
                <strong className="admin-stat-value">{stat.value}</strong>
                <p className="admin-stat-trend">Live <span>database value</span></p>
              </div>
            </article>
          ))}
        </div>

        <section className="admin-approvals-card">
          <h3>Pending Approvals</h3>

          <div className="admin-approval-list">
            {data.pendingApprovals.length ? (
              data.pendingApprovals.map((item) => (
                <div key={item.id} className="admin-approval-item">
                  <div className="admin-approval-info">
                    <h4>{item.name}</h4>
                    <p>
                      Organizer • Submitted on {new Date(item.submittedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="admin-approval-actions">
                    <button className="admin-btn-approve" type="button" onClick={() => handleApproval(item.id, 'approved')}>Approve</button>
                    <button className="admin-btn-reject" type="button" onClick={() => handleApproval(item.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="admin-section-subtitle">No pending organizer applications right now.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
