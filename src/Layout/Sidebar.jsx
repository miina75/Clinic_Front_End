import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  IconSun,
  IconMoon,
  IconX,
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

export default function Sidebar({ onLogout, mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1a2942] transition-transform duration-300 lg:static lg:w-auto lg:translate-x-0 ${collapsed ? 'lg:w-16' : 'lg:w-56'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500">
            <IconShieldPlus size={18} color="white" />
          </div>
          {!collapsed && <span className="text-sm font-semibold text-white">Clinic CMS</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden text-gray-400 transition-colors hover:text-white lg:inline-flex"
          >
            <IconMenu2 size={18} />
          </button>
          <button
            onClick={onMobileClose}
            className="text-gray-400 transition-colors hover:text-white lg:hidden"
          >
            <IconX size={18} />
          </button>
        </div>
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

      {/* Bottom */}
      <div className="border-t border-white/10 p-3 flex flex-col gap-1">

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          {darkMode
            ? <IconSun size={18} stroke={1.8} className="shrink-0" />
            : <IconMoon size={18} stroke={1.8} className="shrink-0" />
          }
          {!collapsed && (darkMode ? 'Light Mode' : 'Dark Mode')}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <IconLogout size={18} stroke={1.8} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}