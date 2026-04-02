import { useState } from 'react'
import './css/Payment.css'

export default function Payment({ onNavigate }) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [selectedWallet, setSelectedWallet] = useState('Paytm')

  // Icons mapping for DRYer code
  const icons = {
    back: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    card: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    upi: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    bank: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M12 2v8"/><polygon points="4 10 12 2 20 10 4 10"/></svg>,
    wallet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 6H2V20H22V6Z"/><path d="M22 10H18C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14H22"/></svg>,
    lock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    ticket: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>
  }

  // Payment form contents based on selected method
  const renderPaymentForm = () => {
    switch(paymentMethod) {
      case 'card':
        return (
          <div className="pay-form">
            <h3 className="pay-form-title">Card Details</h3>
            <div className="pay-form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="pay-form-group">
              <label>Cardholder Name</label>
              <input type="text" placeholder="Abc" />
            </div>
            <div className="pay-form-row">
              <div className="pay-form-group" style={{ flex: 1 }}>
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div className="pay-form-group" style={{ flex: 1 }}>
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
          </div>
        )
      case 'upi':
        return (
          <div className="pay-form">
            <h3 className="pay-form-title">Enter UPI ID</h3>
            <div className="pay-form-group">
              <input type="text" placeholder="yourname@upi" />
            </div>
          </div>
        )
      case 'netbanking':
        return (
          <div className="pay-form">
            <h3 className="pay-form-title">Select Your Bank</h3>
            <div className="pay-form-group">
              <select defaultValue="">
                <option value="" disabled>Select a bank</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
              </select>
            </div>
          </div>
        )
      case 'wallet':
        return (
          <div className="pay-form">
            <h3 className="pay-form-title">Select Wallet</h3>
            <div className="pay-wallet-options">
              <button 
                className={`pay-wallet-btn ${selectedWallet === 'Paytm' ? 'active paytm' : ''}`}
                onClick={() => setSelectedWallet('Paytm')}
              >
                Paytm
              </button>
              <button 
                className={`pay-wallet-btn ${selectedWallet === 'Amazon Pay' ? 'active amazon' : ''}`}
                onClick={() => setSelectedWallet('Amazon Pay')}
              >
                Amazon Pay
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="payment-layout">
      {/* ── Left Column: Payment Details ── */}
      <div className="pay-main-col">
        {/* Header */}
        <div className="pay-header-section">
          <button className="pay-back-btn" onClick={() => onNavigate('eventDetails')}>
             {icons.back} Back to Event Details
          </button>
          <h1 className="pay-title">Complete Your Payment</h1>
          <p className="pay-subtitle">Secure payment powered by Eventify</p>
        </div>

        {/* Method Selector */}
        <div className="pay-card">
          <h2 className="pay-card-title">Select Payment Method</h2>
          <div className="pay-method-grid">
            <div 
              className={`pay-method-option ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="pay-method-icon">{icons.card}</div>
              <div className="pay-method-text">
                <span className="pm-title">Credit / Debit Card</span>
                <span className="pm-desc">Visa, Mastercard, Amex</span>
              </div>
            </div>

            <div 
              className={`pay-method-option ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <div className="pay-method-icon">{icons.upi}</div>
              <div className="pay-method-text">
                <span className="pm-title">UPI</span>
                <span className="pm-desc">Pay using UPI ID</span>
              </div>
            </div>

            <div 
              className={`pay-method-option ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <div className="pay-method-icon">{icons.bank}</div>
              <div className="pay-method-text">
                <span className="pm-title">Net Banking</span>
                <span className="pm-desc">All major banks</span>
              </div>
            </div>

            <div 
              className={`pay-method-option ${paymentMethod === 'wallet' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <div className="pay-method-icon">{icons.wallet}</div>
              <div className="pay-method-text">
                <span className="pm-title">Wallet</span>
                <span className="pm-desc">PayTM, PhonePe, GPay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Form Content */}
        {renderPaymentForm()}

        {/* Security Notice */}
        <div className="pay-secure-notice">
          <span className="sec-icon">{icons.lock}</span>
          <p>Your payment information is encrypted and secure. We do not store your card details.</p>
        </div>
      </div>

      {/* ── Right Column: Order Summary ── */}
      <div className="pay-sidebar-col">
        <div className="pay-summary-card">
          <h2 className="pay-summary-title">Order Summary</h2>
          
          <div className="pay-summary-event">
            <h3 className="pay-event-title">Tech Summit 2026</h3>
            <div className="pay-event-meta">
              <span>{icons.calendar} February 28, 2026</span>
              <span>{icons.pin} Rajkot, hemu gadhvi hall</span>
              <span>{icons.ticket} Regular Ticket</span>
            </div>
          </div>

          <div className="pay-summary-divider"></div>

          <div className="pay-summary-cost">
            <div className="pay-cost-row">
              <span className="pay-cost-label">Regular Ticket × 2</span>
              <span className="pay-cost-val">₹198.00</span>
            </div>
            <div className="pay-cost-row pay-discount">
              <span className="pay-cost-label">Discount (10%)</span>
              <span className="pay-cost-val">-₹19.80</span>
            </div>
          </div>

          <div className="pay-summary-divider"></div>

          <div className="pay-summary-total">
            <span>Total</span>
            <span className="pay-total-val">₹178.20</span>
          </div>

          <button className="pay-btn" onClick={() => onNavigate('paymentSuccess')}>
            Pay ₹178.20
          </button>
          
          <p className="pay-terms">
            By completing this purchase you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
