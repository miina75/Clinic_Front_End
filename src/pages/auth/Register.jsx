import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { IconShieldPlus, IconEye, IconEyeOff } from '@tabler/icons-react'
import { Button, Card, FormField, Input, Select } from '../../components/ui'

const API = import.meta.env.VITE_CLINIC_API
const roles = ['Admin', 'Receptionist', 'Doctor', 'Patient']

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    passwordHash: '',
    confirmPassword: '',
    role: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.passwordHash !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const { confirmPassword, ...payload } = form
      const res = await axios.post(`${API}/Users`, payload)
      if (res.data.status) {
        navigate('/login')
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6">
      <Card className="w-full max-w-md rounded-2xl p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 mb-3">
            <IconShieldPlus size={28} color="white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Create Account</h1>
          <p className="text-xs text-gray-400 mt-1">Register to access the system</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Username">
            <Input name="username" type="text" placeholder="Enter username" value={form.username} onChange={handleChange} required />
          </FormField>

          <FormField label="Email">
            <Input name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} required />
          </FormField>

          <FormField label="Role">
            <Select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select role</option>
              {roles.map(r => <option key={r}>{r}</option>)}
            </Select>
          </FormField>

          <FormField label="Password">
            <div className="relative">
              <Input name="passwordHash" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.passwordHash} onChange={handleChange} required className="pr-10" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Password">
            <Input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} required />
          </FormField>

          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Login
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">© 2024 Clinic Management System</p>
      </Card>
    </div>
  )
}
