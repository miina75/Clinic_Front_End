import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, LoadingMessage, Table } from '../components/ui'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { SearchBar } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchPrescriptions() }, [])

  async function fetchPrescriptions() {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/Prescription`)
      if (res.data.status) setPrescriptions(res.data.data)
      else setError(res.data.message)
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(prescriptionId) {
    if (!confirm('Delete this prescription?')) return
    try {
      const res = await axios.delete(`${API}/Prescription/${prescriptionId}`)
      if (res.data.status) fetchPrescriptions()
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const columns = [
    { key: 'prescriptionId', label: 'Prescription ID' },
    { key: 'visitId', label: 'Visit ID' },
    { key: 'medicationName', label: 'Medication' },
    { key: 'dosage', label: 'Dosage' },
    { key: 'instructions', label: 'Instructions' },
    { key: 'actions', label: 'Action' },
  ]

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const term = search.toLowerCase()
    return prescription.medicationName.toLowerCase().includes(term)
  })

  const renderRow = (prescription) => (
    <tr key={prescription.prescriptionId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 text-gray-400 dark:text-gray-500">{prescription.prescriptionId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{prescription.visitId}</td>
      <td className="py-3"><span className="rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">{prescription.medicationName}</span></td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{prescription.dosage}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{prescription.instructions}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="px-2 py-2" onClick={() => navigate(`/prescriptions/edit/${prescription.prescriptionId}`)}>
            <IconEdit size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-2 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDelete(prescription.prescriptionId)}>
            <IconTrash size={14} />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Prescriptions</h2>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by medication"
            className="md:max-w-sm"
          />
          <Button type="button" className="flex items-center gap-2" onClick={() => navigate('/prescriptions/add')}>
            <IconPlus size={16} /> Add Prescription
          </Button>
        </div>

        {loading ? (
          <LoadingMessage message="Loading prescriptions..." />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <Table columns={columns} data={filteredPrescriptions} renderRow={renderRow} className="min-w-full" />
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {filteredPrescriptions.length} of {filteredPrescriptions.length} entries
          </p>
        )}
      </Card>
    </div>
  )
}
