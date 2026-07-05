import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
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

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Doctors</h2>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/doctors/add')}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={16} /> Add Doctor
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading doctors...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">DoctorId</th>
                <th className="pb-3 font-medium">UserId</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Specialty</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, i) => (
                <tr key={doctor.doctorId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{doctor.doctorId}</td>
                  <td className="py-3 text-gray-600">{doctor.userId}</td>
                  <td className="py-3 text-gray-700 font-medium">
                    {doctor.firstName} {doctor.lastName}
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {doctor.specialty}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{doctor.phone}</td>
                  <td className="py-3 text-gray-600">{doctor.email}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/doctors/edit/${doctor.doctorId}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.doctorId, `${doctor.firstName} ${doctor.lastName}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
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
          <p className="text-xs text-gray-400 mt-3">
            Showing 1 to {doctors.length} of {doctors.length} entries
          </p>
        )}
      </div>
    </div>
  )
}