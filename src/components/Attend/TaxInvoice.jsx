import './css/TaxInvoice.css'
import { DEFAULT_INVOICE as invoice } from './js/invoiceData'

export default function TaxInvoice({ onNavigate }) {
  return (
    <div className="ti-layout">
      <div className="ti-card">
        <div className="ti-banner">
          <div>
            <p className="ti-banner-kicker">Tax Invoice</p>
            <h1 className="ti-title">Payment Successful</h1>
            <p className="ti-subtitle">Your Eventify booking is confirmed and your invoice is ready to review.</p>
          </div>
          <div className="ti-banner-meta">
            <span className="ti-meta-label">Invoice ID</span>
            <span className="ti-meta-value">{invoice.invoiceId}</span>
          </div>
        </div>

        <div className="ti-main-grid">
          <section className="ti-event-card">
            <div className="ti-image-wrap">
              <img src={invoice.image} alt={invoice.eventTitle} className="ti-image" />
            </div>

            <div className="ti-event-copy">
              <h2 className="ti-event-title">{invoice.eventTitle}</h2>

              <div className="ti-detail-list">
                <div className="ti-detail-row">
                  <span className="ti-detail-label">Booking ID</span>
                  <span className="ti-detail-value">{invoice.bookingId}</span>
                </div>
                <div className="ti-detail-row">
                  <span className="ti-detail-label">Date</span>
                  <span className="ti-detail-value">{invoice.eventDate}</span>
                </div>
                <div className="ti-detail-row">
                  <span className="ti-detail-label">Time</span>
                  <span className="ti-detail-value">{invoice.eventTime}</span>
                </div>
                <div className="ti-detail-row">
                  <span className="ti-detail-label">Venue</span>
                  <span className="ti-detail-value">{invoice.venue}</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="ti-summary-card">
            <span className="ti-summary-label">TOTAL PAID</span>
            <span className="ti-summary-amount">{invoice.totalPaid}</span>
            <div className="ti-summary-divider" />

            <div className="ti-summary-row">
              <span>Ticket</span>
              <strong>{invoice.ticketType}</strong>
            </div>
            <div className="ti-summary-row">
              <span>Qty</span>
              <strong>{invoice.quantity}</strong>
            </div>
            <div className="ti-summary-row">
              <span>Method</span>
              <strong>{invoice.paymentMethod}</strong>
            </div>
            <div className="ti-summary-row">
              <span>Tax</span>
              <strong>{invoice.tax}</strong>
            </div>
          </aside>
        </div>

        <div className="ti-billing-card">
          <div className="ti-billing-block">
            <h3 className="ti-section-title">Bill To</h3>
            <strong className="ti-billing-name">{invoice.billedToName}</strong>
            <span className="ti-billing-text">{invoice.billedToEmail}</span>
          </div>
          <div className="ti-billing-block ti-billing-block-right">
            <strong className="ti-billing-name">{invoice.billedToPhone}</strong>
            <span className="ti-billing-text">{invoice.billedToAddress}</span>
          </div>
        </div>

        <div className="ti-footer-bar">
          <p className="ti-footer-note">Show this booking ID at the venue entrance if needed.</p>
          <div className="ti-footer-actions">
            <button className="ti-btn ti-btn-secondary" onClick={() => onNavigate?.('bookings')} type="button">
              Back to Bookings
            </button>
            <button className="ti-btn ti-btn-primary" onClick={() => onNavigate?.('paymentSuccess')} type="button">
              View Success Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
