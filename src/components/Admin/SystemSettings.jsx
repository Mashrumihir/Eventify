import React, { useState } from 'react'
import './css/SystemSettings.css'

const CATEGORIES = [
  {
    id: 1,
    title: 'Technology',
    description: 'Tech conferences and workshops',
    events: 45,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 2,
    title: 'Music',
    description: 'Concerts and music festivals',
    events: 32,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  },
  {
    id: 3,
    title: 'Sports',
    description: 'Sports events and championships',
    events: 28,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  },
  {
    id: 4,
    title: 'Arts',
    description: 'Art exhibitions and cultural events',
    events: 19,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
  }
]

const CMS_PAGES = [
  { id: 1, title: 'About Us', path: '/about', updated: '2024-01-15' },
  { id: 2, title: 'Privacy Policy', path: '/privacy', updated: '2024-01-12' },
  { id: 3, title: 'Terms & Conditions', path: '/terms', updated: '2024-01-10' },
  { id: 4, title: 'FAQ', path: '/faq', updated: '2024-01-08' }
]

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('Categories')

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="ss-header-section">
          <div>
            <h2 className="admin-section-title" style={{color: '#1e3a8a'}}>System Settings</h2>
            <p className="admin-section-subtitle">Configure platform settings and manage content.</p>
          </div>
        </div>

        <div className="ss-controls-container">
          <div className="ss-tabs">
            <button 
              className={`ss-tab-btn ${activeTab === 'Categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('Categories')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Categories
            </button>
            <button 
              className={`ss-tab-btn ${activeTab === 'Financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('Financial')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Financial
            </button>
            <button 
              className={`ss-tab-btn ${activeTab === 'CMS Pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('CMS Pages')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              CMS Pages
            </button>
          </div>
          {activeTab === 'Categories' && (
            <button className="ss-btn-add">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Category
            </button>
          )}
        </div>

        {activeTab === 'Categories' && (
          <div className="ss-grid">
            {CATEGORIES.map(category => (
              <div key={category.id} className="ss-card">
                <div className="ss-card-header">
                  <div className="ss-card-icon">
                    {category.icon}
                  </div>
                  <div className="ss-card-actions">
                    <button className="ss-action-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="ss-action-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
                <div className="ss-card-body">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
                <div className="ss-card-footer">
                  <span>Events</span>
                  <span className="ss-events-count">{category.events}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Financial' && (
          <div className="ss-financial-container">
            <div className="ss-form-card">
              <div className="ss-card-header-horizontal">
                <div className="ss-card-icon financial-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                </div>
                <div>
                  <h3>Commission Settings</h3>
                  <p>Set platform commission rate</p>
                </div>
              </div>
              <div className="ss-form-group">
                <label>Platform Commission (%)</label>
                <div className="ss-input-wrapper">
                  <input type="text" />
                  <button className="ss-btn-save">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save
                  </button>
                </div>
                <span className="ss-help-text">Current commission: 15% per booking</span>
              </div>
            </div>

            <div className="ss-form-card">
              <div className="ss-card-header-horizontal">
                <div className="ss-card-icon financial-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <h3>Tax Settings</h3>
                  <p>Configure tax rates</p>
                </div>
              </div>
              <div className="ss-form-group">
                <label>Default Tax Rate (%)</label>
                <div className="ss-input-wrapper">
                  <input type="text" />
                  <button className="ss-btn-save">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save
                  </button>
                </div>
                <span className="ss-help-text">Current tax rate: 8.5% applied to bookings</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'CMS Pages' && (
          <div className="ss-cms-grid">
            {CMS_PAGES.map(page => (
              <div key={page.id} className="ss-cms-card">
                <div className="ss-cms-body">
                  <div className="ss-cms-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <div className="ss-cms-info">
                    <h3>{page.title}</h3>
                    <p>{page.path}</p>
                  </div>
                </div>
                <div className="ss-cms-footer">
                  <span className="ss-cms-date">Updated: {page.updated}</span>
                  <button className="ss-cms-btn-edit">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
