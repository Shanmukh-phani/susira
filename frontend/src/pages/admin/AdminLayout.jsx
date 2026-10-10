import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, ExternalLink, FileText, KeyRound, LayoutDashboard, LogOut, Mail, Menu, Plus, Users, X } from 'lucide-react'
import Logo from '../../components/Logo'
import { COMPANY } from '../../data/site'
import { useAuth } from '../../context/AuthContext'
import { useSocket, useSocketEvent } from '../../context/SocketContext'
import { useToast } from '../../context/ToastContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/applications', label: 'Applications', icon: FileText, badge: 'applications' },
  { to: '/admin/candidates', label: 'Candidates', icon: Users },
  { to: '/admin/messages', label: 'Messages', icon: Mail, badge: 'messages' },
  { to: '/admin/settings', label: 'Change Password', icon: KeyRound },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { connected } = useSocket()
  const toast = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [badges, setBadges] = useState({ applications: 0, messages: 0 })

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
    if (pathname.startsWith('/admin/applications')) setBadges((b) => ({ ...b, applications: 0 }))
    if (pathname.startsWith('/admin/messages')) setBadges((b) => ({ ...b, messages: 0 }))
  }, [pathname])

  useSocketEvent('application:new', (app) => {
    toast.info(`${app.candidate?.name} applied for ${app.job?.title}`, 'New application')
    if (!pathname.startsWith('/admin/applications')) setBadges((b) => ({ ...b, applications: b.applications + 1 }))
  })
  useSocketEvent('contact:new', (msg) => {
    toast.info(`${msg.name}: ${msg.subject || msg.message.slice(0, 60)}`, 'New enquiry')
    if (!pathname.startsWith('/admin/messages')) setBadges((b) => ({ ...b, messages: b.messages + 1 }))
  })
  useSocketEvent('candidate:new', (c) => toast.info(`${c.name} just registered`, 'New candidate'))

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-5">
        <Logo light to="/admin" name={COMPANY.shortName} subtitle="Admin Panel" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {item.badge && badges[item.badge] > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{badges[item.badge]}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View Website
        </Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-900 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-navy-900 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-3 rounded-md p-1.5 text-slate-300 hover:bg-white/10" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <span
              className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${
                connected ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}
              title="Real-time connection"
            >
              <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-slate-400'}`} />
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/jobs/new" className="btn-primary btn-sm">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Post Job</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden leading-tight md:block">
                <p className="text-sm font-semibold text-navy-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
