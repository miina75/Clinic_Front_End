
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

export default function Visits() {
  const [visits, setVisits] = useState([])
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

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Visits</h2>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/visits/add')}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={16} /> New Visit
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading visits...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">VisitId</th>
                <th className="pb-3 font-medium">PatientId</th>
                <th className="pb-3 font-medium">DoctorId</th>
                <th className="pb-3 font-medium">Visit Date</th>
                <th className="pb-3 font-medium">Diagnosis</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit, i) => (
                <tr key={visit.visitId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{visit.visitId}</td>
                  <td className="py-3 text-gray-700 font-medium">{visit.patientId}</td>
                  <td className="py-3 text-gray-600">{visit.doctorId}</td>
                  <td className="py-3 text-gray-600">{visit.visitDate?.split('T')[0]}</td>
                  <td className="py-3 text-gray-600">{visit.diagnosis}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/visits/edit/${visit.visitId}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(visit.visitId)}
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
            Showing 1 to {visits.length} of {visits.length} entries
          </p>
        )}
      </div>
    </div>
  )
}