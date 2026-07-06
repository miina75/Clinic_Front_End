import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, LoadingMessage, Table } from '../components/ui'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { SearchBar } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/Users`)
      if (res.data.status) setUsers(res.data.data)
      else setError(res.data.message)
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(userId, username) {
    if (!confirm(`Delete user "${username}"?`)) return
    try {
      const res = await axios.delete(`${API}/Users/${userId}`)
      if (res.data.status) fetchUsers()
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const columns = [
    { key: 'userId', label: 'User ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Action' },
  ]

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase()
    return `${user.username} ${user.email}`.toLowerCase().includes(term)
  })

  const renderRow = (user) => (
    <tr key={user.userId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 text-gray-400 dark:text-gray-500">{user.userId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{user.username}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{user.email}</td>
      <td className="py-3">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' : user.role === 'Receptionist' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : user.role === 'Doctor' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
          {user.role}
        </span>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="px-2 py-2" onClick={() => navigate(`/users/edit/${user.userId}`)}>
            <IconEdit size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-2 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDelete(user.userId, user.username)}>
            <IconTrash size={14} />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Users</h2>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email"
            className="md:max-w-sm"
          />
          <Button type="button" className="flex items-center gap-2" onClick={() => navigate('/users/add')}>
            <IconPlus size={16} /> Add User
          </Button>
        </div>

        {loading ? (
          <LoadingMessage message="Loading users..." />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <Table columns={columns} data={filteredUsers} renderRow={renderRow} className="min-w-full" />
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
          </p>
        )}
      </Card>
    </div>
  )
}
