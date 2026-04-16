import { useEffect, useMemo, useState } from 'react'
import './css/OrganizerApproval.css'
import {
  createOrganizerApplication,
  fetchOrganizerApplications,
  updateOrganizerApplication,
} from '../../services/dataService'

const STATUS_TABS = ['pending', 'approved', 'rejected']

export default function OrganizerApproval() {
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    status: 'pending',
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    status: 'pending',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadApplications() {
      try {
        setError('')
        const response = await fetchOrganizerApplications()

        if (isMounted) {
          setApplications(response.applications)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      }
    }

    loadApplications()
    return () => {
      isMounted = false
    }
  }, [])

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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrganizerApplication(id, status)
      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status } : application
        )
      )
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  const handleCreateOrganizer = async () => {
    try {
      const response = await createOrganizerApplication(createForm)
      setApplications((current) => [response.application, ...current])
      setActiveTab(createForm.status)
      setFilters((current) => ({ ...current, status: createForm.status }))
      setCreateForm({ name: '', email: '', status: 'pending' })
      setIsCreateModalOpen(false)
    } catch (createError) {
      setError(createError.message)
    }
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage organizer applications from the database.</p>
      </div>

      <div className="admin-content-area">
        <div className="oa-header-section">
          <div>
            <h2 className="admin-section-title">Organizer Approval</h2>
            <p className="admin-section-subtitle">Review and approve organizer applications.</p>
          </div>
        </div>

        {error ? <p className="me-status-message">{error}</p> : null}

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
                  <button className="oa-btn-approve-circle" type="button" onClick={() => handleStatusUpdate(application.id, 'approved')}>
                    Approve
                  </button>

                  <button className="oa-btn-reject-circle" type="button" onClick={() => handleStatusUpdate(application.id, 'rejected')}>
                    Reject
                  </button>
                </div>

                <div className="oa-update-group">
                  <select
                    className="oa-status-select"
                    value={application.status}
                    onChange={(event) => handleStatusUpdate(application.id, event.target.value)}
                  >
                    {STATUS_TABS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
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

                <div className="oa-filter-field">
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
              </div>

              <div className="oa-update-group">
                <button className="oa-btn-update" type="button" onClick={handleCreateOrganizer}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
