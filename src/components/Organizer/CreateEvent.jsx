import React, { useState } from 'react'
import './css/CreateEvent.css'

export default function CreateEvent() {
  const [ticketType, setTicketType] = useState('Free')

  return (
    <div className="org-page-layout">
      {/* Header */}
      <div className="org-page-header">
        <div className="org-header-icon bg-blue-100 text-blue-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div>
          <h1 className="org-page-title">Create Event</h1>
          <p className="org-page-subtitle">Fill in the details to create a new event.</p>
        </div>
      </div>

      <div className="ce-form-container">
        {/* Section 1: Basic Information */}
        <div className="ce-section-card">
          <h3 className="ce-section-title">Basic Information</h3>
          <div className="ce-form-group">
            <label>Event Title</label>
            <input type="text" placeholder="Enter event title" />
          </div>
          <div className="ce-form-group">
            <label>Description</label>
            <textarea rows="4" placeholder="Describe your event..."></textarea>
          </div>
          <div className="ce-grid-2">
            <div className="ce-form-group">
              <label>Date</label>
              <div className="ce-input-icon">
                <input type="text" placeholder="mm/dd/yyyy" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
            <div className="ce-form-group">
              <label>Time</label>
              <div className="ce-input-icon">
                <input type="text" placeholder="--:-- --" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
          </div>
          <div className="ce-form-group">
            <label>Category</label>
            <select>
               <option>Select a category</option>
               <option>Technology</option>
               <option>Music</option>
               <option>Business</option>
               <option>Art</option>
            </select>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="ce-section-card">
          <h3 className="ce-section-title">Location</h3>
          <div className="ce-form-group">
            <label>Venue Address</label>
            <input type="text" placeholder="Enter venue address" />
          </div>
          <div className="ce-map-preview">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p>Map Preview - Interactive map would appear here</p>
          </div>
        </div>

        {/* Section 3: Media */}
        <div className="ce-section-card">
          <h3 className="ce-section-title">Media</h3>
          <div className="ce-form-group">
            <label>Event Banner Upload</label>
            <div className="ce-upload-box">
              <div className="ce-upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p className="ce-upload-main">Click to upload or drag and drop</p>
              <p className="ce-upload-sub">PNG, JPG or WEBP (max. 2MB)</p>
            </div>
          </div>
          <div className="ce-form-group">
            <label>Gallery Images Upload</label>
            <div className="ce-upload-box">
              <div className="ce-upload-icon bg-gray">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <p className="ce-upload-main">Upload multiple images</p>
              <p className="ce-upload-sub">Up to 10 images (max. 2MB each)</p>
            </div>
          </div>
        </div>

        {/* Section 4: Ticket Configuration */}
        <div className="ce-section-card">
          <h3 className="ce-section-title">Ticket Configuration</h3>
          <div className="ce-form-group">
            <label>Ticket Type</label>
            <div className="ce-ticket-type-tabs">
              <button 
                className={ticketType === 'Free' ? 'active' : ''} 
                onClick={() => setTicketType('Free')}
              >Free</button>
              <button 
                className={ticketType === 'Paid' ? 'active' : ''} 
                onClick={() => setTicketType('Paid')}
              >Paid</button>
              <button 
                className={ticketType === 'VIP' ? 'active' : ''} 
                onClick={() => setTicketType('VIP')}
              >VIP</button>
            </div>
          </div>

          <div className="ce-grid-2">
            <div className="ce-form-group">
              <label>Ticket Price (₹)</label>
              <input type="number" placeholder="0" />
            </div>
            <div className="ce-form-group">
              <label>Available Quantity</label>
              <input type="number" placeholder="0" />
            </div>
          </div>

          <div className="ce-form-group-flex">
            <label>Early Bird Discount</label>
            <div className="ce-toggle">
              <div className="ce-toggle-knob"></div>
            </div>
          </div>

          <div className="ce-form-group">
            <label>Early Bird Price (₹)</label>
            <input type="number" placeholder="0" disabled />
          </div>

          <div className="ce-form-group">
            <label>Refund Policy</label>
            <select>
              <option>Select refund policy</option>
              <option>No Refunds</option>
              <option>Up to 7 days before event</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="ce-actions">
          <button className="ce-btn-draft">Save as Draft</button>
          <button className="ce-btn-publish">Publish Event</button>
        </div>
      </div>
    </div>
  )
}
