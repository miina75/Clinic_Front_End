import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, LoadingMessage, Table } from '../components/ui'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { SearchBar } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchDoctors() }, [])

  async function fetchDoctors() {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/Doctor`)
      if (res.data.status) setDoctors(res.data.data)
      else setError(res.data.message)
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(doctorId, name) {
    if (!confirm(`Delete doctor "${name}"?`)) return
    try {
      const res = await axios.delete(`${API}/Doctor/${doctorId}`)
      if (res.data.status) fetchDoctors()
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const columns = [
    { key: 'doctorId', label: 'Doctor ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'actions', label: 'Action' },
  ]

  const filteredDoctors = doctors.filter((doctor) => {
    const term = search.toLowerCase()
    return `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(term)
  })

  const renderRow = (doctor) => (
    <tr key={doctor.doctorId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="py-3 text-gray-400 dark:text-gray-500">{doctor.doctorId}</td>
      <td className="py-3 text-gray-600 dark:text-gray-400">{doctor.userId}</td>
      <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">{doctor.firstName} {doctor.lastName}</td>
      <td className="py-3"><span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">{doctor.specialty}</span></td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{doctor.phone}</td>
      <td className="py-3 text-gray-600 dark:text-gray-300">{doctor.email}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="px-2 py-2" onClick={() => navigate(`/doctors/edit/${doctor.doctorId}`)}>
            <IconEdit size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-2 py-2 text-red-600 hover:bg-red-50" onClick={() => handleDelete(doctor.doctorId, `${doctor.firstName} ${doctor.lastName}`)}>
            <IconTrash size={14} />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Doctors</h2>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by doctor name"
            className="md:max-w-sm"
          />
          <Button type="button" className="flex items-center gap-2" onClick={() => navigate('/doctors/add')}>
            <IconPlus size={16} /> Add Doctor
          </Button>
        </div>

        {loading ? (
          <LoadingMessage message="Loading doctors..." />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <Table columns={columns} data={filteredDoctors} renderRow={renderRow} className="min-w-full" />
        )}

        {!loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing 1 to {filteredDoctors.length} of {filteredDoctors.length} entries
          </p>
        )}
      </Card>
    </div>
  )
}
