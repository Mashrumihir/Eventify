import React from 'react'
import './css/Payments.css'

const STATS = [
  {
    title: 'Total Revenue',
    value: '\u20B93,743',
    icon: <span>{'\u20B9'}</span>,
    color: 'green',
  },
  {
    title: 'Pending Payouts',
    value: '\u20B900',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    ),
    color: 'yellow',
  },
  {
    title: 'Successful Transactions',
    value: '19',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: 'blue',
  },
  {
    title: 'Refund Requests',
    value: '0',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 3.36-7.03" />
        <polyline points="3 3 3 9 9 9" />
      </svg>
    ),
    color: 'red',
  },
]

const TRANSACTIONS = [
  { id: '#TXN-20260412133625-0031', date: 'Apr 12, 2026', event: 'Tech Summit 2026', customer: 'Mashrumihir15', amount: '\u20B91,990', method: 'Card', status: 'Success' },
  { id: '#TXN-20260412115743-0030', date: 'Apr 12, 2026', event: 'Tech Summit 2026', customer: 'Mashrumihir15', amount: '\u20B979', method: 'Card', status: 'Success' },
  { id: '#TXN-20260412083649-0029', date: 'Apr 12, 2026', event: 'Jazz Night Live', customer: 'Mashrumihir15', amount: '\u20B955', method: 'Card', status: 'Success' },
  { id: '#TXN-20260411162726-0028', date: 'Apr 11, 2026', event: 'Modern Art Exhibition', customer: 'Mashrumihir15', amount: '\u20B900', method: 'Free', status: 'Free' },
  { id: '#TXN-20260411162645-0027', date: 'Apr 11, 2026', event: 'Mihir Mashru', customer: 'Mashrumihir15', amount: '\u20B900', method: 'Free', status: 'Free' },
  { id: '#TXN-20260411161310-0026', date: 'Apr 11, 2026', event: 'Tech Summit 2026', customer: 'Mashrumihir15', amount: '\u20B9297', method: 'UPI', status: 'Success' },
  { id: '#TXN-20260411161240-0025', date: 'Apr 11, 2026', event: 'Tech Summit 2026', customer: 'Mashrumihir15', amount: '\u20B9297', method: 'UPI', status: 'Success' },
  { id: '#TXN-20260408060526-0024', date: 'Apr 8, 2026', event: 'Tech Summit 2026', customer: 'Mashrumihir15', amount: '\u20B979', method: 'Card', status: 'Success' },
]

export default function Payments() {
  return (
    <div className="org-page-layout">
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Payments</h1>
          <p className="org-page-subtitle">Track all payment transactions and revenue.</p>
        </div>
      </div>

      <div className="pay-stats-grid">
        {STATS.map((stat) => (
          <div key={stat.title} className="pay-stat-card">
            <div className={`pay-icon-box pay-${stat.color}`}>
              {stat.icon}
            </div>
            <div className="pay-stat-copy">
              <span className="pay-lbl">{stat.title}</span>
              <span className="pay-val">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pay-table-shell">
        <div className="pay-table-overflow">
          <table className="pay-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Event</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="pay-id-cell">{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.event}</td>
                  <td>{transaction.customer}</td>
                  <td className="pay-amount-cell">{transaction.amount}</td>
                  <td>{transaction.method}</td>
                  <td>
                    <span className={`pay-status pay-status-${transaction.status.toLowerCase()}`}>{transaction.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
