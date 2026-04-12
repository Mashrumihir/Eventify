import './css/Payments.css'

const SUMMARY_CARDS = [
  {
    label: 'Total Paid',
    value: '\u20B91,363.00',
    icon: (
      <span aria-hidden="true" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
        ₹
      </span>
    ),
  },
  {
    label: 'Successful Transactions',
    value: '9',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: 'Free Bookings',
    value: '8',
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

const TRANSACTIONS = [
  {
    transactionId: '#TXN-20260412115743-0030',
    bookingId: 'EVT 20260412115743 001',
    date: '12 Apr 2026, 5:27 PM',
    event: 'Tech Summit 2026',
    ticket: 'Early Bird',
    quantity: '1',
    amount: '\u20B979.00',
    method: 'Card',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260412083649-0029',
    bookingId: 'EVT 20260412083648 007',
    date: '12 Apr 2026, 2:06 PM',
    event: 'Jazz Night Live',
    ticket: 'Regular',
    quantity: '1',
    amount: '\u20B955.00',
    method: 'Card',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260411162726-0028',
    bookingId: 'FR 20260411162726 003',
    date: '11 Apr 2026, 9:57 PM',
    event: 'Modern Art Exhibition',
    ticket: 'Regular',
    quantity: '1',
    amount: '\u20B90.00',
    method: 'Free',
    status: 'Free',
  },
  {
    transactionId: '#TXN-20260411162645-0027',
    bookingId: 'EVT 20260411162645 009',
    date: '11 Apr 2026, 9:56 PM',
    event: 'Mihir Mashru',
    ticket: 'Regular',
    quantity: '1',
    amount: '\u20B90.00',
    method: 'Free',
    status: 'Free',
  },
  {
    transactionId: '#TXN-20260411161310-0026',
    bookingId: 'EVT 20260411161310 001',
    date: '11 Apr 2026, 9:43 PM',
    event: 'Tech Summit 2026',
    ticket: 'Regular',
    quantity: '3',
    amount: '\u20B9297.00',
    method: 'UPI',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260411161240-0025',
    bookingId: 'EVT 20260411161240 001',
    date: '11 Apr 2026, 9:42 PM',
    event: 'Tech Summit 2026',
    ticket: 'Regular',
    quantity: '3',
    amount: '\u20B9297.00',
    method: 'UPI',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260408060052-0024',
    bookingId: 'EVT 20260408060526 001',
    date: '08 Apr 2026, 11:35 AM',
    event: 'Tech Summit 2026',
    ticket: 'Early Bird',
    quantity: '1',
    amount: '\u20B979.00',
    method: 'Card',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260408060017-0023',
    bookingId: 'EVT 20260408060016 001',
    date: '08 Apr 2026, 11:30 AM',
    event: 'Tech Summit 2026',
    ticket: 'VIP',
    quantity: '1',
    amount: '\u20B9199.00',
    method: 'Card',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260407074112-0022',
    bookingId: 'EVT 20260407074112 001',
    date: '07 Apr 2026, 1:11 PM',
    event: 'Tech Summit 2026',
    ticket: 'Early Bird',
    quantity: '1',
    amount: '\u20B979.00',
    method: 'Card',
    status: 'Success',
  },
  {
    transactionId: '#TXN-20260407073807-0021',
    bookingId: 'EVT 20260407073807 001',
    date: '07 Apr 2026, 1:08 PM',
    event: 'Tech Summit 2026',
    ticket: 'Early Bird',
    quantity: '1',
    amount: '\u20B979.00',
    method: 'Card',
    status: 'Success',
  },
]

function PaymentRow({ payment }) {
  return (
    <tr>
      <td className="att-pay-transaction-cell">
        <strong className="att-pay-transaction-id">{payment.transactionId}</strong>
        <span className="att-pay-booking-id">{payment.bookingId}</span>
      </td>
      <td>{payment.date}</td>
      <td>{payment.event}</td>
      <td>{payment.ticket}</td>
      <td>{payment.quantity}</td>
      <td className="att-pay-amount">{payment.amount}</td>
      <td>{payment.method}</td>
      <td>
        <span className={`att-pay-status ${payment.status === 'Free' ? 'is-free' : 'is-success'}`}>
          {payment.status}
        </span>
      </td>
    </tr>
  )
}

export default function Payments() {
  return (
    <div className="att-pay-page">
      <header className="att-pay-header">
        <h1 className="att-pay-title">Payments</h1>
        <p className="att-pay-subtitle">All your booking payment records from database.</p>
      </header>

      <section className="att-pay-stats">
        {SUMMARY_CARDS.map((item) => (
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
              {TRANSACTIONS.map((payment) => (
                <PaymentRow key={payment.transactionId} payment={payment} />
              ))}
            </tbody>
          </table>
        </div>

        <footer className="att-pay-footer">
          <p className="att-pay-footer-note">Showing 1-10 of 17 payments</p>
          <div className="att-pay-pagination">
            <button type="button">Previous</button>
            <span>Page 1 / 2</span>
            <button type="button">Next</button>
          </div>
        </footer>
      </section>
    </div>
  )
}
