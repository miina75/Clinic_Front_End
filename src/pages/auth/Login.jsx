import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { IconShieldPlus, IconEye, IconEyeOff } from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', passwordHash: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 mb-3">
            <IconShieldPlus size={28} color="white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Clinic Management System</h1>
          <p className="text-xs text-gray-400 mt-1">Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                name="passwordHash"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.passwordHash}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline font-medium">
            Register
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">© 2024 Clinic Management System</p>
      </div>
    </div>
  )
}