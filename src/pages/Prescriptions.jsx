
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
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

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Prescriptions</h2>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/prescriptions/add')}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={16} /> Add Prescription
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading prescriptions...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-400">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">PrescriptionId</th>
                <th className="pb-3 font-medium">Visit ID</th>
                <th className="pb-3 font-medium">Medication</th>
                <th className="pb-3 font-medium">Dosage</th>
                <th className="pb-3 font-medium">Instructions</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p, i) => (
                <tr key={p.prescriptionId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{p.prescriptionId}</td>
                  <td className="py-3 text-gray-700 font-medium">{p.visitId}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      {p.medicationName}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{p.dosage}</td>
                  <td className="py-3 text-gray-600">{p.instructions}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/prescriptions/edit/${p.prescriptionId}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.prescriptionId)}
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
            Showing 1 to {prescriptions.length} of {prescriptions.length} entries
          </p>
        )}
      </div>
    </div>
  )
}