function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function buildInvoicePrintMarkup(invoice) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Tax Invoice ${escapeHtml(invoice.bookingId)}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 28px;
          font-family: Arial, sans-serif;
          background: #eef4ff;
          color: #16325f;
        }
        .invoice-shell {
          max-width: 1020px;
          margin: 0 auto;
          background: #eef4ff;
          border: 1px solid #d7e3f6;
          border-radius: 28px;
          padding: 18px;
        }
        .banner {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
          padding: 18px 22px 20px;
          color: #fff;
          background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
          border-radius: 22px 22px 0 0;
        }
        .banner-kicker {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.9;
        }
        .banner h1 {
          margin: 0;
          font-size: 26px;
          line-height: 1.05;
        }
        .banner p {
          margin: 8px 0 0;
          font-size: 13px;
        }
        .banner-meta {
          text-align: right;
          padding-top: 4px;
        }
        .banner-meta span {
          display: block;
        }
        .banner-meta .label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.85;
        }
        .banner-meta .value {
          margin-top: 4px;
          font-size: 14px;
          font-weight: 800;
        }
        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) 260px;
          gap: 20px;
          background: #ffffff;
          padding: 20px;
        }
        .event-card, .summary-card, .billing-card {
          border: 1px solid #cfe0fb;
          border-radius: 18px;
        }
        .event-card {
          background: #f8fbff;
          padding: 16px;
        }
        .event-image {
          width: 100%;
          height: 220px;
          border-radius: 16px;
          object-fit: cover;
          display: block;
        }
        .event-title {
          margin: 18px 0;
          font-size: 22px;
          font-weight: 900;
        }
        .details {
          display: grid;
          gap: 14px;
        }
        .detail-row {
          display: grid;
          grid-template-columns: 104px minmax(0, 1fr);
          gap: 12px;
          font-size: 12px;
        }
        .detail-row .label {
          font-weight: 800;
        }
        .detail-row .value {
          color: #607796;
        }
        .summary-card {
          background: #2d53b1;
          color: #fff;
          padding: 16px 18px;
        }
        .summary-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.9;
        }
        .summary-amount {
          display: block;
          margin-top: 10px;
          font-size: 28px;
          font-weight: 900;
        }
        .divider {
          height: 1px;
          margin: 16px 0;
          background: rgba(255,255,255,0.2);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 13px;
        }
        .summary-row strong {
          font-weight: 800;
        }
        .billing-card {
          margin-top: 22px;
          padding: 18px 20px;
          background: #f8fbff;
          display: flex;
          justify-content: space-between;
          gap: 24px;
        }
        .billing-card h3 {
          margin: 0 0 14px;
          font-size: 16px;
          font-weight: 900;
        }
        .billing-name {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 800;
        }
        .billing-text {
          display: block;
          color: #607796;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .footer-note {
          margin: 14px 4px 4px;
          color: #607796;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 0;
            background: #fff;
          }
          .invoice-shell {
            border: none;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-shell">
        <div class="banner">
          <div>
            <p class="banner-kicker">Tax Invoice</p>
            <h1>Payment Successful</h1>
            <p>Your Eventify booking is confirmed and your tax invoice is ready.</p>
          </div>
          <div class="banner-meta">
            <span class="label">Invoice ID</span>
            <span class="value">${escapeHtml(invoice.invoiceId)}</span>
          </div>
        </div>

        <div class="main-grid">
          <section class="event-card">
            <img class="event-image" src="${escapeHtml(invoice.image)}" alt="${escapeHtml(invoice.eventTitle)}" />
            <h2 class="event-title">${escapeHtml(invoice.eventTitle)}</h2>
            <div class="details">
              <div class="detail-row"><span class="label">Booking ID</span><span class="value">${escapeHtml(invoice.bookingId)}</span></div>
              <div class="detail-row"><span class="label">Date</span><span class="value">${escapeHtml(invoice.eventDate)}</span></div>
              <div class="detail-row"><span class="label">Time</span><span class="value">${escapeHtml(invoice.eventTime)}</span></div>
              <div class="detail-row"><span class="label">Venue</span><span class="value">${escapeHtml(invoice.venue)}</span></div>
            </div>
          </section>

          <aside class="summary-card">
            <span class="summary-label">Total Paid</span>
            <span class="summary-amount">${escapeHtml(invoice.totalPaid)}</span>
            <div class="divider"></div>
            <div class="summary-row"><span>Ticket</span><strong>${escapeHtml(invoice.ticketType)}</strong></div>
            <div class="summary-row"><span>Qty</span><strong>${escapeHtml(invoice.quantity)}</strong></div>
            <div class="summary-row"><span>Method</span><strong>${escapeHtml(invoice.paymentMethod)}</strong></div>
            <div class="summary-row"><span>Tax</span><strong>${escapeHtml(invoice.tax)}</strong></div>
          </aside>
        </div>

        <div class="billing-card">
          <div>
            <h3>Bill To</h3>
            <span class="billing-name">${escapeHtml(invoice.billedToName)}</span>
            <span class="billing-text">${escapeHtml(invoice.billedToEmail)}</span>
          </div>
          <div>
            <span class="billing-name">${escapeHtml(invoice.billedToPhone)}</span>
            <span class="billing-text">${escapeHtml(invoice.billedToAddress)}</span>
          </div>
        </div>

        <p class="footer-note">Show this booking ID at the venue entrance if needed.</p>
      </div>
      <script>
        window.addEventListener('load', () => {
          window.print();
        });
      </script>
    </body>
  </html>`
}
