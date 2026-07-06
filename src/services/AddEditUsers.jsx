import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, FormField, Input, Select, FormActions, LoadingMessage } from '../components/ui'

const API = import.meta.env.VITE_CLINIC_API
const roles = ['Admin', 'Receptionist', 'Doctor', 'Patient']
const empty = { username: '', email: '', passwordHash: '', role: '' }

export default function AddEditUsers() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    async function fetchUser() {
      try {
        setFetching(true)
        const res = await axios.get(`${API}/Users/${id}`)
        if (res.data.status) {
          const u = res.data.data[0]
          setForm({
            username: u.username,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
          })
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError('Failed to load user')
      } finally {
        setFetching(false)
      }
    }
    fetchUser()
  }, [id])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setLoading(true)
      let res
      if (isEdit) {
        res = await axios.put(`${API}/Users/${id}`, form)
      } else {
        res = await axios.post(`${API}/Users`, form)
      }
      if (res.data.status) {
        navigate('/users')
      } else {
        alert(res.data.message)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await axios.delete(`${API}/Users/${id}`)
      if (res.data.status) navigate('/users')
      else alert(res.data.message)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (fetching) return <LoadingMessage message="Loading user..." />
  if (error) return <div className="py-20 text-center text-sm text-red-400">{error}</div>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">Users &gt; {isEdit ? 'Edit User' : 'Add User'}</p>
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit User' : 'Add User'}</h2>
        </div>
        {isEdit && (
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete User</Button>
        )}
      </div>

      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Username">
            <Input name="username" type="text" value={form.username} onChange={handleChange} required />
          </FormField>

          <FormField label="Email">
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </FormField>

          <FormField label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}>
            <Input name="passwordHash" type="password" value={form.passwordHash} onChange={handleChange} required={!isEdit} />
          </FormField>

          <FormField label="Role">
            <Select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select role</option>
              {roles.map(r => <option key={r}>{r}</option>)}
            </Select>
          </FormField>

          <FormActions onCancel={() => navigate('/users')} submitLabel={isEdit ? 'Update User' : 'Save User'} submitting={loading} />
        </form>
      </Card>
    </div>
  )
}
