import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Avatar from './Avatar'
import RoleGate from './RoleGate'

const adminBadge = (
  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
    Admin
  </span>
)

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">U</span>
          UserHub
        </Link>

        {isAuthenticated ? (
          <>
            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/users" className={linkClass}>
                Users
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                My Profile
              </NavLink>
              <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-3">
                <RoleGate roles={['admin']}>{adminBadge}</RoleGate>
                <Avatar user={user} size={32} />
                <button onClick={handleLogout} className="btn-secondary px-3 py-1.5">
                  Logout
                </button>
              </div>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <Link to="/register" className="btn-primary px-3 py-1.5">
              Register
            </Link>
          </nav>
        )}
      </div>

      {/* Mobile menu panel */}
      {isAuthenticated && open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center gap-3">
            <Avatar user={user} size={36} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-slate-800">{user?.name}</p>
                <RoleGate roles={['admin']}>{adminBadge}</RoleGate>
              </div>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <NavLink to="/users" className={linkClass} onClick={() => setOpen(false)}>
              Users
            </NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
              My Profile
            </NavLink>
            <button onClick={handleLogout} className="btn-secondary mt-1 px-3 py-2">
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
