import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, LoadingMessage, Table } from '../components/ui'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { SearchBar } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API

const statusColors = {
  Paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
}

export default function Bills() {
  const [bills, setBills] = useState([])
  const [search, setSearch] = useState('')
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

  const columns = [
    { key: 'billId', label: 'Bill ID' },
    { key: 'visitId', label: 'Visit ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'billDate', label: 'Bill Date' },
    { key: 'actions', label: 'Action' },
  ]

  const filteredBills = bills.filter((bill) => {
    const term = search.toLowerCase()
    return bill.paymentStatus.toLowerCase().includes(term)
  })

  const renderRow = (bill) => (
    <tr key={bill.billId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 text-gray-400 dark:text-gray-500">{bill.billId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{bill.visitId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-semibold">${bill.amount}</td>
      <td className="py-3"><span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[bill.paymentStatus] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>{bill.paymentStatus}</span></td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{bill.billDate?.split('T')[0]}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="px-2 py-2" onClick={() => navigate(`/bills/edit/${bill.billId}`)}>
            <IconEdit size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-2 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDelete(bill.billId)}>
            <IconTrash size={14} />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Bills</h2>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by payment status"
            className="md:max-w-sm"
          />
          <Button type="button" className="flex items-center gap-2" onClick={() => navigate('/bills/add')}>
            <IconPlus size={16} /> Add Bill
          </Button>
        </div>

        {loading ? (
          <LoadingMessage message="Loading bills..." />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <Table columns={columns} data={filteredBills} renderRow={renderRow} className="min-w-full" />
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {filteredBills.length} of {filteredBills.length} entries
          </p>
        )}
      </Card>
    </div>
  )
}
