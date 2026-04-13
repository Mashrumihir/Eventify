import React, { useMemo, useState } from 'react'
import './css/UserManagement.css'

const INITIAL_USERS = [
  { id: 1, name: 'Yash', email: 'mmashru426@rku.ac.in', password: 'yash2026', role: 'Attend', status: 'active', joinDate: '2026-04-12', bookings: 0 },
  { id: 2, name: 'Meet', email: 'meet2@gmail.com', password: 'meet2026', role: 'Attend', status: 'active', joinDate: '2026-04-11', bookings: 0 },
  { id: 3, name: 'Meet', email: 'meet1@gmail.com', password: 'meet2025', role: 'Attend', status: 'active', joinDate: '2026-04-11', bookings: 0 },
  { id: 4, name: 'Meet', email: 'meet@gmail.com', password: 'meet2024', role: 'Attend', status: 'active', joinDate: '2026-04-11', bookings: 0 },
  { id: 5, name: 'Krupansi', email: 'krupansi2@gmail.com', password: 'krup2026', role: 'Organizer', status: 'active', joinDate: '2026-04-11', bookings: 0 },
  { id: 6, name: 'Krupansi', email: 'krupansi1@gmail.com', password: 'krup2025', role: 'Organizer', status: 'active', joinDate: '2026-04-11', bookings: 0 },
  { id: 7, name: 'Krupansi', email: 'krupansi@gmail.com', password: 'krup2024', role: 'Organizer', status: 'active', joinDate: '2026-04-11', bookings: 0 },
  { id: 8, name: 'Mihir Mashru', email: 'mashrumihir17@gmail.com', password: 'mihir17', role: 'Admin', status: 'active', joinDate: '2026-04-06', bookings: 0 },
  { id: 9, name: 'Mihir Mashru', email: 'mashrumihir16@gmail.com', password: 'mihir16', role: 'Admin', status: 'active', joinDate: '2026-04-06', bookings: 1 },
  { id: 10, name: 'Admin Ops', email: 'ops@eventify.com', password: 'ops2026', role: 'Admin', status: 'active', joinDate: '2026-04-05', bookings: 0 },
]

const ROLE_TABS = [
  { id: 'All', label: 'All Users' },
  { id: 'Attend', label: 'Attend Users' },
  { id: 'Organizer', label: 'Organizer Users' },
  { id: 'Admin', label: 'Admin Users' },
]

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [activeTab, setActiveTab] = useState('All')
  const [searchValue, setSearchValue] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Attend',
  })

  const tabCounts = useMemo(
    () => ({
      All: users.length,
      Attend: users.filter((user) => user.role === 'Attend').length,
      Organizer: users.filter((user) => user.role === 'Organizer').length,
      Admin: users.filter((user) => user.role === 'Admin').length,
    }),
    [users]
  )

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return users.filter((user) => {
      const matchesTab = activeTab === 'All' || user.role === activeTab
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)

      return matchesTab && matchesSearch
    })
  }, [activeTab, searchValue, users])

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((current) => ({
      ...current,
      [userId]: !current[userId],
    }))
  }

  const handleBlockToggle = (userId) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
          : user
      )
    )
  }

  const handleDeleteUser = (userId) => {
    setUsers((current) => current.filter((user) => user.id !== userId))
  }

  const handleAddUser = () => {
    const trimmedName = newUser.name.trim()
    const trimmedEmail = newUser.email.trim()
    const trimmedPassword = newUser.password.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      return
    }

    const createdUser = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: newUser.role,
      status: 'active',
      joinDate: new Date().toISOString().slice(0, 10),
      bookings: 0,
    }

    setUsers((current) => [createdUser, ...current])
    setActiveTab(newUser.role)
    setSearchValue('')
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'Attend',
    })
    setIsModalOpen(false)
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <h2 className="admin-section-title">User Management</h2>
        <p className="admin-section-subtitle">Manage and monitor all registered users on the platform.</p>

        <div className="um-toolbar">
          <div className="um-tabs">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`um-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id !== 'All' && ` (${tabCounts[tab.id] || 0})`}
              </button>
            ))}
          </div>

          <div className="um-toolbar-actions">
            <div className="um-search-box">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>

            <button className="um-new-user-btn" type="button" onClick={() => setIsModalOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New User
            </button>
          </div>
        </div>

        <div className="um-table-shell">
          <div className="um-table-wrapper">
            <table className="um-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="um-user-cell">
                        <div className="um-avatar">{getInitials(user.name)}</div>
                        <span className="um-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="um-email">{user.email}</td>
                    <td>
                      <div className="um-password-cell">
                        <span>{visiblePasswords[user.id] ? user.password : '********'}</span>
                        <button type="button" className="um-inline-btn" onClick={() => togglePasswordVisibility(user.id)}>
                          Show
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`um-status ${user.status}`}>{user.status}</span>
                    </td>
                    <td className="um-date">{user.joinDate}</td>
                    <td className="um-bookings">{user.bookings}</td>
                    <td>
                      <div className="um-actions">
                        <button type="button" className="um-inline-btn" onClick={() => handleBlockToggle(user.id)}>
                          {user.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                        <button type="button" className="um-inline-btn um-delete-btn" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="um-modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="um-modal" onClick={(event) => event.stopPropagation()}>
              <div className="um-modal-header">
                <h3>Add User</h3>
              </div>

              <div className="um-modal-body">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))}
                />

                <div className="um-password-input">
                  <input
                    type={visiblePasswords.newUser ? 'text' : 'password'}
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
                  />
                  <button
                    type="button"
                    className="um-inline-btn"
                    onClick={() => setVisiblePasswords((current) => ({ ...current, newUser: !current.newUser }))}
                  >
                    Show
                  </button>
                </div>

                <select
                  value={newUser.role}
                  onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))}
                >
                  <option value="Attend">Attend</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="um-modal-actions">
                <button type="button" className="um-inline-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="um-new-user-btn" onClick={handleAddUser}>
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
