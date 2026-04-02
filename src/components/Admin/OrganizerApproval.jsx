import React, { useState } from 'react'
import './css/OrganizerApproval.css'

const APPLICATIONS = [
  {
    id: 1,
    name: 'Tech Events Inc',
    email: 'contact@techevents.com',
    appliedDate: '2024-01-15',
    documents: [
      { name: 'Business License', valid: true },
      { name: 'Tax ID', valid: true },
      { name: 'ID Verification', valid: true }
    ]
  },
  {
    id: 2,
    name: 'Music Festival Co',
    email: 'info@musicfest.com',
    appliedDate: '2024-01-18',
    documents: [
      { name: 'Business License', valid: true },
      { name: 'Tax ID', valid: false },
      { name: 'ID Verification', valid: true }
    ]
  }
]

export default function OrganizerApproval() {
  const [activeTab, setActiveTab] = useState('Pending')

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="oa-header-section">
          <div>
            <h2 className="admin-section-title" style={{color: '#1e3a8a'}}>Organizer Approval</h2>
            <p className="admin-section-subtitle">Review and approve organizer applications.</p>
          </div>
        </div>

        <div className="oa-tabs-container">
          <div className="oa-tabs">
            {['Pending', 'Approved', 'Rejected'].map((tab) => (
              <button 
                key={tab}
                className={`oa-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} <span className="oa-tab-count">{tab === 'Pending' ? 2 : 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="oa-grid">
          {APPLICATIONS.map(app => (
            <div key={app.id} className="oa-card">
              <div className="oa-card-header">
                <h3>{app.name}</h3>
                <a href={`mailto:${app.email}`}>{app.email}</a>
              </div>
              
              <div className="oa-card-body">
                <p className="oa-date">Applied: {app.appliedDate}</p>
                
                <h4 className="oa-docs-title">Documents Submitted:</h4>
                <ul className="oa-docs-list">
                  {app.documents.map((doc, idx) => (
                    <li key={idx}>
                      {doc.valid ? (
                        <div className="oa-doc-icon valid">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      ) : (
                        <div className="oa-doc-icon invalid">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </div>
                      )}
                      <span>{doc.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="oa-card-footer">
                <button className="oa-btn-view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </button>
                <div className="oa-action-group">
                  <button className="oa-btn-approve-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button className="oa-btn-reject-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
