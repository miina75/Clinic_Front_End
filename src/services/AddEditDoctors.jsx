import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_CLINIC_API
const empty = { firstName: '', lastName: '', userId: '', specialty: '', phone: '', email: '' }

export default function AddEditDoctors() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    async function fetchDoctor() {
      try {
        setFetching(true)
        const res = await axios.get(`${API}/Doctor/${id}`)
        if (res.data.status) {
          const d = res.data.data[0]
          setForm({
            firstName: d.firstName,
            lastName: d.lastName,
            userId: d.userId,
            specialty: d.specialty,
            phone: d.phone,
            email: d.email,
          })
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError('Failed to load doctor')
      } finally {
        setFetching(false)
      }
    }
    fetchDoctor()
  }, [id])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = isEdit
        ? await axios.put(`${API}/Doctor/${id}`, form)
        : await axios.post(`${API}/Doctor`, form)
      if (res.data.status) navigate('/doctors')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    try {
      const res = await axios.delete(`${API}/Doctor/${id}`)
      if (res.data.status) navigate('/doctors')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <div className="py-20 text-center text-sm text-gray-400">Loading doctor...</div>
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Doctors &gt; {isEdit ? 'Edit Doctor' : 'Add Doctor'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Doctor' : 'Add Doctor'}</h2>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Doctor
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          {[
            { label: 'First Name', key: 'firstName', type: 'text' },
            { label: 'Last Name', key: 'lastName', type: 'text' },
            { label: 'UserId', key: 'userId', type: 'text' },
            { label: 'Specialty', key: 'specialty', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key} className={key === 'email' ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                name={key}
                type={type}
                value={form[key]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          ))}

          <div className="col-span-2 flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}