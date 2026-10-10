import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react'
import Logo from '../Logo'
import { SERVICES } from '../../data/site'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Company' },
  { to: '/services', label: 'Services', dropdown: true },
  { to: '/careers', label: 'Careers / Jobs' },
  { to: '/clients', label: 'Client Companies' },
  { to: '/contact', label: 'Contact Us' },
]

const linkClass = ({ isActive }) =>
  `relative flex items-center gap-1 py-2 text-sm font-semibold transition-colors hover:text-brand-600 ${
    isActive ? 'text-brand-600 after:absolute after:inset-x-0 after:-bottom-[21px] after:h-0.5 after:bg-brand-600' : 'text-navy-900'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServices, setMobileServices] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const closeTimer = useRef()

  useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const dashboardPath = isAdmin ? '/admin' : '/candidate/dashboard'

  const openServices = () => {
    clearTimeout(closeTimer.current)
    setServicesOpen(true)
  }
  const closeServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main">
          {LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.to} className="relative" onMouseEnter={openServices} onMouseLeave={closeServices}>
                <NavLink
                  to={link.to}
                  className={linkClass}
                  onFocus={openServices}
                  aria-haspopup="true"
                  aria-expanded={servicesOpen}
                >
                  {link.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </NavLink>
                {servicesOpen && (
                  <div className="absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 pt-4">
                    <div className="card overflow-hidden p-2 shadow-xl">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onBlur={closeServices}
                          onFocus={openServices}
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        >
                          <s.icon className="h-4 w-4 text-brand-600" />
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to={dashboardPath} className="btn-primary">
                <LayoutDashboard className="h-4 w-4" />
                {isAdmin ? 'Admin Panel' : 'My Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn-outline px-3" aria-label="Logout" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              <UserRound className="h-4 w-4" /> Candidate Login
            </Link>
          )}
        </div>

        <button
          className="rounded-md p-2 text-navy-900 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="font-bold text-navy-900">Menu</span>
              <button onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-slate-100" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile">
              {LINKS.map((link) =>
                link.dropdown ? (
                  <div key={link.to}>
                    <button
                      onClick={() => setMobileServices((v) => !v)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left font-semibold text-navy-900 hover:bg-slate-50"
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileServices ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServices && (
                      <div className="mb-2 ml-3 border-l border-slate-200 pl-2">
                        <Link to="/services" className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                          All Services
                        </Link>
                        {SERVICES.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <s.icon className="h-4 w-4 text-brand-600" /> {s.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-3 font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-navy-900 hover:bg-slate-50'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>
            <div className="space-y-2 border-t border-slate-200 p-4">
              {user ? (
                <>
                  <Link to={dashboardPath} className="btn-primary w-full">
                    <LayoutDashboard className="h-4 w-4" /> {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="btn-outline w-full">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-primary w-full">
                    <UserRound className="h-4 w-4" /> Candidate Login
                  </Link>
                  <Link to="/register" className="btn-outline w-full">
                    Register as Candidate
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
