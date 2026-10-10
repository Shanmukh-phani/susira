import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  `flex items-center gap-1 rounded-full px-2.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors xl:px-4 xl:text-sm ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-navy-900 hover:bg-slate-100/80 hover:text-brand-600'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServices, setMobileServices] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const closeTimer = useRef()

  useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'border-slate-200/70 bg-white/80 shadow-soft' : 'border-transparent bg-white/60'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-3 lg:h-[76px]">
        <Logo />

        <nav className="hidden items-center gap-0.5 rounded-full border border-slate-200/70 bg-white/70 p-1 shadow-soft lg:flex" aria-label="Main">
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
                  <div className="absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 pt-3">
                    <div className="glass animate-fade-up grid gap-1 rounded-2xl p-2 shadow-lift">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onBlur={closeServices}
                          onFocus={openServices}
                          className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-brand-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                            <s.icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-navy-900">{s.title}</span>
                            <span className="block truncate text-xs text-slate-500">{s.short}</span>
                          </span>
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
              <Link to={dashboardPath} className="btn-primary px-4 xl:px-5">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden xl:inline">{isAdmin ? 'Admin Panel' : 'My Dashboard'}</span>
                <span className="xl:hidden">Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline px-3" aria-label="Logout" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary px-4 xl:px-5">
              <UserRound className="h-4 w-4" /> <span className="hidden xl:inline">Candidate</span> Login
            </Link>
          )}
        </div>

        <button
          className="rounded-full border border-slate-200 bg-white p-2.5 text-navy-900 shadow-soft hover:bg-slate-50 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="animate-fade-up absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col rounded-l-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-lg font-bold text-navy-900">Menu</span>
              <button onClick={() => setOpen(false)} className="rounded-full border border-slate-200 p-2 hover:bg-slate-50" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
              {LINKS.map((link) =>
                link.dropdown ? (
                  <div key={link.to}>
                    <button
                      onClick={() => setMobileServices((v) => !v)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-navy-900 hover:bg-slate-50"
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileServices ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServices && (
                      <div className="mb-2 ml-4 border-l-2 border-brand-100 pl-2">
                        <Link to="/services" className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                          All Services
                        </Link>
                        {SERVICES.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
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
                      `block rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-navy-900 hover:bg-slate-50'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>
            <div className="space-y-2 border-t border-slate-100 p-4">
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
        </div>,
        document.body
      )}
    </header>
  )
}
