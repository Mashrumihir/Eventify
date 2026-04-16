import { useEffect, useMemo, useState } from 'react'
import './css/UserManagement.css'
import { createUser, fetchUsers, removeUser, updateUserStatus } from '../../services/dataService'

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
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [searchValue, setSearchValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Attend',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        setError('')
        const response = await fetchUsers()

        if (isMounted) {
          setUsers(response.users)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      }
    }

    loadUsers()
    return () => {
      isMounted = false
    }
  }, [])

  const tabCounts = useMemo(
    () => ({
      All: users.length,
      Attend: users.filter((user) => user.role === 'attend').length,
      Organizer: users.filter((user) => user.role === 'organizer').length,
      Admin: users.filter((user) => user.role === 'admin').length,
    }),
    [users]
  )

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return users.filter((user) => {
      const roleLabel = user.role === 'attend' ? 'Attend' : user.role.charAt(0).toUpperCase() + user.role.slice(1)
      const matchesTab = activeTab === 'All' || roleLabel === activeTab
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)

      return matchesTab && matchesSearch
    })
  }, [activeTab, searchValue, users])

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'active' ? 'blocked' : 'active'
      await updateUserStatus(userId, nextStatus)
      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user))
      )
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await removeUser(userId)
      setUsers((current) => current.filter((user) => user.id !== userId))
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const handleAddUser = async () => {
    try {
      const response = await createUser(newUser)
      setUsers((current) => [response.user, ...current])
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'Attend',
      })
      setIsModalOpen(false)
    } catch (createError) {
      setError(createError.message)
    }
  }

  return (
    <div className="admin-page-layout">
      <div className="admin-welcome-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your platform effectively</p>
      </div>

      <div className="admin-content-area">
        <h2 className="admin-section-title">User Management</h2>
        <p className="admin-section-subtitle">These records are being read from the `users` table.</p>
        {error ? <p className="me-status-message">{error}</p> : null}

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
                  <th>Role</th>
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
                    <td>{user.role}</td>
                    <td>
                      <span className={`um-status ${user.status}`}>{user.status}</span>
                    </td>
                    <td className="um-date">{new Date(user.joinDate).toLocaleDateString('en-IN')}</td>
                    <td className="um-bookings">{user.bookings}</td>
                    <td>
                      <div className="um-actions">
                        <button type="button" className="um-inline-btn" onClick={() => handleBlockToggle(user.id, user.status)}>
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
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
                />
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
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
