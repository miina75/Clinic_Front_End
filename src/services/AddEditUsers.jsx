import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_CLINIC_API
const roles = ['Admin', 'Receptionist', 'Doctor', 'Patient']
const empty = { username: '', email: '', passwordHash: '', role: '' }

export default function AddEditUsers() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    async function fetchUser() {
      try {
        setFetching(true)
        const res = await axios.get(`${API}/Users/${id}`)
        if (res.data.status) {
          const u = res.data.data[0]
          setForm({
            username: u.username,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
          })
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError('Failed to load user')
      } finally {
        setFetching(false)
      }
    }
    fetchUser()
  }, [id])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      let res
      if (isEdit) {
        res = await axios.put(`${API}/Users/${id}`, form)
      } else {
        res = await axios.post(`${API}/Users`, form)
      }
      if (res.data.status) {
        navigate('/users')
      } else {
        alert(res.data.message)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await axios.delete(`${API}/Users/${id}`)
      if (res.data.status) navigate('/users')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center py-20 text-sm text-gray-400">
      Loading user...
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-400">
      {error}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            Users &gt; {isEdit ? 'Edit User' : 'Add User'}
          </p>
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit User' : 'Add User'}
          </h2>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete User
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              name="passwordHash"
              type="password"
              value={form.passwordHash}
              onChange={handleChange}
              required={!isEdit}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select role</option>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update User' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}