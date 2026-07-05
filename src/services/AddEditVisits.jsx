
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_CLINIC_API
const PATIENTS_API = import.meta.env.VITE_PATIENTS_API
const DOCTORS_API = import.meta.env.VITE_DOCTORS_API

const empty = { patientId: '', doctorId: '', visitDate: '', diagnosis: '' }

export default function AddEditVisits() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDropdowns()
    if (isEdit) fetchVisit()
  }, [id])

  async function fetchDropdowns() {
    try {
      const [pRes, dRes] = await Promise.all([
        axios.get(`${API}/Patient`),
        axios.get(`${API}/Doctor`),
      ])
      if (pRes.data.status) setPatients(pRes.data.data)
      if (dRes.data.status) setDoctors(dRes.data.data)
    } catch (err) {
      console.error('Failed to load dropdowns', err)
    }
  }

  async function fetchVisit() {
    try {
      setFetching(true)
      const res = await axios.get(`${API}/Visit/${id}`)
      if (res.data.status) {
        const v = res.data.data[0]
        setForm({
          patientId: v.patientId,
          doctorId: v.doctorId,
          visitDate: v.visitDate?.split('T')[0],
          diagnosis: v.diagnosis,
        })
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to load visit')
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
        ? await axios.put(`${API}/Visit/${id}`, form)
        : await axios.post(`${API}/Visit`, form)
      if (res.data.status) navigate('/visits')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this visit?')) return
    try {
      const res = await axios.delete(`${API}/Visit/${id}`)
      if (res.data.status) navigate('/visits')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <div className="py-20 text-center text-sm text-gray-400">Loading visit...</div>
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Visits &gt; {isEdit ? 'Edit Visit' : 'New Visit'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Visit' : 'New Visit'}</h2>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Visit
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Patient</label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.patientId} value={p.patientId}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Doctor</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select doctor</option>
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Visit Date</label>
            <input
              name="visitDate"
              type="date"
              value={form.visitDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Diagnosis</label>
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter diagnosis..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div className="col-span-2 flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/visits')}
              className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Visit' : 'Save Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}