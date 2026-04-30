import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useEvents } from '../hooks/useFirestore'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/results', label: 'Results' },
  { to: '/media', label: 'Media' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { events } = useEvents()
  const liveCount = events.filter((e) => e.status === 'ongoing').length

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
            FS
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900 text-sm leading-tight">Sahityotsav 2026</p>
            <p className="text-xs text-gray-400 leading-tight">Feroke Division</p>
          </div>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {l.label}
              {l.to === '/schedule' && liveCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </NavLink>
          ))}
        </div>

        {/* Live pill + hamburger */}
        <div className="flex items-center gap-2">
          {liveCount > 0 && (
            <NavLink to="/schedule" className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1.5 rounded-full border border-green-200 hover:bg-green-100 transition-colors">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {liveCount} Live
            </NavLink>
          )}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
              {l.to === '/schedule' && liveCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {liveCount} Live
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
