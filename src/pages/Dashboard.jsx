import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  IconUsers,
  IconStethoscope,
  IconCalendarEvent,
  IconReceipt,
} from '@tabler/icons-react'

const API = import.meta.env.VITE_CLINIC_API

export default function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({ patients: 0, doctors: 0, visits: 0, bills: 0 })
  const [recentVisits, setRecentVisits] = useState([])
  const [patients, setPatients] = useState({})
  const [doctors, setDoctors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    try {
      setLoading(true)
      const [pRes, dRes, vRes, bRes] = await Promise.allSettled([
        axios.get(`${API}/Patient`),
        axios.get(`${API}/Doctor`),
        axios.get(`${API}/Visit`),
        axios.get(`${API}/Bill`),
      ])

      if (pRes.status === 'fulfilled' && pRes.value.data.status) {
        const data = pRes.value.data.data
        setStats(s => ({ ...s, patients: data.length }))
        const map = {}
        data.forEach(p => { map[p.patientId] = `${p.firstName} ${p.lastName}` })
        setPatients(map)
      }

      if (dRes.status === 'fulfilled' && dRes.value.data.status) {
        const data = dRes.value.data.data
        setStats(s => ({ ...s, doctors: data.length }))
        const map = {}
        data.forEach(d => { map[d.doctorId] = `${d.firstName} ${d.lastName}` })
        setDoctors(map)
      }

      if (vRes.status === 'fulfilled' && vRes.value.data.status) {
        const data = vRes.value.data.data
        setStats(s => ({ ...s, visits: data.length }))
        setRecentVisits(data.slice(0, 5))
      }

      if (bRes.status === 'fulfilled' && bRes.value.data.status) {
        setStats(s => ({ ...s, bills: bRes.value.data.data.length }))
      }

    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { label: 'Total Patients', value: stats.patients, icon: IconUsers, color: 'bg-blue-500', link: '/patients', linkLabel: 'View all patients' },
    { label: 'Total Doctors', value: stats.doctors, icon: IconStethoscope, color: 'bg-green-500', link: '/doctors', linkLabel: 'View all doctors' },
    { label: 'Total Visits', value: stats.visits, icon: IconCalendarEvent, color: 'bg-orange-500', link: '/visits', linkLabel: 'View all visits' },
    { label: 'Total Bills', value: stats.bills, icon: IconReceipt, color: 'bg-red-500', link: '/bills', linkLabel: 'View all bills' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, link, linkLabel }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={`${color} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl`}>
              <Icon size={22} color="white" stroke={1.8} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {loading ? '...' : value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
              <button
                onClick={() => navigate(link)}
                className="text-xs text-blue-500 hover:underline"
              >
                {linkLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Visits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Visits</h3>
          <button
            onClick={() => navigate('/visits')}
            className="text-xs text-blue-500 hover:underline"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
        ) : recentVisits.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No visits found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs text-gray-400 uppercase">
                <th className="pb-3 font-medium">VisitId</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Diagnosis</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.map((visit, i) => (
                <tr key={visit.visitId} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 text-gray-400">{visit.visitId}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-200 font-medium">
                    {patients[visit.patientId] ?? `Patient #${visit.patientId}`}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    {doctors[visit.doctorId] ?? `Doctor #${visit.doctorId}`}
                  </td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">
                    {visit.visitDate?.split('T')[0]}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{visit.diagnosis}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}