
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_CLINIC_API
const empty = { visitId: '', medicationName: '', dosage: '', instructions: '' }

export default function AddEditPrescriptions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchVisits()
    if (isEdit) fetchPrescription()
  }, [id])

  async function fetchVisits() {
    try {
      const res = await axios.get(`${API}/Visit`)
      if (res.data.status) setVisits(res.data.data)
    } catch (err) {
      console.error('Failed to load visits', err)
    }
  }

  async function fetchPrescription() {
    try {
      setFetching(true)
      const res = await axios.get(`${API}/Prescription/${id}`)
      if (res.data.status) {
        const p = res.data.data[0]
        setForm({
          visitId: p.visitId,
          medicationName: p.medicationName,
          dosage: p.dosage,
          instructions: p.instructions,
        })
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to load prescription')
    } finally {
      setFetching(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = isEdit
        ? await axios.put(`${API}/Prescription/${id}`, form)
        : await axios.post(`${API}/Prescription`, form)
      if (res.data.status) navigate('/prescriptions')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this prescription?')) return
    try {
      const res = await axios.delete(`${API}/Prescription/${id}`)
      if (res.data.status) navigate('/prescriptions')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <div className="py-20 text-center text-sm text-gray-400">Loading prescription...</div>
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Prescriptions &gt; {isEdit ? 'Edit Prescription' : 'Add Prescription'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Prescription' : 'Add Prescription'}</h2>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Prescription
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Visit</label>
            <select
              name="visitId"
              value={form.visitId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select visit</option>
              {visits.map(v => (
                <option key={v.visitId} value={v.visitId}>
                  Visit #{v.visitId} — {v.diagnosis}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Medication Name</label>
            <input
              name="medicationName"
              type="text"
              value={form.medicationName}
              onChange={handleChange}
              required
              placeholder="Enter medication name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
            <input
              name="dosage"
              type="text"
              value={form.dosage}
              onChange={handleChange}
              required
              placeholder="e.g. 5mg"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter instructions..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/prescriptions')}
              className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Prescription' : 'Save Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}