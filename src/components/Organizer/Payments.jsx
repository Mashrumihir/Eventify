import { useEffect, useMemo, useState } from 'react'
import './css/Payments.css'
import { fetchOrganizerPayments } from '../../services/dataService'

function formatMoney(value) {
  return `\u20B9${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function normalizeStatus(status) {
  if (!status) return 'pending'
  return status === 'success' ? 'success' : status
}

export default function Payments({ currentUser }) {
  const [data, setData] = useState({
    summary: {
      totalRevenue: 0,
      pendingPayouts: 0,
      successfulTransactions: 0,
      refundRequests: 0,
    },
    transactions: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPayments() {
      if (!currentUser?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchOrganizerPayments(currentUser.id)

        if (isMounted) {
          setData(response)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load organizer payments.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPayments()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const stats = useMemo(() => [
    {
      title: 'Total Revenue',
      value: formatMoney(data.summary.totalRevenue),
      icon: <span>{'\u20B9'}</span>,
      color: 'green',
    },
    {
      title: 'Pending Payouts',
      value: formatMoney(data.summary.pendingPayouts),
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
      value: String(data.summary.successfulTransactions || 0),
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
      value: String(data.summary.refundRequests || 0),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 3.36-7.03" />
          <polyline points="3 3 3 9 9 9" />
        </svg>
      ),
      color: 'red',
    },
  ], [data.summary])

  return (
    <div className="org-page-layout">
      <div className="org-page-header manage-header">
        <div>
          <h1 className="org-page-title">Payments</h1>
          <p className="org-page-subtitle">Track real payment transactions and revenue from your events.</p>
        </div>
      </div>

      {error ? <p className="me-status-message">{error}</p> : null}

      <div className="pay-stats-grid">
        {stats.map((stat) => (
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
                <th>Qty</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8">Loading payment records...</td>
                </tr>
              ) : data.transactions.map((transaction) => {
                const status = normalizeStatus(transaction.status)

                return (
                  <tr key={transaction.id}>
                    <td className="pay-id-cell">{transaction.transactionId}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.event}</td>
                    <td>{transaction.customer}</td>
                    <td>{transaction.quantity}</td>
                    <td className="pay-amount-cell">{formatMoney(transaction.amount)}</td>
                    <td>{transaction.method === 'manual' ? 'Card' : transaction.method}</td>
                    <td>
                      <span className={`pay-status pay-status-${status}`}>{status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && !data.transactions.length ? (
          <div className="pay-empty-state">
            <h3>No transactions found</h3>
            <p>Payment records will appear here after bookings are completed.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
