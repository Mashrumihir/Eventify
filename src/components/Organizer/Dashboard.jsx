import { useEffect, useState } from 'react'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { FiTrendingUp } from 'react-icons/fi'
import { LuClipboardList, LuTicket } from 'react-icons/lu'
import './css/Dashboard.css'
import { fetchOrganizerDashboard } from '../../services/dataService'

export default function Dashboard({ currentUser }) {
  const [data, setData] = useState({
    stats: {
      totalRevenue: 0,
      ticketsSold: 0,
      totalEvents: 0,
      conversionRate: 0,
    },
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadOrganizerDashboard() {
      if (!currentUser?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchOrganizerDashboard(currentUser.id)

        if (isMounted) {
          setData(response)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrganizerDashboard()
    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const stats = [
    {
      title: 'Total Revenue',
      value: `\u20B9${Number(data.stats.totalRevenue).toLocaleString('en-IN')}`,
      change: 'Live',
      icon: <FaIndianRupeeSign size={16} />,
      color: 'blue',
    },
    {
      title: 'Tickets Sold',
      value: data.stats.ticketsSold,
      change: 'Live',
      icon: <LuTicket size={18} />,
      color: 'purple',
    },
    {
      title: 'Total Events',
      value: data.stats.totalEvents,
      change: 'Live',
      icon: <LuClipboardList size={18} />,
      color: 'green',
    },
    {
      title: 'Conversion Rate',
      value: `${data.stats.conversionRate}%`,
      change: 'Live',
      icon: <FiTrendingUp size={18} />,
      color: 'orange',
    },
  ]

  return (
    <div className="org-dash-layout">
      <div className="org-header">
        <h1 className="org-title">Organizer Dashboard</h1>
        <p className="org-subtitle">Live booking and payment activity for {currentUser?.name || 'your account'}.</p>
      </div>

      {error ? <p className="me-status-message">{error}</p> : null}

      <div className="org-stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className={`org-stat-card border-${stat.color}`}>
            <div className="org-stat-top">
              <div className={`org-stat-icon-wrap bg-${stat.color}`}>{stat.icon}</div>
              <span className="org-stat-change">{stat.change}</span>
            </div>
            <div className="org-stat-info">
              <span className="org-stat-value">{stat.value}</span>
              <span className="org-stat-label">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="org-activity-card">
        <h3 className="org-activity-title">Recent Activity</h3>
        {isLoading ? (
          <p className="org-subtitle">Loading recent bookings...</p>
        ) : (
          <div className="org-table-wrap">
            <table className="org-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.length ? (
                  data.recentActivity.map((row) => (
                    <tr key={row.id}>
                      <td className="font-medium text-primary">{row.event}</td>
                      <td>{row.user}</td>
                      <td className="text-muted">{row.action}</td>
                      <td className="font-bold">\u20B9{Number(row.amount).toLocaleString('en-IN')}</td>
                      <td className="text-muted">
                        {row.paidAt
                          ? new Date(row.paidAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : 'Pending'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No booking activity found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
