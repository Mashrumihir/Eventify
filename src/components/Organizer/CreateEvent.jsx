import React, { useEffect, useRef, useState } from 'react'
import { FiEdit3, FiMapPin, FiPlusSquare, FiUploadCloud } from 'react-icons/fi'
import './css/CreateEvent.css'

const INITIAL_FORM = {
  title: '',
  description: '',
  date: '2026-04-12',
  time: '',
  category: '',
  venue: '',
  ticketPrice: '0',
  quantity: '0',
  earlyBirdEnabled: false,
  earlyBirdPrice: '0',
  refundPolicy: '',
}

const DEFAULT_EVENT_STATE = {
  ...INITIAL_FORM,
  ticketType: 'Free',
  bannerPreview: '',
}

const CATEGORY_OPTIONS = ['Technology', 'Music', 'Business', 'Art', 'Sports', 'Food']
const REFUND_POLICIES = ['No Refunds', 'Up to 7 days before event', 'Up to 24 hours before event']
const TICKET_TYPES = ['Free', 'Paid', 'VIP']

export default function CreateEvent({ mode = 'create', eventData = null, onNavigate }) {
  const isEditMode = mode === 'edit'
  const normalizedEvent = eventData ? { ...DEFAULT_EVENT_STATE, ...eventData } : DEFAULT_EVENT_STATE
  const [ticketType, setTicketType] = useState(normalizedEvent.ticketType)
  const [form, setForm] = useState({ ...INITIAL_FORM, ...normalizedEvent })
  const [bannerName, setBannerName] = useState('')
  const [bannerPreview, setBannerPreview] = useState(normalizedEvent.bannerPreview || '')
  const [actionMessage, setActionMessage] = useState('')
  const bannerInputRef = useRef(null)

  useEffect(() => {
    const nextEvent = eventData ? { ...DEFAULT_EVENT_STATE, ...eventData } : DEFAULT_EVENT_STATE

    setTicketType(nextEvent.ticketType)
    setForm({ ...INITIAL_FORM, ...nextEvent })
    setBannerName('')
    setBannerPreview(nextEvent.bannerPreview || '')
    setActionMessage('')
  }, [eventData, mode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleTicketTypeChange = (type) => {
    setTicketType(type)
    setForm((current) => ({
      ...current,
      ticketPrice: type === 'Free' ? '0' : current.ticketPrice === '0' ? '' : current.ticketPrice,
    }))
  }

  const handleBannerSelect = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setBannerName(file.name)
    setBannerPreview(URL.createObjectURL(file))
    setActionMessage('Banner uploaded successfully.')
  }

  const handleDraft = () => {
    setActionMessage(isEditMode ? 'Updated draft saved successfully.' : 'Event saved as draft.')
  }

  const handlePublish = () => {
    setActionMessage(isEditMode ? 'Event updated successfully.' : 'Event published successfully.')
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
          <p className="org-page-subtitle">
            {isEditMode ? 'Update your event details.' : 'Fill in the details to create a new event.'}
          </p>
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
            <textarea id="event-description" name="description" rows="4" placeholder="Describe your event..." value={form.description} onChange={handleChange}></textarea>
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
              <iframe
                className="ce-map-frame"
                src={mapQuery}
                title="Venue map preview"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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

              {bannerPreview ? (
                <img className="ce-banner-preview" src={bannerPreview} alt={bannerName || form.title || 'Event banner preview'} />
              ) : null}
            </button>
            <input ref={bannerInputRef} className="ce-hidden-input" type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleBannerSelect} />
          </div>
        </section>

        <section className="ce-section-card">
          <h3 className="ce-section-title">Ticket Configuration</h3>

          <div className="ce-ticket-type-tabs">
            {TICKET_TYPES.map((type) => (
              <button
                key={type}
                className={ticketType === type ? 'active' : ''}
                onClick={() => handleTicketTypeChange(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>

          <div className="ce-grid-2">
            <div className="ce-form-group">
              <label htmlFor="ticket-price">Ticket Price (₹)</label>
              <input
                id="ticket-price"
                name="ticketPrice"
                type="number"
                min="0"
                placeholder="0"
                value={ticketType === 'Free' ? '0' : form.ticketPrice}
                onChange={handleChange}
                disabled={ticketType === 'Free'}
              />
            </div>

            <div className="ce-form-group">
              <label htmlFor="ticket-quantity">Available Quantity</label>
              <input id="ticket-quantity" name="quantity" type="number" min="0" placeholder="0" value={form.quantity} onChange={handleChange} />
            </div>
          </div>

          <div className="ce-form-group-flex">
            <label htmlFor="early-bird-toggle">Early Bird Discount</label>
            <button
              id="early-bird-toggle"
              className={`ce-toggle ${form.earlyBirdEnabled ? 'is-on' : ''}`}
              onClick={() => setForm((current) => ({ ...current, earlyBirdEnabled: !current.earlyBirdEnabled }))}
              type="button"
            >
              <div className="ce-toggle-knob"></div>
            </button>
          </div>

          <div className="ce-form-group">
            <label htmlFor="early-bird-price">Early Bird Price (₹)</label>
            <input
              id="early-bird-price"
              name="earlyBirdPrice"
              type="number"
              min="0"
              placeholder="0"
              value={form.earlyBirdPrice}
              onChange={handleChange}
              disabled={!form.earlyBirdEnabled}
            />
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
          <button className="ce-btn-draft" onClick={handleDraft} type="button">Save as Draft</button>
          <button className="ce-btn-publish" onClick={handlePublish} type="button">
            {isEditMode ? 'Update Event' : 'Publish Event'}
          </button>
        </div>

        {actionMessage ? <p className="ce-status-message">{actionMessage}</p> : null}
      </div>
    </div>
  )
}
