import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { IconShieldPlus, IconEye, IconEyeOff } from '@tabler/icons-react'
import { Button, Card, FormField, Input } from '../../components/ui'

const API = import.meta.env.VITE_CLINIC_API

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', passwordHash: '' })
  const [resetForm, setResetForm] = useState({ username: '', newPassword: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
    setMessage(null)
  }

  function handleResetChange(e) {
    setResetForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
    setMessage(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setMessage(null)
      const res = await axios.get(`${API}/Users`)
      if (res.data.status) {
        const found = res.data.data.find(
          u => u.username === form.username && u.passwordHash === form.passwordHash
        )
        if (found) {
          login(found)
          navigate('/dashboard')
        } else {
          setError('Invalid username or password')
        }
      } else {
        setError('Failed to connect to server')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault()
    if (!resetForm.username || !resetForm.newPassword || !resetForm.confirmPassword) {
      setError('Please complete all reset fields')
      return
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setMessage(null)

      const res = await axios.get(`${API}/Users`)
      if (!res.data.status) {
        setError('Failed to connect to server')
        return
      }

      const found = res.data.data.find(u => u.username === resetForm.username)
      if (!found) {
        setError('No account found for that username')
        return
      }

      const updateRes = await axios.put(`${API}/Users/${found.userId}`, {
        ...found,
        passwordHash: resetForm.newPassword,
      })

      if (updateRes.data.status) {
        setMessage('Password updated successfully. You can now sign in with your new password.')
        setResetForm({ username: resetForm.username, newPassword: '', confirmPassword: '' })
        setIsResetMode(false)
        setForm(f => ({ ...f, username: resetForm.username }))
      } else {
        setError(updateRes.data.message || 'Failed to reset password')
      }
    } catch (err) {
      setError('Failed to reset password')
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
          <h1 className="text-lg font-bold text-gray-800">Clinic Management System</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isResetMode ? 'Reset your password to regain access.' : 'Welcome back! Please login to your account.'}
          </p>
        </div>

        {(error || message) && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {message || error}
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
            <FormField label="Username">
              <Input name="username" type="text" placeholder="Enter your username" value={resetForm.username} onChange={handleResetChange} required />
            </FormField>

            <FormField label="New Password">
              <Input name="newPassword" type="password" placeholder="Enter a new password" value={resetForm.newPassword} onChange={handleResetChange} required />
            </FormField>

            <FormField label="Confirm New Password">
              <Input name="confirmPassword" type="password" placeholder="Confirm your new password" value={resetForm.confirmPassword} onChange={handleResetChange} required />
            </FormField>

            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Username">
              <Input name="username" type="text" placeholder="Enter your username" value={form.username} onChange={handleChange} required />
            </FormField>

            <FormField label="Password">
              <div className="relative">
                <Input name="passwordHash" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.passwordHash} onChange={handleChange} required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </FormField>

            <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsResetMode(!isResetMode)
              setError(null)
              setMessage(null)
            }}
            className="text-sm font-medium text-blue-500 hover:underline"
          >
            {isResetMode ? 'Back to login' : 'Forgot password?'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline font-medium">Register</Link></p>
        <p className="text-center text-xs text-gray-400 mt-4">© 2024 Clinic Management System</p>
      </Card>
    </div>
  )
}
