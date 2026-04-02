import React from 'react'
import './css/Payments.css'

const STATS = [
  {
    title: 'Total Revenue',
    value: '₹45,231',
    change: '+12.5%',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    color: 'emerald' // Green looking
  },
  {
    title: 'Pending Payouts',
    value: '₹8,420',
    change: '+5.2%',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    color: 'yellow' // Yellow
  },
  {
    title: 'Successful Transactions',
    value: '1,234',
    change: '+8.2%',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    color: 'blue' // Blue
  },
  {
    title: 'Refund Requests',
    value: '12',
    change: '-2.1%',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, // Mock icon for refund
    color: 'red' // Red
  }
]

const TRANSACTIONS = [
  { id: '#TXN001234', date: 'Dec 15, 2024', event: 'Tech Conference 2024', customer: 'Rahul Sharma', amount: '₹199', method: 'Credit Card', status: '' },
  { id: '#TXN001235', date: 'Dec 14, 2024', event: 'Music Festival', customer: 'Priya Patel', amount: '₹89', method: 'UPI', status: '' },
  { id: '#TXN001236', date: 'Dec 13, 2024', event: 'Startup Summit', customer: 'Amit Kumar', amount: '₹357', method: 'Debit Card', status: '' },
  { id: '#TXN001237', date: 'Dec 12, 2024', event: 'Food & Wine Expo', customer: 'Sneha Gupta', amount: '₹299', method: 'Net Banking', status: '' },
  { id: '#TXN001238', date: 'Dec 11, 2024', event: 'Art Workshop', customer: 'Vikram Singh', amount: '₹149', method: 'UPI', status: '' }
]

export default function Payments() {
  return (
    <div className="org-page-layout">
      {/* Header */}
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Payments</h1>
          <p className="org-page-subtitle">Track all payment transactions and revenue.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="pay-stats-grid">
        {STATS.map((stat, idx) => (
          <div key={idx} className="pay-stat-card">
            <div className="pay-stat-top">
              <div className={`pay-icon-box bg-${stat.color}-light text-${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`pay-stat-change ${stat.change.startsWith('+') ? 'text-green' : 'text-red'}`}>
                {stat.change}
              </span>
            </div>
            <div className="pay-stat-bot">
               <span className="pay-lbl">{stat.title}</span>
               <span className="pay-val">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="pay-table-card">
        <h3 className="pay-table-title">Recent Transactions</h3>
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
              {TRANSACTIONS.map((txn, idx) => (
                <tr key={idx}>
                  <td className="font-bold">{txn.id}</td>
                  <td className="text-secondary">{txn.date}</td>
                  <td className="font-medium text-primary">{txn.event}</td>
                  <td className="text-secondary">{txn.customer}</td>
                  <td className="font-bold text-primary">{txn.amount}</td>
                  <td className="text-secondary">{txn.method}</td>
                  <td>{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
