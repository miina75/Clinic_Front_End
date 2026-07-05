import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
const API = import.meta.env.VITE_CLINIC_API
const roleColors = {
  Admin: 'bg-purple-100 text-purple-700',
  Receptionist: 'bg-blue-100 text-blue-700',
  Doctor: 'bg-green-100 text-green-700',
  Patient: 'bg-gray-100 text-gray-600',
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
  try {
    setLoading(true)
    const res = await axios.get(`${API}/Users`)
    console.log(res.data)
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

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Users</h2>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/users/add')}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={16} /> Add User
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading users...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">UserId</th>
                <th className="pb-3 font-medium">Username</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.userId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{user.userId}</td>
                  <td className="py-3 text-gray-700 font-medium">{user.username}</td>
                  <td className="py-3 text-gray-600">{user.email}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleColors[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/users/edit/${user.userId}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId, user.username)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 mt-3">
            Showing 1 to {users.length} of {users.length} entries
          </p>
        )}
      </div>
    </div>
  )
}