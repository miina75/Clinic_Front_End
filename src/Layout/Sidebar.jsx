import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  IconLayoutDashboard,
  IconUsers,
  IconStethoscope,
  IconCalendarEvent,
  IconPill,
  IconReceipt,
  IconUser,
  IconLogout,
  IconMenu2,
  IconShieldPlus,
} from '@tabler/icons-react'

const navItems = [
  { label: 'Dashboard', icon: IconLayoutDashboard, to: '/dashboard' },
  { label: 'Patients', icon: IconUsers, to: '/patients' },
  { label: 'Doctors', icon: IconStethoscope, to: '/doctors' },
  { label: 'Visits', icon: IconCalendarEvent, to: '/visits' },
  { label: 'Prescriptions', icon: IconPill, to: '/prescriptions' },
  { label: 'Bills', icon: IconReceipt, to: '/bills' },
  { label: 'Users', icon: IconUser, to: '/users' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <aside
      className={`flex flex-col bg-[#1a2942] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500">
            <IconShieldPlus size={18} color="white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-white">Clinic CMS</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IconMenu2 size={18} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} stroke={1.8} className="shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => navigate('/login')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <IconLogout size={18} stroke={1.8} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}