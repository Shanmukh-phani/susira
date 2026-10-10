import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, ShieldCheck, UserPlus } from 'lucide-react'
import { getErrorMessage } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { Alert } from '../../components/ui'
import Logo from '../../components/Logo'
import { COMPANY, IMAGES } from '../../data/site'

const safeNext = (value, fallback) => (value && value.startsWith('/') && !value.startsWith('//') ? value : fallback)

function PasswordInput({ id, value, onChange, placeholder = '••••••••', autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        required
        minLength={6}
        className="input pr-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

function AuthShell({ title, subtitle, children, aside }) {
  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="container-x">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="relative hidden bg-navy-900 lg:block">
            <img src={IMAGES.team} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div className="relative flex h-full flex-col justify-end p-10 text-white">{aside}</div>
          </div>
          <div className="p-6 sm:p-10">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

const candidateAside = (
  <>
    <h2 className="text-3xl font-bold text-white">Your next career move starts here.</h2>
    <ul className="mt-6 space-y-2 text-slate-200">
      <li>✓ Apply to verified jobs in one click</li>
      <li>✓ Upload your resume once, reuse it everywhere</li>
      <li>✓ Track every application in real time</li>
    </ul>
  </>
)

export function CandidateLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'), '/candidate/dashboard')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : next} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(next, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Candidate Login" subtitle="Sign in to apply for jobs and track your applications." aside={candidateAside}>
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <PasswordInput id="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button disabled={loading} className="btn-primary w-full py-3">
          <LogIn className="h-4 w-4" /> {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to={`/register${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-brand-600">
          Register as Candidate
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        Are you an administrator? <Link to="/admin/login" className="font-medium text-brand-600">Admin Login</Link>
      </p>
    </AuthShell>
  )
}

export function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'), '/candidate/dashboard?tab=profile')
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', password: '', confirm: '' })
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/candidate/dashboard'} replace />

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (!agree) return setError('Please accept the Terms & Conditions')
    setLoading(true)
    try {
      const { confirm: _confirm, ...payload } = form
      await register(payload)
      navigate(next, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Register as Candidate" subtitle="Create your free profile and let employers find you." aside={candidateAside}>
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div>
          <label className="label" htmlFor="r-name">Full Name *</label>
          <input id="r-name" required autoComplete="name" className="input" value={form.name} onChange={update('name')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="r-email">Email *</label>
            <input id="r-email" type="email" required autoComplete="email" className="input" value={form.email} onChange={update('email')} />
          </div>
          <div>
            <label className="label" htmlFor="r-phone">Phone</label>
            <input id="r-phone" type="tel" autoComplete="tel" className="input" value={form.phone} onChange={update('phone')} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="r-location">Current Location</label>
          <input id="r-location" className="input" placeholder="e.g. Hyderabad" value={form.location} onChange={update('location')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="r-password">Password *</label>
            <PasswordInput id="r-password" autoComplete="new-password" value={form.password} onChange={update('password')} placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="label" htmlFor="r-confirm">Confirm Password *</label>
            <PasswordInput id="r-confirm" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            I agree to the <Link to="/terms" className="text-brand-600">Terms &amp; Conditions</Link> and{' '}
            <Link to="/privacy-policy" className="text-brand-600">Privacy Policy</Link>
          </span>
        </label>
        <button disabled={loading} className="btn-primary w-full py-3">
          <UserPlus className="h-4 w-4" /> {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
      </p>
    </AuthShell>
  )
}

export function AdminLogin() {
  const { adminLogin, user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'), '/admin')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user?.role === 'admin') return <Navigate to={next} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(form)
      navigate(next.startsWith('/admin') ? next : '/admin', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo light />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Login</h1>
              <p className="text-sm text-slate-500">Manage jobs, candidates &amp; applications</p>
            </div>
          </div>
          {user && user.role !== 'admin' && (
            <div className="mb-4">
              <Alert>You are signed in as a candidate. Sign in with an admin account to continue.</Alert>
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <Alert>{error}</Alert>
            <div>
              <label className="label" htmlFor="a-email">Admin Email</label>
              <input id="a-email" type="email" required autoComplete="username" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="a-password">Password</label>
              <PasswordInput id="a-password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button disabled={loading} className="btn-primary w-full py-3">
              <Lock className="h-4 w-4" /> {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-slate-300">
          <Link to="/" className="hover:text-white">← Back to {COMPANY.website}</Link>
        </p>
      </div>
    </div>
  )
}
