export const DEFAULT_INVOICE = {
  invoiceId: 'INV-20260412-0029',
  bookingId: 'EVT-20260412083648-007',
  eventTitle: 'Jazz Night Live',
  eventDate: 'July 12, 2026',
  eventTime: '8:00 PM - 5:00 AM',
  venue: 'Hemu Gadhvi Hall, Rajkot',
  ticketType: 'Regular',
  quantity: '1',
  paymentMethod: 'Card',
  subtotal: '\u20B955.00',
  tax: '\u20B90.00',
  totalPaid: '\u20B955.00',
  billedToName: 'Eventify User',
  billedToEmail: 'user@eventify.com',
  billedToPhone: '+91 98765 43210',
  billedToAddress: 'Rajkot, Gujarat, India',
  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
}

const ACTIVE_INVOICE_STORAGE_KEY = 'eventify-active-invoice'

export function createInvoiceFromBooking(booking) {
  return {
    ...DEFAULT_INVOICE,
    bookingId: booking.id,
    invoiceId: `INV-${booking.id}`,
    eventTitle: booking.title,
    eventDate: booking.date,
    eventTime: booking.time,
    venue: booking.location,
    ticketType: booking.accessType.replace(' Access', ''),
    quantity: booking.purchaseStr.split(' x ')[0] || '1',
    totalPaid: booking.price,
    subtotal: booking.price,
    image: booking.image,
  }
}

export function setActiveInvoiceFromBooking(booking, user) {
  const invoice = {
    ...createInvoiceFromBooking(booking),
    billedToName: user?.name || DEFAULT_INVOICE.billedToName,
    billedToEmail: user?.email || DEFAULT_INVOICE.billedToEmail,
  }

  window.localStorage.setItem(ACTIVE_INVOICE_STORAGE_KEY, JSON.stringify(invoice))
  return invoice
}

export function setActiveInvoiceFromCheckout({ booking, eventData, user }) {
  const eventDate = eventData?.date ? new Date(eventData.date) : null
  const ticketLabel = booking?.ticketType
    ? `${booking.ticketType.charAt(0).toUpperCase()}${booking.ticketType.slice(1)}`
    : DEFAULT_INVOICE.ticketType
  const totalPaid = `\u20B9${Number(booking?.totalAmount || 0).toFixed(2)}`

  const invoice = {
    ...DEFAULT_INVOICE,
    bookingId: booking?.id || DEFAULT_INVOICE.bookingId,
    invoiceId: booking?.id ? `INV-${booking.id}` : DEFAULT_INVOICE.invoiceId,
    eventTitle: eventData?.title || DEFAULT_INVOICE.eventTitle,
    eventDate: eventDate
      ? eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : DEFAULT_INVOICE.eventDate,
    eventTime: eventDate
      ? eventDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
      : DEFAULT_INVOICE.eventTime,
    venue: eventData?.location || eventData?.venue || DEFAULT_INVOICE.venue,
    ticketType: ticketLabel,
    quantity: String(booking?.quantity || DEFAULT_INVOICE.quantity),
    subtotal: totalPaid,
    totalPaid,
    billedToName: user?.name || DEFAULT_INVOICE.billedToName,
    billedToEmail: user?.email || DEFAULT_INVOICE.billedToEmail,
    image: eventData?.image || DEFAULT_INVOICE.image,
  }

  window.localStorage.setItem(ACTIVE_INVOICE_STORAGE_KEY, JSON.stringify(invoice))
  return invoice
}

export function getActiveInvoice() {
  const storedInvoice = window.localStorage.getItem(ACTIVE_INVOICE_STORAGE_KEY)

  if (!storedInvoice) {
    return DEFAULT_INVOICE
  }

  try {
    return JSON.parse(storedInvoice)
  } catch {
    window.localStorage.removeItem(ACTIVE_INVOICE_STORAGE_KEY)
    return DEFAULT_INVOICE
  }
}
