import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, LoadingMessage, Table } from '../components/ui'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { SearchBar } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API

export default function Visits() {
  const [visits, setVisits] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchVisits() }, [])

  async function fetchVisits() {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/Visit`)
      if (res.data.status) setVisits(res.data.data)
      else setError(res.data.message)
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(visitId) {
    if (!confirm('Delete this visit?')) return
    try {
      const res = await axios.delete(`${API}/Visit/${visitId}`)
      if (res.data.status) fetchVisits()
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const columns = [
    { key: 'visitId', label: 'Visit ID' },
    { key: 'patientId', label: 'Patient ID' },
    { key: 'doctorId', label: 'Doctor ID' },
    { key: 'visitDate', label: 'Visit Date' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'actions', label: 'Action' },
  ]

  const filteredVisits = visits.filter((visit) => {
    const term = search.toLowerCase()
    return visit.diagnosis.toLowerCase().includes(term)
  })

  const renderRow = (visit) => (
    <tr key={visit.visitId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 text-gray-400 dark:text-gray-500">{visit.visitId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{visit.patientId}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{visit.doctorId}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{visit.visitDate?.split('T')[0]}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{visit.diagnosis}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="px-2 py-2" onClick={() => navigate(`/visits/edit/${visit.visitId}`)}>
            <IconEdit size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-2 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDelete(visit.visitId)}>
            <IconTrash size={14} />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Visits</h2>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by diagnosis"
            className="md:max-w-sm"
          />
          <Button type="button" className="flex items-center gap-2" onClick={() => navigate('/visits/add')}>
            <IconPlus size={16} /> New Visit
          </Button>
        </div>

        {loading ? (
          <LoadingMessage message="Loading visits..." />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <Table columns={columns} data={filteredVisits} renderRow={renderRow} className="min-w-full" />
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {filteredVisits.length} of {filteredVisits.length} entries
          </p>
        )}
      </Card>
    </div>
  )
}
