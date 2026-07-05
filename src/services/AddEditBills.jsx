
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_CLINIC_API
const statuses = ['Paid', 'Pending', 'Cancelled']
const empty = { visitId: '', amount: '', paymentStatus: '', billDate: '' }

export default function AddEditBills() {
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
    if (isEdit) fetchBill()
  }, [id])

  async function fetchVisits() {
    try {
      const res = await axios.get(`${API}/Visit`)
      if (res.data.status) setVisits(res.data.data)
    } catch (err) {
      console.error('Failed to load visits', err)
    }
  }

  async function fetchBill() {
    try {
      setFetching(true)
      const res = await axios.get(`${API}/Bill/${id}`)
      if (res.data.status) {
        const b = res.data.data[0]
        setForm({
          visitId: b.visitId,
          amount: b.amount,
          paymentStatus: b.paymentStatus,
          billDate: b.billDate?.split('T')[0],
        })
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to load bill')
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
        ? await axios.put(`${API}/Bill/${id}`, form)
        : await axios.post(`${API}/Bill`, form)
      if (res.data.status) navigate('/bills')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this bill?')) return
    try {
      const res = await axios.delete(`${API}/Bill/${id}`)
      if (res.data.status) navigate('/bills')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <div className="py-20 text-center text-sm text-gray-400">Loading bill...</div>
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Bills &gt; {isEdit ? 'Edit Bill' : 'Add Bill'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Bill' : 'Add Bill'}</h2>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Bill
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount ($)</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select status</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bill Date</label>
            <input
              name="billDate"
              type="date"
              value={form.billDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/bills')}
              className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Bill' : 'Save Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}