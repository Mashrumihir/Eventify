import React, { useMemo, useState } from 'react'
import './css/SystemSettings.css'

const INITIAL_CATEGORIES = [
  {
    id: 1,
    title: 'Technology',
    description: 'Tech conferences and workshops',
    events: 45,
    iconClass: 'bi-pc-display'
  },
  {
    id: 2,
    title: 'Music',
    description: 'Concerts and music festivals',
    events: 32,
    iconClass: 'bi-music-note-beamed'
  },
  {
    id: 3,
    title: 'Sports',
    description: 'Sports events and championships',
    events: 28,
    iconClass: 'bi-dribbble'
  },
  {
    id: 4,
    title: 'Food',
    description: 'Food event',
    events: 25,
    iconClass: 'bi-basket'
  },
  {
    id: 5,
    title: 'Arts',
    description: 'Art exhibitions and cultural events',
    events: 19,
    iconClass: 'bi-palette-fill'
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
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    eventCount: '0',
    description: '',
    iconClass: 'bi-tag',
  })

  const modalTitle = useMemo(
    () => (editingCategoryId ? 'Edit Category' : 'Add Category'),
    [editingCategoryId]
  )

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategoryId(category.id)
      setCategoryForm({
        name: category.title,
        eventCount: String(category.events),
        description: category.description,
        iconClass: category.iconClass || 'bi-tag',
      })
    } else {
      setEditingCategoryId(null)
      setCategoryForm({
        name: '',
        eventCount: '0',
        description: '',
        iconClass: 'bi-tag',
      })
    }

    setIsCategoryModalOpen(true)
  }

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setEditingCategoryId(null)
  }

  const handleCategoryFormChange = (field, value) => {
    setCategoryForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSaveCategory = () => {
    const trimmedName = categoryForm.name.trim()
    const trimmedDescription = categoryForm.description.trim()
    const trimmedIconClass = categoryForm.iconClass.trim() || 'bi-tag'
    const parsedCount = Number.parseInt(categoryForm.eventCount, 10)

    if (!trimmedName) {
      return
    }

    const nextCategory = {
      id: editingCategoryId || Date.now(),
      title: trimmedName,
      description: trimmedDescription || 'No description provided',
      events: Number.isNaN(parsedCount) ? 0 : parsedCount,
      iconClass: trimmedIconClass,
    }

    setCategories((current) => {
      if (editingCategoryId) {
        return current.map((category) =>
          category.id === editingCategoryId ? nextCategory : category
        )
      }

      return [...current, nextCategory]
    })

    closeCategoryModal()
  }

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
          {activeTab === 'Categories' && (
            <button className="ss-btn-add" onClick={() => openCategoryModal()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Category
            </button>
          )}
        </div>

        {activeTab === 'Categories' && (
          <div className="ss-grid">
            {categories.map(category => (
              <div key={category.id} className="ss-card">
                <div className="ss-card-header">
                  <div className="ss-card-icon">
                    <i className={`bi ${category.iconClass}`} />
                  </div>
                  <button className="ss-btn-edit" type="button" onClick={() => openCategoryModal(category)}>
                    Edit
                  </button>
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

        {isCategoryModalOpen && (
          <div className="ss-modal-backdrop" onClick={closeCategoryModal}>
            <div className="ss-modal" onClick={(event) => event.stopPropagation()}>
              <div className="ss-modal-header">
                <div>
                  <h3>{modalTitle}</h3>
                  <p>Create or update the category cards shown in system settings.</p>
                </div>
                <button className="ss-modal-close" type="button" onClick={closeCategoryModal}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="ss-modal-grid">
                <div className="ss-modal-field">
                  <label htmlFor="category-name">Category Name</label>
                  <input
                    id="category-name"
                    type="text"
                    value={categoryForm.name}
                    onChange={(event) => handleCategoryFormChange('name', event.target.value)}
                    autoFocus
                  />
                </div>

                <div className="ss-modal-field">
                  <label htmlFor="category-count">Event Count</label>
                  <input
                    id="category-count"
                    type="number"
                    min="0"
                    value={categoryForm.eventCount}
                    onChange={(event) => handleCategoryFormChange('eventCount', event.target.value)}
                  />
                </div>
              </div>

              <div className="ss-modal-field">
                <label htmlFor="category-description">Description</label>
                <textarea
                  id="category-description"
                  rows="4"
                  value={categoryForm.description}
                  onChange={(event) => handleCategoryFormChange('description', event.target.value)}
                />
              </div>

              <div className="ss-modal-field">
                <label htmlFor="category-icon">Bootstrap Icon Class</label>
                <input
                  id="category-icon"
                  type="text"
                  value={categoryForm.iconClass}
                  onChange={(event) => handleCategoryFormChange('iconClass', event.target.value)}
                />
                <span className="ss-help-text">Example: `bi-pc-display`, `bi-music-note-beamed`, `bi-dribbble`.</span>
              </div>

              <div className="ss-modal-actions">
                <button className="ss-btn-secondary" type="button" onClick={closeCategoryModal}>
                  Cancel
                </button>
                <button className="ss-btn-save" type="button" onClick={handleSaveCategory}>
                  Save Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
