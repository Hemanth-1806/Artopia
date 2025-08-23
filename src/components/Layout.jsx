import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Home, Plus, MessageSquare, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Layout = () => {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const navItems = [
    { to: '/app', icon: Home, label: 'Home', end: true },
    { to: '/app/create', icon: Plus, label: 'Create' },
    { to: '/app/chats', icon: MessageSquare, label: 'Chats' },
    { to: '/app/profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Artopia</h1>
          {profile && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hi, {profile.display_name}</span>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-pink-500 bg-pink-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout