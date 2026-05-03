import { useEffect, useMemo, useState } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { FiTrendingUp } from 'react-icons/fi'
import { LuClipboardList, LuTicket } from 'react-icons/lu'
import './css/Dashboard.css'
import { fetchOrganizerDashboard } from '../../services/dataService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_INDEX_BY_LABEL = WEEK_LABELS.reduce((map, label, index) => ({ ...map, [label]: index }), {})

function extractTicketCount(action = '') {
  const match = action.match(/Purchased\s+(\d+)/i)
  return match ? Number(match[1]) : 1
}

function getDayIndex(value) {
  if (!value) return -1

  const label = new Date(value).toLocaleDateString('en-US', { weekday: 'short' })
  return DAY_INDEX_BY_LABEL[label] ?? -1
}

function createLineGradient(context, colorStart, colorEnd) {
  const { chart } = context
  const { chartArea, ctx } = chart

  if (!chartArea) {
    return colorStart
  }

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorEnd)
  return gradient
}

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

  const chartMetrics = useMemo(() => {
    const sales = Array(7).fill(0)
    const revenue = Array(7).fill(0)
    const visitorSets = Array.from({ length: 7 }, () => new Set())

    data.recentActivity.forEach((activity) => {
      const dayIndex = getDayIndex(activity.paidAt)

      if (dayIndex < 0) {
        return
      }

      sales[dayIndex] += extractTicketCount(activity.action)
      revenue[dayIndex] += Number(activity.amount || 0)
      visitorSets[dayIndex].add(activity.user || activity.id)
    })

    return {
      sales,
      revenue,
      visitors: visitorSets.map((visitorSet) => visitorSet.size),
    }
  }, [data.recentActivity])

  const salesChartData = useMemo(() => ({
    labels: WEEK_LABELS,
    datasets: [
      {
        label: 'Sales',
        data: chartMetrics.sales,
        borderColor: '#3b82f6',
        backgroundColor: (context) => createLineGradient(context, 'rgba(59, 130, 246, 0.22)', 'rgba(59, 130, 246, 0)'),
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.42,
        fill: true,
        yAxisID: 'sales',
      },
      {
        label: 'Revenue',
        data: chartMetrics.revenue,
        borderColor: '#14b8a6',
        backgroundColor: (context) => createLineGradient(context, 'rgba(20, 184, 166, 0.2)', 'rgba(20, 184, 166, 0)'),
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.42,
        fill: true,
        yAxisID: 'revenue',
      },
    ],
  }), [chartMetrics])

  const visitorsChartData = useMemo(() => ({
    labels: WEEK_LABELS,
    datasets: [
      {
        label: 'Visitors',
        data: chartMetrics.visitors,
        borderColor: '#8b5cf6',
        backgroundColor: (context) => createLineGradient(context, 'rgba(139, 92, 246, 0.22)', 'rgba(139, 92, 246, 0)'),
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.42,
        fill: true,
      },
    ],
  }), [chartMetrics.visitors])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          boxHeight: 3,
          boxWidth: 24,
          color: '#526783',
          font: {
            size: 12,
            weight: 500,
          },
          usePointStyle: false,
        },
      },
      tooltip: {
        backgroundColor: '#0f274a',
        titleColor: '#ffffff',
        bodyColor: '#dbeafe',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          color: '#dbe5f2',
        },
        ticks: {
          color: '#6b7f9d',
          font: {
            size: 12,
          },
        },
      },
      sales: {
        beginAtZero: true,
        position: 'left',
        grid: {
          color: 'rgba(219, 229, 242, 0.7)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#8ea0ba',
          precision: 0,
        },
      },
      revenue: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#8ea0ba',
          callback: (value) => `\u20B9${Number(value).toLocaleString('en-IN')}`,
        },
      },
    },
  }), [])

  const visitorsChartOptions = useMemo(() => ({
    ...chartOptions,
    scales: {
      x: chartOptions.scales.x,
      y: {
        beginAtZero: true,
        grid: chartOptions.scales.sales.grid,
        border: chartOptions.scales.sales.border,
        ticks: {
          color: '#8ea0ba',
          precision: 0,
        },
      },
    },
  }), [chartOptions])

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

      <div className="org-charts-row">
        <div className="org-chart-card">
          <h3 className="org-chart-title">Sales Chart</h3>
          <div className="org-chart-canvas">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="org-chart-card">
          <h3 className="org-chart-title">Visitors Chart</h3>
          <div className="org-chart-canvas">
            <Line data={visitorsChartData} options={visitorsChartOptions} />
          </div>
        </div>
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
