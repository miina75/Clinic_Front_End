import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, LoadingMessage, Table } from '../components/ui'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { SearchBar } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchPatients() }, [])

  async function fetchPatients() {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/Patient`)
      if (res.data.status) setPatients(res.data.data)
      else setError(res.data.message)
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(patientId, name) {
    if (!confirm(`Delete patient "${name}"?`)) return
    try {
      const res = await axios.delete(`${API}/Patient/${patientId}`)
      if (res.data.status) fetchPatients()
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const columns = [
    { key: 'patientId', label: 'Patient ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'actions', label: 'Action' },
  ]

  const filteredPatients = patients.filter((patient) => {
    const term = search.toLowerCase()
    return `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term)
  })

  const renderRow = (patient) => (
    <tr key={patient.patientId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 text-gray-400 dark:text-gray-500">{patient.patientId}</td>
      <td className="py-3 text-gray-600 dark:text-gray-400">{patient.userId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{patient.firstName} {patient.lastName}</td>
      <td className="py-3">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${patient.gender === 'Male' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'}`}>
          {patient.gender}
        </span>
      </td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{patient.dateOfBirth?.split('T')[0]}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{patient.phone}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{patient.address}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="px-2 py-2" onClick={() => navigate(`/patients/edit/${patient.patientId}`)}>
            <IconEdit size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-2 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDelete(patient.patientId, `${patient.firstName} ${patient.lastName}`)}>
            <IconTrash size={14} />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Patients</h2>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by patient name"
            className="md:max-w-sm"
          />
          <Button type="button" className="flex items-center gap-2" onClick={() => navigate('/patients/add')}>
            <IconPlus size={16} /> Add Patient
          </Button>
        </div>

        {loading ? (
          <LoadingMessage message="Loading patients..." />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <Table columns={columns} data={filteredPatients} renderRow={renderRow} className="min-w-full" />
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {filteredPatients.length} of {filteredPatients.length} entries
          </p>
        )}
      </Card>
    </div>
  )
}
