import { useState } from 'react'
import './css/PaymentSuccess.css'
import { DEFAULT_INVOICE } from './js/invoiceData'

const ticketDetails = {
  ...DEFAULT_INVOICE,
  imageUrl: DEFAULT_INVOICE.image,
}

function buildShareText() {
  return [
    'My Eventify ticket is confirmed.',
    `Event: ${ticketDetails.eventTitle}`,
    `Booking ID: ${ticketDetails.bookingId}`,
    `Date: ${ticketDetails.eventDate}`,
    `Time: ${ticketDetails.eventTime}`,
    `Venue: ${ticketDetails.venue}`,
    `Ticket: ${ticketDetails.ticketType} x${ticketDetails.quantity}`,
    `Paid: ${ticketDetails.totalPaid}`,
  ].join('\n')
}

async function loadTicketImage() {
  try {
    const response = await fetch(ticketDetails.imageUrl)

    if (!response.ok) {
      return null
    }

    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)

    return await new Promise((resolve) => {
      const image = new Image()

      image.onload = () => {
        URL.revokeObjectURL(imageUrl)
        resolve(image)
      }

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        resolve(null)
      }

      image.src = imageUrl
    })
  } catch {
    return null
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function fitImage(image, frameWidth, frameHeight) {
  const scale = Math.max(frameWidth / image.width, frameHeight / image.height)
  const width = image.width * scale
  const height = image.height * scale

  return {
    width,
    height,
    x: (frameWidth - width) / 2,
    y: (frameHeight - height) / 2,
  }
}

function drawPair(ctx, label, value, x, y, valueX) {
  ctx.fillStyle = '#12305f'
  ctx.font = '700 14px Arial'
  ctx.fillText(label, x, y)
  ctx.fillStyle = '#4f6487'
  ctx.font = '400 14px Arial'
  ctx.fillText(value, valueX, y)
}

function drawLabeledValue(ctx, label, value, x, y, options = {}) {
  const {
    labelColor = '#ffffff',
    valueColor = '#ffffff',
    valueX = x + 250,
  } = options

  ctx.fillStyle = labelColor
  ctx.font = '400 17px Arial'
  ctx.fillText(label, x, y)
  ctx.fillStyle = valueColor
  ctx.font = '700 17px Arial'
  ctx.fillText(value, valueX, y)
}

async function createInvoicePreviewJpeg() {
  const canvas = document.createElement('canvas')
  canvas.width = 1190
  canvas.height = 1010

  const ctx = canvas.getContext('2d')
  const image = await loadTicketImage()

  const page = {
    x: 26,
    y: 26,
    width: 1100,
    height: 930,
  }
  const header = {
    x: 26,
    y: 26,
    width: 1100,
    height: 132,
  }
  const contentTop = 182
  const cardGap = 24
  const leftCard = {
    x: 64,
    y: contentTop,
    width: 540,
    height: 474,
  }
  const rightCard = {
    x: leftCard.x + leftCard.width + cardGap,
    y: contentTop,
    width: 452,
    height: 474,
  }
  const billCard = {
    x: 64,
    y: leftCard.y + leftCard.height + 28,
    width: 992,
    height: 126,
  }
  const footerY = billCard.y + billCard.height + 24

  ctx.fillStyle = '#eef4ff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  roundedRect(ctx, page.x, page.y, page.width, page.height, 30)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  const headerGradient = ctx.createLinearGradient(header.x, header.y, header.x + header.width, header.y)
  headerGradient.addColorStop(0, '#2563eb')
  headerGradient.addColorStop(1, '#38bdf8')
  roundedRect(ctx, header.x, header.y, header.width, header.height, 24)
  ctx.fillStyle = headerGradient
  ctx.fill()
  ctx.fillRect(header.x, header.y + header.height - 40, header.width, 40)

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 14px Arial'
  ctx.fillText('TAX INVOICE', 72, 60)
  ctx.font = '700 38px Arial'
  ctx.fillText('Payment Successful', 72, 94)
  ctx.font = '600 16px Arial'
  ctx.fillText('Your Eventify booking is confirmed and ready to save as a PDF.', 72, 126)
  ctx.textAlign = 'right'
  ctx.font = '700 13px Arial'
  ctx.fillText('INVOICE ID', header.x + header.width - 72, 66)
  ctx.font = '800 16px Arial'
  ctx.fillText(ticketDetails.invoiceId, header.x + header.width - 72, 92)
  ctx.textAlign = 'left'

  roundedRect(ctx, leftCard.x, leftCard.y, leftCard.width, leftCard.height, 24)
  ctx.fillStyle = '#f7faff'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#cfe0fb'
  ctx.stroke()

  roundedRect(ctx, rightCard.x, rightCard.y, rightCard.width, rightCard.height, 24)
  ctx.fillStyle = '#2d53b1'
  ctx.fill()

  roundedRect(ctx, billCard.x, billCard.y, billCard.width, billCard.height, 18)
  ctx.fillStyle = '#f7faff'
  ctx.fill()
  ctx.strokeStyle = '#cfe0fb'
  ctx.stroke()

  const imageFrame = {
    x: leftCard.x + 28,
    y: leftCard.y + 24,
    width: leftCard.width - 56,
    height: 234,
  }

  roundedRect(ctx, imageFrame.x, imageFrame.y, imageFrame.width, imageFrame.height, 18)
  ctx.save()
  ctx.clip()

  if (image) {
    const fit = fitImage(image, imageFrame.width, imageFrame.height)
    ctx.drawImage(image, imageFrame.x + fit.x, imageFrame.y + fit.y, fit.width, fit.height)
  } else {
    const imageGradient = ctx.createLinearGradient(imageFrame.x, imageFrame.y, imageFrame.x + imageFrame.width, imageFrame.y + imageFrame.height)
    imageGradient.addColorStop(0, '#dbeafe')
    imageGradient.addColorStop(1, '#bfdbfe')
    ctx.fillStyle = imageGradient
    ctx.fillRect(imageFrame.x, imageFrame.y, imageFrame.width, imageFrame.height)
    ctx.fillStyle = '#5b6f95'
    ctx.font = '700 28px Arial'
    ctx.fillText('Event Image', imageFrame.x + 128, imageFrame.y + 128)
  }

  ctx.restore()

  const detailStartY = imageFrame.y + imageFrame.height + 42
  const labelX = leftCard.x + 28
  const valueX = leftCard.x + 170

  ctx.fillStyle = '#12305f'
  ctx.font = '700 26px Arial'
  ctx.fillText(ticketDetails.eventTitle, labelX, detailStartY)

  drawPair(ctx, 'Booking ID', ticketDetails.bookingId, labelX, detailStartY + 54, valueX)
  drawPair(ctx, 'Date', ticketDetails.eventDate, labelX, detailStartY + 100, valueX)
  drawPair(ctx, 'Time', ticketDetails.eventTime, labelX, detailStartY + 146, valueX)
  drawPair(ctx, 'Venue', ticketDetails.venue, labelX, detailStartY + 192, valueX)

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 15px Arial'
  ctx.fillText('TOTAL PAID', rightCard.x + 36, rightCard.y + 32)
  ctx.font = '700 54px Arial'
  ctx.fillText(ticketDetails.totalPaid, rightCard.x + 36, rightCard.y + 104)

  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(rightCard.x + 36, rightCard.y + 138)
  ctx.lineTo(rightCard.x + rightCard.width - 36, rightCard.y + 138)
  ctx.stroke()

  drawLabeledValue(ctx, 'Ticket', ticketDetails.ticketType, rightCard.x + 36, rightCard.y + 192, {
    valueX: rightCard.x + rightCard.width - 88,
  })
  drawLabeledValue(ctx, 'Qty', ticketDetails.quantity, rightCard.x + 36, rightCard.y + 246, {
    valueX: rightCard.x + rightCard.width - 52,
  })
  drawLabeledValue(ctx, 'Method', ticketDetails.paymentMethod, rightCard.x + 36, rightCard.y + 300, {
    valueX: rightCard.x + rightCard.width - 110,
  })
  drawLabeledValue(ctx, 'Tax', ticketDetails.tax, rightCard.x + 36, rightCard.y + 354, {
    valueX: rightCard.x + rightCard.width - 72,
  })

  ctx.fillStyle = '#12305f'
  ctx.font = '700 24px Arial'
  ctx.fillText('Bill To', billCard.x + 28, billCard.y + 38)
  ctx.font = '700 18px Arial'
  ctx.fillText(ticketDetails.billedToName, billCard.x + 28, billCard.y + 80)
  ctx.font = '400 16px Arial'
  ctx.fillStyle = '#5d7295'
  ctx.fillText(ticketDetails.billedToEmail, billCard.x + 28, billCard.y + 108)
  ctx.fillText(ticketDetails.billedToPhone, billCard.x + 650, billCard.y + 80)
  ctx.fillText(ticketDetails.billedToAddress, billCard.x + 650, billCard.y + 108)

  ctx.fillStyle = '#5d7295'
  ctx.font = '400 14px Arial'
  ctx.fillText('Show this booking ID at the venue entrance if needed.', 64, footerY)

  return await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95)
  })
}

