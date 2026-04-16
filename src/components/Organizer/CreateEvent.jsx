import { useEffect, useRef, useState } from 'react'
import { FiEdit3, FiMapPin, FiPlusSquare, FiUploadCloud } from 'react-icons/fi'
import './css/CreateEvent.css'
import { createEvent, updateEvent } from '../../services/dataService'

const INITIAL_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  category: '',
  venue: '',
  ticketPrice: '0',
  quantity: '0',
  refundPolicy: '',
}

const CATEGORY_OPTIONS = ['Technology', 'Music', 'Business', 'Arts', 'Sports', 'Food']
const REFUND_POLICIES = ['No Refunds', 'Up to 7 days before event', 'Up to 24 hours before event']

export default function CreateEvent({ currentUser, mode = 'create', eventData = null, onNavigate }) {
  const isEditMode = mode === 'edit'
  const [form, setForm] = useState(INITIAL_FORM)
  const [bannerName, setBannerName] = useState('')
  const [bannerPreview, setBannerPreview] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('draft')
  const bannerInputRef = useRef(null)

  useEffect(() => {
    if (!eventData) {
      setForm(INITIAL_FORM)
      setBannerPreview('')
      setBannerName('')
      setStatus('draft')
      setActionMessage('')
      return
    }

    const eventDate = new Date(eventData.date)

    setForm({
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventDate.toISOString().slice(0, 10),
      time: eventDate.toTimeString().slice(0, 5),
      category: eventData.category || '',
      venue: eventData.venue || '',
      ticketPrice: String(eventData.price || 0),
      quantity: String(eventData.capacity || 0),
      refundPolicy: eventData.refundPolicy || '',
    })
    setBannerPreview(eventData.image || '')
    setBannerName('')
    setStatus(eventData.status || 'draft')
    setActionMessage('')
  }, [eventData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleBannerSelect = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setBannerName(file.name)
    setBannerPreview(URL.createObjectURL(file))
    setActionMessage('Banner uploaded locally. Save the event to persist the record.')
  }

  const submitEvent = async (nextStatus) => {
    if (!currentUser?.id) {
      return
    }

    try {
      setIsSubmitting(true)
      setActionMessage('')

      const payload = {
        organizerId: currentUser.id,
        ...form,
        bannerUrl: bannerPreview,
        status: nextStatus,
      }

      if (isEditMode && eventData?.id) {
        await updateEvent(eventData.id, payload)
      } else {
        await createEvent(payload)
      }

      setStatus(nextStatus)
      setActionMessage(nextStatus === 'published' ? 'Event saved to the database and published.' : 'Draft saved to the database.')

      if (!isEditMode) {
        setForm(INITIAL_FORM)
        setBannerPreview('')
        setBannerName('')
      }
    } catch (submitError) {
      setActionMessage(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mapQuery = form.venue.trim()
    ? `https://www.google.com/maps?q=${encodeURIComponent(form.venue.trim())}&z=15&output=embed`
    : ''

  return (
    <div className="org-page-layout">
      <div className="org-page-header ce-header">
        <div className="ce-header-icon">
          {isEditMode ? <FiEdit3 size={16} strokeWidth={2.25} /> : <FiPlusSquare size={16} strokeWidth={2.25} />}
        </div>
        <div>
          <h1 className="org-page-title">{isEditMode ? 'Edit Event' : 'Create Event'}</h1>
          <p className="org-page-subtitle">Store event records directly in the database.</p>
        </div>
      </div>

      <div className="ce-form-container">
        <section className="ce-section-card">
          <h3 className="ce-section-title">Basic Information</h3>

          <div className="ce-form-group">
            <label htmlFor="event-title">Event Title</label>
            <input id="event-title" name="title" type="text" placeholder="Enter event title" value={form.title} onChange={handleChange} />
          </div>

          <div className="ce-form-group">
            <label htmlFor="event-description">Description</label>
            <textarea id="event-description" name="description" rows="4" placeholder="Describe your event..." value={form.description} onChange={handleChange} />
          </div>

          <div className="ce-grid-2">
            <div className="ce-form-group">
              <label htmlFor="event-date">Date</label>
              <input id="event-date" name="date" type="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="ce-form-group">
              <label htmlFor="event-time">Time</label>
              <input id="event-time" name="time" type="time" value={form.time} onChange={handleChange} />
            </div>
          </div>

          <div className="ce-form-group">
            <label htmlFor="event-category">Category</label>
            <select id="event-category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="ce-section-card">
          <h3 className="ce-section-title">Location</h3>

          <div className="ce-form-group">
            <label htmlFor="event-venue">Venue Address</label>
            <input id="event-venue" name="venue" type="text" placeholder="Enter venue address" value={form.venue} onChange={handleChange} />
          </div>

          <div className="ce-map-preview">
            {mapQuery ? (
              <iframe className="ce-map-frame" src={mapQuery} title="Venue map preview" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <>
                <FiMapPin size={22} />
                <p>Enter venue address to preview map</p>
              </>
            )}
          </div>
        </section>

        <section className="ce-section-card">
          <h3 className="ce-section-title">Media</h3>

          <div className="ce-form-group">
            <label>Event Banner Upload</label>
            <button className="ce-upload-box" onClick={() => bannerInputRef.current?.click()} type="button">
              <div className="ce-upload-placeholder">
                <div className="ce-upload-icon">
                  <FiUploadCloud size={18} />
                </div>
                <p className="ce-upload-main">{bannerName || 'Click to upload or drag and drop'}</p>
                <p className="ce-upload-sub">{bannerName ? 'Banner ready to replace' : 'PNG, JPG or WEBP (max. 2MB)'}</p>
              </div>

              {bannerPreview ? <img className="ce-banner-preview" src={bannerPreview} alt={bannerName || form.title || 'Event banner preview'} /> : null}
            </button>
            <input ref={bannerInputRef} className="ce-hidden-input" type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleBannerSelect} />
          </div>
        </section>

        <section className="ce-section-card">
          <h3 className="ce-section-title">Ticket Configuration</h3>

          <div className="ce-grid-2">
            <div className="ce-form-group">
              <label htmlFor="ticket-price">Ticket Price (\u20B9)</label>
              <input id="ticket-price" name="ticketPrice" type="number" min="0" placeholder="0" value={form.ticketPrice} onChange={handleChange} />
            </div>

            <div className="ce-form-group">
              <label htmlFor="ticket-quantity">Available Quantity</label>
              <input id="ticket-quantity" name="quantity" type="number" min="0" placeholder="0" value={form.quantity} onChange={handleChange} />
            </div>
          </div>

          <div className="ce-form-group">
            <label htmlFor="refund-policy">Refund Policy</label>
            <select id="refund-policy" name="refundPolicy" value={form.refundPolicy} onChange={handleChange}>
              <option value="">Select refund policy</option>
              {REFUND_POLICIES.map((policy) => (
                <option key={policy} value={policy}>{policy}</option>
              ))}
            </select>
          </div>
        </section>

        <div className="ce-actions">
          {isEditMode ? (
            <button className="ce-btn-draft" onClick={() => onNavigate?.('manageEvents')} type="button">Cancel</button>
          ) : null}
          <button className="ce-btn-draft" onClick={() => submitEvent('draft')} type="button" disabled={isSubmitting}>
            {isSubmitting && status === 'draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button className="ce-btn-publish" onClick={() => submitEvent('published')} type="button" disabled={isSubmitting}>
            {isSubmitting && status === 'published' ? 'Saving...' : isEditMode ? 'Update Event' : 'Publish Event'}
          </button>
        </div>

        {actionMessage ? <p className="ce-status-message">{actionMessage}</p> : null}
      </div>
    </div>
  )
}
