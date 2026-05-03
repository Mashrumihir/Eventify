import { useEffect, useState } from 'react'
import './css/Payments.css'
import { fetchAttendeePayments, processPayment } from '../../services/dataService'

function formatMoney(value) {
  return `\u20B9${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getPaymentStatusLabel(status, amount) {
  if (Number(amount || 0) === 0) {
    return 'Free'
  }

  return status === 'success' ? 'Success' : status
}

function PaymentRow({ payment }) {
  const statusLabel = getPaymentStatusLabel(payment.status, payment.amount)

  return (
    <tr>
      <td className="att-pay-transaction-cell">
        <strong className="att-pay-transaction-id">#{payment.transactionId}</strong>
        <span className="att-pay-booking-id">{payment.bookingId}</span>
      </td>
      <td>{formatDateTime(payment.date)}</td>
      <td>{payment.event}</td>
      <td>{payment.ticket}</td>
      <td>{payment.quantity}</td>
      <td className="att-pay-amount">{formatMoney(payment.amount)}</td>
      <td>{payment.method === 'manual' ? 'Card' : payment.method}</td>
      <td>
        <span className={`att-pay-status ${statusLabel === 'Free' ? 'is-free' : 'is-success'}`}>
          {statusLabel}
        </span>
      </td>
    </tr>
  )
}

export default function Payments({ currentUser, onNavigate, booking, eventData }) {
  const [summary, setSummary] = useState({
    totalPaid: 0,
    successfulTransactions: 0,
    freeBookings: 0,
  })
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const isCheckoutMode = Boolean(booking)

  useEffect(() => {
    let isMounted = true

    async function loadPayments() {
      if (!currentUser?.id) {
        if (isMounted) {
          setTransactions([])
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetchAttendeePayments(currentUser.id)

        if (isMounted) {
          setSummary(response.summary || {})
          setTransactions(response.transactions || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load payments.')
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

  const handlePayment = async () => {
    if (!booking || !currentUser?.id) return

    setIsProcessingPayment(true)
    setError('')

    try {
      const payload = {
        bookingId: booking.id,
        userId: currentUser.id,
        amount: booking.totalAmount,
        paymentMethod: 'manual',
      }

      const response = await processPayment(payload)
      console.log('Payment processed:', response)

      setPaymentSuccess(true)
      setTimeout(() => {
        onNavigate?.('paymentSuccess')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to process payment.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (isCheckoutMode && paymentSuccess) {
    return (
      <div className="att-pay-page">
        <div className="att-pay-success">
          <div className="att-pay-success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. Redirecting...</p>
        </div>
      </div>
    )
  }

  if (isCheckoutMode) {
    return (
      <div className="att-pay-page">
        <header className="att-pay-header">
          <h1 className="att-pay-title">Complete Payment</h1>
          <p className="att-pay-subtitle">Review your booking and proceed with payment.</p>
        </header>

        <div className="att-pay-checkout-card">
          <div className="att-pay-booking-summary">
            <h3>Booking Summary</h3>
            <div className="att-pay-booking-detail">
              <span>Event:</span>
              <strong>{eventData?.title || 'Tech Conference 2026'}</strong>
            </div>
            <div className="att-pay-booking-detail">
              <span>Ticket Type:</span>
              <strong>{booking?.ticketType?.charAt(0).toUpperCase() + booking?.ticketType?.slice(1)}</strong>
            </div>
            <div className="att-pay-booking-detail">
              <span>Quantity:</span>
              <strong>{booking?.quantity}</strong>
            </div>
            <div className="att-pay-booking-detail att-pay-total">
              <span>Total Amount:</span>
              <strong>{formatMoney(booking?.totalAmount)}</strong>
            </div>
          </div>

          <div className="att-pay-methods">
            <h3>Payment Method</h3>
            <div className="att-pay-method-option att-pay-method-selected">
              <span className="att-pay-method-icon">💳</span>
              <span>Credit/Debit Card (Demo)</span>
            </div>
          </div>

          {error && (
            <div className="att-pay-error">
              {error}
            </div>
          )}

          <button
            className="att-pay-btn-primary"
            onClick={handlePayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? 'Processing...' : `Pay ${formatMoney(booking?.totalAmount)}`}
          </button>

          <button
            className="att-pay-btn-secondary"
            onClick={() => onNavigate?.('eventDetails')}
            disabled={isProcessingPayment}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const summaryCards = [
    {
      label: 'Total Paid',
      value: formatMoney(summary.totalPaid),
      icon: (
        <span aria-hidden="true" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
          ₹
        </span>
      ),
    },
    {
      label: 'Successful Transactions',
      value: String(summary.successfulTransactions || 0),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: 'Free Bookings',
      value: String(summary.freeBookings || 0),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8.5V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5a2.5 2.5 0 0 0 0 5V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a2.5 2.5 0 0 0 0-5z" />
          <path d="M9 9.5h.01" />
          <path d="M9 13.5h.01" />
          <path d="M15 9.5h.01" />
          <path d="M15 13.5h.01" />
        </svg>
      ),
    },
  ]

  return (
    <div className="att-pay-page">
      <header className="att-pay-header">
        <h1 className="att-pay-title">Payments</h1>
        <p className="att-pay-subtitle">All your booking payment records from database.</p>
      </header>

      <section className="att-pay-stats">
        {summaryCards.map((item) => (
          <article key={item.label} className="att-pay-stat-card">
            <div className="att-pay-stat-top">
              <span className="att-pay-stat-label">{item.label}</span>
              <span className="att-pay-stat-icon">{item.icon}</span>
            </div>
            <strong className="att-pay-stat-value">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="att-pay-table-card">
        {error ? <p className="att-pay-footer-note">{error}</p> : null}
        <div className="att-pay-table-wrap">
          <table className="att-pay-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date</th>
                <th>Event</th>
                <th>Ticket</th>
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
              ) : transactions.map((payment) => (
                <PaymentRow key={payment.transactionId} payment={payment} />
              ))}
            </tbody>
          </table>
        </div>

        <footer className="att-pay-footer">
          <p className="att-pay-footer-note">Showing {transactions.length} payment record(s)</p>
        </footer>
      </section>
    </div>
  )
}