function getJpegDimensions(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null
  }

  let offset = 2

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = bytes[offset + 1]

    if (marker === 0xd9 || marker === 0xda) {
      break
    }

    const blockLength = (bytes[offset + 2] << 8) + bytes[offset + 3]

    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        width: (bytes[offset + 7] << 8) + bytes[offset + 8],
        height: (bytes[offset + 5] << 8) + bytes[offset + 6],
      }
    }

    offset += blockLength + 2
  }

  return null
}

function buildPdfBlob(imageAsset) {
  const encoder = new TextEncoder()
  const parts = [encoder.encode('%PDF-1.4\n')]
  const offsets = [0]
  const pdfHeight = 842
  const targetWidth = 555
  const targetHeight = (imageAsset.height / imageAsset.width) * targetWidth
  const imageX = 20
  const imageY = (pdfHeight - targetHeight) / 2
  const contentStream = `q\n${targetWidth} 0 0 ${targetHeight.toFixed(2)} ${imageX} ${imageY.toFixed(2)} cm\n/Im1 Do\nQ`
  const objectCount = 7

  const pushString = (value) => {
    parts.push(encoder.encode(value))
  }

  const currentLength = () => parts.reduce((sum, part) => sum + part.length, 0)

  const stringObjects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /XObject << /Im1 7 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${encoder.encode(contentStream).length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj\n<< >>\nendobj\n',
    '6 0 obj\n<< >>\nendobj\n',
  ]

  stringObjects.forEach((object) => {
    offsets.push(currentLength())
    pushString(object)
  })

  offsets.push(currentLength())
  pushString(
    `7 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageAsset.width} /Height ${imageAsset.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageAsset.bytes.length} >>\nstream\n`
  )
  parts.push(imageAsset.bytes)
  pushString('\nendstream\nendobj\n')

  const xrefOffset = currentLength()
  pushString(`xref\n0 ${objectCount + 1}\n`)
  pushString('0000000000 65535 f \n')
  offsets.slice(1).forEach((offset) => {
    pushString(`${String(offset).padStart(10, '0')} 00000 n \n`)
  })
  pushString(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`)

  return new Blob(parts, { type: 'application/pdf' })
}

async function createTicketPdfBlob() {
  const invoiceJpeg = await createInvoicePreviewJpeg()
  const bytes = new Uint8Array(await invoiceJpeg.arrayBuffer())
  const dimensions = getJpegDimensions(bytes)

  if (!dimensions) {
    throw new Error('Unable to create invoice preview image.')
  }

  return buildPdfBlob({
    bytes,
    width: dimensions.width,
    height: dimensions.height,
  })
}

async function downloadTicketPdf() {
  const pdfBlob = await createTicketPdfBlob()
  const fileName = `${ticketDetails.bookingId}.pdf`
  const objectUrl = URL.createObjectURL(pdfBlob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = fileName
  link.click()

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 1000)

  return { pdfBlob, fileName }
}

export default function PaymentSuccess({ onNavigate }) {
  const [actionMessage, setActionMessage] = useState('')

  const handleFooterNavigate = (page) => {
    if (typeof onNavigate === 'function') {
      onNavigate(page)
    }
  }

  const handleDownloadPdf = async () => {
    await downloadTicketPdf()
    setActionMessage('Tax invoice downloaded successfully.')
  }

  const handleShareTicket = async () => {
    const shareText = buildShareText()
    const pdfBlob = await createTicketPdfBlob()
    const fileName = `${ticketDetails.bookingId}.pdf`

    try {
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' })

      if (navigator.canShare?.({ files: [pdfFile] }) && navigator.share) {
        await navigator.share({
          title: `${ticketDetails.eventTitle} Ticket`,
          text: shareText,
          files: [pdfFile],
        })
        setActionMessage('Tax invoice shared successfully.')
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
        setActionMessage('Tax invoice downloaded. Ticket details copied to clipboard for sharing.')
        return
      }
    } catch {
      setActionMessage('Sharing was cancelled.')
      return
    }

    setActionMessage('Sharing is not available in this browser.')
  }

  return (
    <div className="ps-layout">
      <div className="ps-card">
        <div className="ps-header">
          <div className="ps-check-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="ps-title">Payment Successful!</h1>
          <p className="ps-subtitle">Your booking has been confirmed and your invoice is ready.</p>
          <div className="ps-booking-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="16" y2="11" />
              <line x1="8" y1="15" x2="13" y2="15" />
            </svg>
            <span>Booking ID: {ticketDetails.bookingId}</span>
          </div>
        </div>

        <div className="ps-summary-shell">
          <div className="ps-event-box">
            <div className="ps-event-img-wrap">
              <img
                src={ticketDetails.imageUrl}
                alt={ticketDetails.eventTitle}
                className="ps-event-img"
              />
            </div>
            <div className="ps-event-info">
              <h2 className="ps-event-title">{ticketDetails.eventTitle}</h2>
              <div className="ps-meta-grid">
                <div className="ps-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{ticketDetails.eventDate}</span>
                </div>
                <div className="ps-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{ticketDetails.eventTime}</span>
                </div>
                <div className="ps-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{ticketDetails.venue}</span>
                </div>
                <div className="ps-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="10" rx="2" />
                    <path d="M8 7v10" />
                    <path d="M16 7v10" />
                  </svg>
                  <span>{ticketDetails.ticketType}</span>
                </div>
                <div className="ps-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Quantity: {ticketDetails.quantity}</span>
                </div>
              <div className="ps-meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="7" y1="15" x2="10" y2="15" />
                </svg>
                <span>{ticketDetails.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ps-paid-box">
          <span className="ps-paid-label">TOTAL PAID</span>
          <span className="ps-paid-value">{ticketDetails.totalPaid}</span>
          <div className="ps-paid-rows">
            <div className="ps-paid-row">
              <span>Ticket</span>
              <span>{ticketDetails.ticketType}</span>
            </div>
              <div className="ps-paid-row">
                <span>Qty</span>
                <span>{ticketDetails.quantity}</span>
              </div>
            <div className="ps-paid-row">
              <span>Method</span>
              <span>{ticketDetails.paymentMethod}</span>
            </div>
            <div className="ps-paid-row">
              <span>Tax</span>
              <span>{ticketDetails.tax}</span>
            </div>
          </div>
        </div>
        </div>

        <div className="ps-actions">
          <button className="ps-btn-primary" onClick={handleDownloadPdf} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Tax Invoice
          </button>
          <button className="ps-btn-outline" onClick={handleShareTicket} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Ticket
          </button>
        </div>

        {actionMessage ? <p className="ps-action-message">{actionMessage}</p> : null}

        <div className="ps-nav-links">
          <button onClick={() => handleFooterNavigate('bookings')} type="button">View My Bookings</button>
          <span className="ps-nav-sep">|</span>
          <button onClick={() => handleFooterNavigate('payments')} type="button">View Payments</button>
          <span className="ps-nav-sep">|</span>
          <button onClick={() => handleFooterNavigate('browse')} type="button">Browse More Events</button>
          <span className="ps-nav-sep">|</span>
          <button onClick={() => handleFooterNavigate('dashboard')} type="button">Go to Dashboard</button>
        </div>
      </div>
    </div>
  )
}
