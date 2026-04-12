import React from 'react'
import { FiBarChart2, FiClipboard } from 'react-icons/fi'
import { LuTicket } from 'react-icons/lu'
import './css/Dashboard.css'

const STATS = [
  {
    title: 'Total Revenue',
    value: '\u20B93,367',
    change: '+100.0%',
    icon: <span className="org-rupee-icon">\u20B9</span>,
    color: 'blue',
  },
  {
    title: 'Tickets Sold',
    value: '34',
    change: '+100.0%',
    icon: <LuTicket size={18} />,
    color: 'purple',
  },
  {
    title: 'Total Events',
    value: '9',
    change: '+100.0%',
    icon: <FiClipboard size={18} />,
    color: 'green',
  },
  {
    title: 'Conversion Rate',
    value: '82.9%',
    change: '+100.0%',
    icon: <FiBarChart2 size={18} />,
    color: 'orange',
  },
]

const MOCK_ACTIVITY = [
  { id: 1, event: 'Summer Music Festival', user: 'John Doe', action: 'Purchased VIP Ticket', amount: '\u20B9199', time: '2 min ago' },
  { id: 2, event: 'Tech Conference 2026', user: 'Jane Smith', action: 'Purchased Standard Ticket', amount: '\u20B989', time: '15 min ago' },
  { id: 3, event: 'Food & Wine Expo', user: 'Mike Johnson', action: 'Purchased 3x Tickets', amount: '\u20B9357', time: '1 hour ago' },
  { id: 4, event: 'Art Gallery Opening', user: 'Sarah Williams', action: 'Purchased Free Ticket', amount: '\u20B90', time: '2 hours ago' },
  { id: 5, event: 'Yoga Retreat Weekend', user: 'Emily Brown', action: 'Purchased Early Bird', amount: '\u20B9149', time: '3 hours ago' },
]

export default function Dashboard() {
  return (
    <div className="org-dash-layout">
      <div className="org-header">
        <h1 className="org-title">Organizer Dashboard</h1>
        <p className="org-subtitle">Welcome back! Here's your event overview.</p>
      </div>

      <div className="org-stats-grid">
        {STATS.map((stat) => (
          <div key={stat.title} className={`org-stat-card border-${stat.color}`}>
            <div className="org-stat-top">
              <div className={`org-stat-icon-wrap bg-${stat.color}`}>
                {stat.icon}
              </div>
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
          <div className="org-chart-area">
            <svg width="100%" height="240" viewBox="0 0 500 240" preserveAspectRatio="none">
              <path d="M40 40 L480 40" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M40 80 L480 80" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M40 120 L480 120" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M40 160 L480 160" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M40 200 L480 200" stroke="#f1f5f9" strokeWidth="1" />

              <text x="30" y="45" fontSize="10" fill="#94a3b8" textAnchor="end">500</text>
              <text x="30" y="85" fontSize="10" fill="#94a3b8" textAnchor="end">400</text>
              <text x="30" y="125" fontSize="10" fill="#94a3b8" textAnchor="end">300</text>
              <text x="30" y="165" fontSize="10" fill="#94a3b8" textAnchor="end">200</text>
              <text x="30" y="205" fontSize="10" fill="#94a3b8" textAnchor="end">100</text>

              <path d="M40 190 L100 160 L180 110 L260 20 L340 150 L420 100 L490 30" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />
              <path d="M40 200 L100 180 L180 130 L260 50 L340 160 L420 120 L490 50" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div className="org-chart-x-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
            <div className="org-chart-legend">
              <div className="legend-item"><span className="legend-dot bg-blue-500"></span> Sales</div>
              <div className="legend-item"><span className="legend-dot bg-green-500"></span> Revenue</div>
            </div>
          </div>
        </div>

        <div className="org-chart-card">
          <h3 className="org-chart-title">Visitors Chart</h3>
          <div className="org-chart-area">
            <div className="org-bar-chart">
              <div className="org-bar-bg-lines">
                <div className="org-bar-line"><span>400</span></div>
                <div className="org-bar-line"><span>300</span></div>
                <div className="org-bar-line"><span>200</span></div>
                <div className="org-bar-line"><span>100</span></div>
                <div className="org-bar-line"><span>0</span></div>
              </div>

              <div className="org-bars-container">
                <div className="org-bar-col"><div className="org-bar" style={{ height: '35%' }}></div><div className="org-bar-lbl">Mon</div></div>
                <div className="org-bar-col"><div className="org-bar" style={{ height: '55%' }}></div><div className="org-bar-lbl">Tue</div></div>
                <div className="org-bar-col"><div className="org-bar" style={{ height: '45%' }}></div><div className="org-bar-lbl">Wed</div></div>
                <div className="org-bar-col"><div className="org-bar" style={{ height: '75%' }}></div><div className="org-bar-lbl">Thu</div></div>
                <div className="org-bar-col"><div className="org-bar" style={{ height: '65%' }}></div><div className="org-bar-lbl">Fri</div></div>
                <div className="org-bar-col"><div className="org-bar" style={{ height: '100%' }}></div><div className="org-bar-lbl">Sat</div></div>
                <div className="org-bar-col"><div className="org-bar" style={{ height: '80%' }}></div><div className="org-bar-lbl">Sun</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="org-activity-card">
        <h3 className="org-activity-title">Recent Activity</h3>
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
              {MOCK_ACTIVITY.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium text-primary">{row.event}</td>
                  <td>{row.user}</td>
                  <td className="text-muted">{row.action}</td>
                  <td className="font-bold">{row.amount}</td>
                  <td className="text-muted">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
