import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { IconBell, IconMenu2 } from '@tabler/icons-react'
import Sidebar from '../layout/Sidebar'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <IconMenu2 size={20} />
          </button>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button className="relative text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <IconBell size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
                {user?.username}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}