import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

const statusColors = {
  Paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
}

export default function Bills() {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchBills() }, [])

  async function fetchBills() {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/Bill`)
      if (res.data.status) setBills(res.data.data)
      else setError(res.data.message)
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(billId) {
    if (!confirm('Delete this bill?')) return
    try {
      const res = await axios.delete(`${API}/Bill/${billId}`)
      if (res.data.status) fetchBills()
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Bills</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/bills/add')}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={16} /> Add Bill
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading bills...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">Bill Id</th>
                <th className="pb-3 font-medium">Visit ID</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Payment Status</th>
                <th className="pb-3 font-medium">Bill Date</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.billId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 text-gray-400 dark:text-gray-500">{bill.billId}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{bill.visitId}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-200 font-semibold">${bill.amount}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[bill.paymentStatus] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{bill.billDate?.split('T')[0]}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/bills/edit/${bill.billId}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.billId)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
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
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {bills.length} of {bills.length} entries
          </p>
        )}
      </div>
    </div>
  )
}