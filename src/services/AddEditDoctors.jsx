import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, FormField, Input, FormActions, LoadingMessage } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API
const empty = { firstName: '', lastName: '', userId: '', specialty: '', phone: '', email: '' }

export default function AddEditDoctors() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return

    async function fetchDoctor() {
      try {
        setFetching(true)
        const res = await axios.get(`${API}/Doctor/${id}`)
        if (res.data.status) {
          const d = res.data.data[0]
          setForm({
            firstName: d.firstName,
            lastName: d.lastName,
            userId: d.userId,
            specialty: d.specialty,
            phone: d.phone,
            email: d.email,
          })
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError('Failed to load doctor')
      } finally {
        setFetching(false)
      }
    }

    fetchDoctor()
  }, [id, isEdit])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = isEdit
        ? await axios.put(`${API}/Doctor/${id}`, form)
        : await axios.post(`${API}/Doctor`, form)
      if (res.data.status) navigate('/doctors')
      else alert(res.data.message)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    try {
      const res = await axios.delete(`${API}/Doctor/${id}`)
      if (res.data.status) navigate('/doctors')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <LoadingMessage message="Loading doctor..." />
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">Doctors &gt; {isEdit ? 'Edit Doctor' : 'Add Doctor'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Doctor' : 'Add Doctor'}</h2>
        </div>
        {isEdit && (
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete Doctor
          </Button>
        )}
      </div>

      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: 'First Name', key: 'firstName', type: 'text' },
            { label: 'Last Name', key: 'lastName', type: 'text' },
            { label: 'User ID', key: 'userId', type: 'text' },
            { label: 'Specialty', key: 'specialty', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
          ].map(({ label, key, type }) => (
            <FormField key={key} label={label} className={key === 'email' ? 'col-span-2' : ''}>
              <Input name={key} type={type} value={form[key]} onChange={handleChange} required />
            </FormField>
          ))}

          <FormActions onCancel={() => navigate('/doctors')} submitLabel={isEdit ? 'Update Doctor' : 'Save Doctor'} submitting={loading} className="col-span-2" />
        </form>
      </Card>
    </div>
  )
}
