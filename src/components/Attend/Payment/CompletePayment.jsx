import { useMemo, useState } from 'react'
import { processPayment } from '../../../services/dataService'
import { setActiveInvoiceFromCheckout } from '../js/invoiceData'
import './CompletePayment.css'

function formatMoney(value) {
  return `\u20B9${Number(value || 0).toFixed(2)}`
}

function formatEventDate(value) {
  if (!value) return 'Date to be announced'

  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTicketLabel(value) {
  if (!value) return 'Regular'

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

const PAYMENT_METHODS = [
  { id: 'card', title: 'Credit / Debit Card', note: 'Visa, Mastercard, Amex' },
  { id: 'upi', title: 'UPI', note: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', title: 'Net Banking', note: 'All major banks' },
  { id: 'wallet', title: 'Wallet', note: 'Paytm, Amazon Pay' },
]

export default function CompletePayment({ booking, eventData, currentUser, onNavigate }) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const summary = useMemo(() => {
    const ticketType = formatTicketLabel(booking?.ticketType)
    const total = Number(booking?.totalAmount || 0)

    return {
      eventTitle: eventData?.title || 'Event Booking',
      date: formatEventDate(eventData?.date),
      venue: eventData?.location || eventData?.venue || 'Online',
      ticketType,
      quantity: Number(booking?.quantity || 1),
      subtotal: total,
      discount: 0,
      total,
    }
  }, [booking, eventData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handlePaymentSubmit = async () => {
    if (!booking?.id || !currentUser?.id) {
      setError('Booking details are missing. Please start again.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await processPayment({
        bookingId: booking.id,
        userId: currentUser.id,
        amount: booking.totalAmount,
        paymentMethod,
      })

      setActiveInvoiceFromCheckout({
        booking,
        eventData,
        user: currentUser,
      })

      onNavigate?.('paymentSuccess')
    } catch (paymentError) {
      setError(paymentError.message || 'Payment failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="cp-page">
      <div className="cp-main">
        <button className="cp-back" onClick={() => onNavigate?.('eventDetails', { eventData })} type="button">
          &larr; Back to Event Details
        </button>

        <header className="cp-header">
          <h1>Complete Your Payment</h1>
          <p>Secure payment powered by Eventify</p>
        </header>

        <section className="cp-panel">
          <h2>Select Payment Method</h2>
          <div className="cp-method-grid">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                className={`cp-method ${paymentMethod === method.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(method.id)}
                type="button"
              >
                <strong>{method.title}</strong>
                <span>{method.note}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="cp-panel">
          <h2>Card Details</h2>
          <div className="cp-form">
            <label>
              Card Number
              <input
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={handleChange}
                inputMode="numeric"
              />
            </label>
            <label>
              Cardholder Name
              <input
                name="cardholderName"
                placeholder="Name on card"
                value={form.cardholderName}
                onChange={handleChange}
              />
            </label>
            <div className="cp-form-row">
              <label>
                Expiry Date
                <input
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={form.expiryDate}
                  onChange={handleChange}
                />
              </label>
              <label>
                CVV
                <input
                  name="cvv"
                  placeholder="123"
                  value={form.cvv}
                  onChange={handleChange}
                  inputMode="numeric"
                />
              </label>
            </div>
          </div>
        </section>

        <p className="cp-secure-note">Your payment information is encrypted and secure. We do not store your card details.</p>
      </div>

      <aside className="cp-summary">
        <h2>Order Summary</h2>
        <h3>{summary.eventTitle}</h3>
        <div className="cp-summary-meta">
          <span>{summary.date}</span>
          <span>{summary.venue}</span>
          <span>{summary.ticketType}</span>
          <span>Quantity: {summary.quantity}</span>
        </div>
        <div className="cp-line-items">
          <div>
            <span>{summary.ticketType} x {summary.quantity}</span>
            <strong>{formatMoney(summary.subtotal)}</strong>
          </div>
          <div>
            <span>Discount (0%)</span>
            <strong className="cp-discount">-{formatMoney(summary.discount)}</strong>
          </div>
        </div>
        <div className="cp-total">
          <span>Total</span>
          <strong>{formatMoney(summary.total)}</strong>
        </div>

        {error ? <p className="cp-error">{error}</p> : null}

        <button className="cp-pay-btn" onClick={handlePaymentSubmit} disabled={isSubmitting} type="button">
          {isSubmitting ? 'Processing...' : `Pay ${formatMoney(summary.total)}`}
        </button>
        <p className="cp-terms">By completing this purchase you agree to our Terms of Service.</p>
      </aside>
    </div>
  )
}
