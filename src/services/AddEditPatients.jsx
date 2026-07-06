import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, FormField, Input, Select, FormActions, LoadingMessage } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API
const genders = ['Male', 'Female']
const empty = { firstName: '', lastName: '', gender: '', dateOfBirth: '', phone: '', address: '' }

export default function AddEditPatients() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return

    async function fetchPatient() {
      try {
        setFetching(true)
        const res = await axios.get(`${API}/Patient/${id}`)
        if (res.data.status) {
          const p = res.data.data[0]
          setForm({
            userId: p.userId,
            firstName: p.firstName,
            lastName: p.lastName,
            gender: p.gender,
            dateOfBirth: p.dateOfBirth?.split('T')[0],
            phone: p.phone,
            address: p.address,
          })
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError('Failed to load patient')
      } finally {
        setFetching(false)
      }
    }

    fetchPatient()
  }, [id, isEdit])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = isEdit
        ? await axios.put(`${API}/Patient/${id}`, form)
        : await axios.post(`${API}/Patient`, form)
      if (res.data.status) navigate('/patients')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this patient?')) return
    try {
      const res = await axios.delete(`${API}/Patient/${id}`)
      if (res.data.status) navigate('/patients')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <LoadingMessage message="Loading patient..." />
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">Patients &gt; {isEdit ? 'Edit Patient' : 'Add Patient'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Patient' : 'Add Patient'}</h2>
        </div>
        {isEdit && (
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete Patient
          </Button>
        )}
      </div>

      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: 'User ID', key: 'userId', type: 'text' },
            { label: 'First Name', key: 'firstName', type: 'text' },
            { label: 'Last Name', key: 'lastName', type: 'text' },
            { label: 'Date of Birth', key: 'dateOfBirth', type: 'date' },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Address', key: 'address', type: 'text' },
          ].map(({ label, key, type }) => (
            <FormField key={key} label={label} className={key === 'address' ? 'col-span-2' : ''}>
              <Input name={key} type={type} value={form[key]} onChange={handleChange} required />
            </FormField>
          ))}

          <FormField label="Gender" className="col-span-2">
            <Select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              {genders.map(g => <option key={g}>{g}</option>)}
            </Select>
          </FormField>

          <FormActions onCancel={() => navigate('/patients')} submitLabel={isEdit ? 'Update Patient' : 'Save Patient'} submitting={loading} className="col-span-2" />
        </form>
      </Card>
    </div>
  )
}
