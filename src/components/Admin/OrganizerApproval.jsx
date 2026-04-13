import React, { useMemo, useState } from 'react'
import './css/OrganizerApproval.css'

const INITIAL_APPLICATIONS = [
  { id: 1, name: 'Mihir', email: 'mmashru4261@rku.ac.in', status: 'Pending' },
  { id: 2, name: 'Krupansi', email: 'krupansi1@gmail.com', status: 'Pending' },
  { id: 3, name: 'Mihir Mashru', email: 'mashrumihir16@gmail.com', status: 'Pending' },
  { id: 4, name: 'Music Festival Co', email: 'info@musicfest.com', status: 'Approved' },
  { id: 5, name: 'Tech Events Inc', email: 'contact@techevents.com', status: 'Rejected' },
]

const STATUS_TABS = ['Pending', 'Approved', 'Rejected']

export default function OrganizerApproval() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS)
  const [activeTab, setActiveTab] = useState('Pending')
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    status: 'Pending',
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    status: 'Pending',
  })

  const tabCounts = useMemo(
    () =>
      STATUS_TABS.reduce((counts, status) => {
        counts[status] = applications.filter((application) => application.status === status).length
        return counts
      }, {}),
    [applications]
  )

  const filteredApplications = useMemo(
    () =>
      applications.filter((application) => {
        const matchesTab = application.status === activeTab
        const matchesName = application.name.toLowerCase().includes(filters.name.toLowerCase())
        const matchesEmail = application.email.toLowerCase().includes(filters.email.toLowerCase())
        const matchesStatus = !filters.status || application.status === filters.status

        return matchesTab && matchesName && matchesEmail && matchesStatus
      }),
    [activeTab, applications, filters]
  )

  const updateApplicationStatus = (id, status) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application
      )
    )
  }

  const handleCreateOrganizer = () => {
    const trimmedName = createForm.name.trim()
    const trimmedEmail = createForm.email.trim()

    if (!trimmedName || !trimmedEmail) {
      return
    }

    setApplications((current) => [
      {
        id: Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        status: createForm.status,
      },
      ...current,
    ])

    setActiveTab(createForm.status)
    setFilters((current) => ({ ...current, status: createForm.status }))
    setCreateForm({ name: '', email: '', status: 'Pending' })
    setIsCreateModalOpen(false)
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <div className="oa-header-section">
          <div>
            <h2 className="admin-section-title">Organizer Approval</h2>
            <p className="admin-section-subtitle">Review and approve organizer applications.</p>
          </div>
        </div>

        <div className="oa-filter-panel">
          <div className="oa-filter-field">
            <label htmlFor="oa-name">Organization Name</label>
            <input
              id="oa-name"
              type="text"
              value={filters.name}
              onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
            />
          </div>

          <div className="oa-filter-field">
            <label htmlFor="oa-email">Email</label>
            <input
              id="oa-email"
              type="text"
              value={filters.email}
              onChange={(event) => setFilters((current) => ({ ...current, email: event.target.value }))}
            />
          </div>

          <div className="oa-filter-actions">
            <div className="oa-filter-field oa-filter-select">
              <label htmlFor="oa-status">Status</label>
              <select
                id="oa-status"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              >
                {STATUS_TABS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button className="oa-btn-create" type="button" onClick={() => setIsCreateModalOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create
            </button>
          </div>
        </div>

        <div className="oa-tabs-container">
          <div className="oa-tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                className={`oa-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab)
                  setFilters((current) => ({ ...current, status: tab }))
                }}
              >
                {tab} {tabCounts[tab] || 0}
              </button>
            ))}
          </div>
        </div>

        <div className="oa-grid">
          {filteredApplications.map((application) => (
            <article key={application.id} className="oa-card">
              <div className="oa-card-header">
                <div>
                  <h3>{application.name}</h3>
                  <p>{application.email}</p>
                </div>
              </div>

              <div className="oa-card-footer">
                <div className="oa-action-group">
                  <button
                    className="oa-btn-approve-circle"
                    type="button"
                    onClick={() => updateApplicationStatus(application.id, 'Approved')}
                    aria-label={`Approve ${application.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>

                  <button
                    className="oa-btn-reject-circle"
                    type="button"
                    onClick={() => updateApplicationStatus(application.id, 'Rejected')}
                    aria-label={`Reject ${application.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="oa-update-group">
                  <select
                    className="oa-status-select"
                    value={application.status}
                    onChange={(event) => updateApplicationStatus(application.id, event.target.value)}
                  >
                    {STATUS_TABS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    className="oa-btn-update"
                    type="button"
                    onClick={() => updateApplicationStatus(application.id, application.status)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {isCreateModalOpen && (
          <div className="oa-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
            <div className="oa-modal" onClick={(event) => event.stopPropagation()}>
              <div className="oa-modal-header">
                <div>
                  <h3>Create Organizer</h3>
                  <p>Add a new organizer application to the approval queue.</p>
                </div>
                <button className="oa-modal-close" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="oa-modal-grid">
                <div className="oa-filter-field">
                  <label htmlFor="oa-create-name">Organization Name</label>
                  <input
                    id="oa-create-name"
                    type="text"
                    value={createForm.name}
                    onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>

                <div className="oa-filter-field">
                  <label htmlFor="oa-create-email">Email</label>
                  <input
                    id="oa-create-email"
                    type="email"
                    value={createForm.email}
                    onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
                  />
                </div>
              </div>

              <div className="oa-filter-field oa-modal-status">
                <label htmlFor="oa-create-status">Status</label>
                <select
                  id="oa-create-status"
                  value={createForm.status}
                  onChange={(event) => setCreateForm((current) => ({ ...current, status: event.target.value }))}
                >
                  {STATUS_TABS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="oa-modal-actions">
                <button className="oa-btn-cancel" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button className="oa-btn-create" type="button" onClick={handleCreateOrganizer}>
                  Create Organizer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
