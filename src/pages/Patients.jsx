import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

export default function Patients() {
  const [patients, setPatients] = useState([])
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

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Patients</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/patients/add')}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={16} /> Add Patient
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading patients...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">Patient Id</th>
                <th className="pb-3 font-medium">User Id</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Gender</th>
                <th className="pb-3 font-medium">Date of Birth</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Address</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.patientId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 text-gray-400 dark:text-gray-500">{patient.patientId}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{patient.userId}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      patient.gender === 'Male'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                    }`}>
                      {patient.gender}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{patient.dateOfBirth?.split('T')[0]}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{patient.phone}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{patient.address}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/patients/edit/${patient.patientId}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.patientId, `${patient.firstName} ${patient.lastName}`)}
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
            Showing 1 to {patients.length} of {patients.length} entries
          </p>
        )}
      </div>
    </div>
  )
}