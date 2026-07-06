import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, FormField, Input, Select, FormActions, LoadingMessage } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API
const empty = { patientId: '', doctorId: '', visitDate: '', diagnosis: '' }

export default function AddEditVisits() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDropdowns()
    if (isEdit) fetchVisit()
  }, [id, isEdit])

  async function fetchDropdowns() {
    try {
      const [pRes, dRes] = await Promise.all([
        axios.get(`${API}/Patient`),
        axios.get(`${API}/Doctor`),
      ])
      if (pRes.data.status) setPatients(pRes.data.data)
      if (dRes.data.status) setDoctors(dRes.data.data)
    } catch (err) {
      console.error('Failed to load dropdowns', err)
    }
  }

  async function fetchVisit() {
    try {
      setFetching(true)
      const res = await axios.get(`${API}/Visit/${id}`)
      if (res.data.status) {
        const v = res.data.data[0]
        setForm({
          patientId: v.patientId,
          doctorId: v.doctorId,
          visitDate: v.visitDate?.split('T')[0],
          diagnosis: v.diagnosis,
        })
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to load visit')
    } finally {
      setFetching(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = isEdit
        ? await axios.put(`${API}/Visit/${id}`, form)
        : await axios.post(`${API}/Visit`, form)
      if (res.data.status) navigate('/visits')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this visit?')) return
    try {
      const res = await axios.delete(`${API}/Visit/${id}`)
      if (res.data.status) navigate('/visits')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <LoadingMessage message="Loading visit..." />
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">Visits &gt; {isEdit ? 'Edit Visit' : 'New Visit'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Visit' : 'New Visit'}</h2>
        </div>
        {isEdit && (
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete Visit
          </Button>
        )}
      </div>

      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Patient">
            <Select name="patientId" value={form.patientId} onChange={handleChange} required>
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.patientId} value={p.patientId}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Doctor">
            <Select name="doctorId" value={form.doctorId} onChange={handleChange} required>
              <option value="">Select doctor</option>
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Visit Date">
            <Input name="visitDate" type="date" value={form.visitDate} onChange={handleChange} required />
          </FormField>

          <FormField label="Diagnosis" className="col-span-2">
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter diagnosis..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </FormField>

          <FormActions onCancel={() => navigate('/visits')} submitLabel={isEdit ? 'Update Visit' : 'Save Visit'} submitting={loading} className="col-span-2" />
        </form>
      </Card>
    </div>
  )
}
