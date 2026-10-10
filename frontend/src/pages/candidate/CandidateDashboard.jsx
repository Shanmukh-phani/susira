import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Briefcase, CheckCircle2, Clock, Download, FileText, KeyRound, ListChecks, MapPin, Save, Upload, UserRound } from 'lucide-react'
import api, { assetUrl, getErrorMessage } from '../../lib/api'
import { formatDate, formatSalary, timeAgo } from '../../lib/format'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useSocketEvent } from '../../context/SocketContext'
import { Alert, EmptyState, Spinner, StatusBadge } from '../../components/ui'

const TABS = [
  { id: 'applications', label: 'My Applications', icon: ListChecks },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'password', label: 'Password', icon: KeyRound },
]

function profileCompletion(user) {
  const checks = [user.name, user.phone, user.location, user.headline, user.education, user.skills?.length, user.resume?.url]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function Applications() {
  const toast = useToast()
  const [apps, setApps] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api
      .get('/applications/me')
      .then(({ data }) => setApps(data.applications))
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  useEffect(load, [load])

  useSocketEvent('application:status', (data) => {
    setApps((list) => list?.map((a) => (a._id === data._id ? { ...a, status: data.status, adminNote: data.note, updatedAt: new Date().toISOString() } : a)))
    toast.info(`${data.job?.title}: ${data.statusLabel}`, 'Application status updated')
  })

  const withdraw = async (app) => {
    if (!window.confirm(`Withdraw your application for ${app.job?.title}?`)) return
    try {
      await api.delete(`/applications/me/${app._id}`)
      setApps((list) => list.filter((a) => a._id !== app._id))
      toast.success('Application withdrawn')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (error) return <Alert>{error}</Alert>
  if (!apps) return <div className="flex justify-center py-12"><Spinner /></div>
  if (apps.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        text="Browse open positions and apply to start tracking your applications here."
        action={<Link to="/careers" className="btn-primary">Browse Jobs</Link>}
      />
    )
  }

  return (
    <ul className="space-y-3">
      {apps.map((app) => (
        <li key={app._id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              {app.job ? (
                <Link to={`/jobs/${app.job._id}`} className="font-semibold text-navy-900 hover:text-brand-600">
                  {app.job.title}
                </Link>
              ) : (
                <span className="font-semibold text-slate-500">Job removed</span>
              )}
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {app.job?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{app.job.location}</span>}
                {app.job && <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{formatSalary(app.job)}</span>}
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Applied {formatDate(app.createdAt)}</span>
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>
          {app.adminNote && (
            <p className="mt-3 rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-800">
              <span className="font-semibold">Recruiter note:</span> {app.adminNote}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>Last updated {timeAgo(app.updatedAt)}</span>
            {['applied', 'under-review'].includes(app.status) && (
              <button onClick={() => withdraw(app)} className="font-semibold text-red-600 hover:underline">
                Withdraw
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

function ProfileForm() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState(() => ({
    name: user.name || '',
    phone: user.phone || '',
    location: user.location || '',
    headline: user.headline || '',
    experienceYears: user.experienceYears ?? 0,
    currentCompany: user.currentCompany || '',
    education: user.education || '',
    skills: (user.skills || []).join(', '),
    about: user.about || '',
  }))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const { data } = await api.put('/users/profile', form)
      setUser(data.user)
      toast.success('Profile saved')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Alert>{error}</Alert>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="p-name">Full Name *</label>
          <input id="p-name" required className="input" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="label" htmlFor="p-email">Email</label>
          <input id="p-email" disabled className="input" value={user.email} />
        </div>
        <div>
          <label className="label" htmlFor="p-phone">Phone</label>
          <input id="p-phone" type="tel" className="input" value={form.phone} onChange={update('phone')} />
        </div>
        <div>
          <label className="label" htmlFor="p-location">Location</label>
          <input id="p-location" className="input" value={form.location} onChange={update('location')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="p-headline">Professional Headline</label>
          <input id="p-headline" className="input" placeholder="e.g. React Developer with 4 years of experience" value={form.headline} onChange={update('headline')} />
        </div>
        <div>
          <label className="label" htmlFor="p-exp">Total Experience (years)</label>
          <input id="p-exp" type="number" min="0" step="0.5" className="input" value={form.experienceYears} onChange={update('experienceYears')} />
        </div>
        <div>
          <label className="label" htmlFor="p-company">Current Company</label>
          <input id="p-company" className="input" value={form.currentCompany} onChange={update('currentCompany')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="p-education">Highest Education</label>
          <input id="p-education" className="input" placeholder="e.g. B.Tech, Computer Science" value={form.education} onChange={update('education')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="p-skills">Key Skills</label>
          <input id="p-skills" className="input" placeholder="Comma separated, e.g. React, Node.js, SQL" value={form.skills} onChange={update('skills')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="p-about">About You</label>
          <textarea id="p-about" rows={4} className="input" value={form.about} onChange={update('about')} />
        </div>
      </div>
      <button disabled={saving} className="btn-primary">
        <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}

function ResumeUpload() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const choose = (e) => {
    const f = e.target.files?.[0]
    setError('')
    if (!f) return setFile(null)
    if (!/\.(pdf|docx?)$/i.test(f.name)) return setError('Only PDF, DOC or DOCX files are allowed')
    if (f.size > 5 * 1024 * 1024) return setError('Resume must be smaller than 5 MB')
    setFile(f)
  }

  const upload = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please choose a file')
    const data = new FormData()
    data.append('resume', file)
    setUploading(true)
    try {
      const res = await api.post('/users/resume', data)
      setUser(res.data.user)
      setFile(null)
      e.target.reset()
      toast.success('Resume uploaded successfully')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {user.resume?.url ? (
        <div className="flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy-900">{user.resume.originalName || 'Resume'}</p>
              <p className="text-xs text-slate-500">Uploaded {formatDate(user.resume.uploadedAt)}</p>
            </div>
          </div>
          <a href={assetUrl(user.resume.url)} target="_blank" rel="noreferrer" className="btn-outline btn-sm self-start sm:self-auto">
            <Download className="h-4 w-4" /> View
          </a>
        </div>
      ) : (
        <Alert>You haven't uploaded a resume yet. Upload one to apply for jobs faster.</Alert>
      )}
      <form onSubmit={upload} className="space-y-3">
        <label htmlFor="resume-file" className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-4 py-10 text-center hover:border-brand-500 hover:bg-brand-50/40">
          <Upload className="h-8 w-8 text-brand-600" />
          <span className="mt-2 font-semibold text-navy-900">{file ? file.name : 'Click to choose your resume'}</span>
          <span className="text-xs text-slate-500">PDF, DOC or DOCX up to 5 MB</span>
          <input id="resume-file" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={choose} />
        </label>
        <Alert>{error}</Alert>
        <button disabled={uploading || !file} className="btn-primary">
          <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : user.resume?.url ? 'Replace Resume' : 'Upload Resume'}
        </button>
      </form>
    </div>
  )
}

export function PasswordForm() {
  const toast = useToast()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirm) return setError('New passwords do not match')
    setSaving(true)
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword })
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
      toast.success('Password updated')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <Alert>{error}</Alert>
      {[
        ['currentPassword', 'Current Password', 'current-password'],
        ['newPassword', 'New Password', 'new-password'],
        ['confirm', 'Confirm New Password', 'new-password'],
      ].map(([key, label, ac]) => (
        <div key={key}>
          <label className="label" htmlFor={`pw-${key}`}>{label}</label>
          <input id={`pw-${key}`} type="password" required minLength={key === 'currentPassword' ? 1 : 6} autoComplete={ac} className="input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        </div>
      ))}
      <button disabled={saving} className="btn-primary">
        <KeyRound className="h-4 w-4" /> {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}

export default function CandidateDashboard() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'applications'
  const completion = profileCompletion(user)

  return (
    <section className="bg-slate-50 py-8 sm:py-10">
      <div className="container-x">
        <div className="card mb-6 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold sm:text-2xl">Welcome, {user.name}</h1>
              <p className="truncate text-sm text-slate-500">{user.headline || user.email}</p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="text-slate-600">Profile completion</span>
              <span className="text-brand-600">{completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${completion}%` }} />
            </div>
            {completion < 100 && (
              <button onClick={() => setParams({ tab: 'profile' })} className="mt-1 text-xs font-medium text-brand-600 hover:underline">
                Complete your profile
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="card flex gap-1 overflow-x-auto p-2 lg:h-fit lg:flex-col" aria-label="Dashboard">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setParams({ tab: t.id })}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium whitespace-nowrap ${
                  tab === t.id ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
            <Link to="/careers" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium whitespace-nowrap text-brand-600 hover:bg-brand-50">
              <Briefcase className="h-4 w-4" /> Browse Jobs
            </Link>
          </nav>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold">{TABS.find((t) => t.id === tab).label}</h2>
            {tab === 'applications' && <Applications />}
            {tab === 'profile' && <ProfileForm />}
            {tab === 'resume' && <ResumeUpload />}
            {tab === 'password' && <PasswordForm />}
          </div>
        </div>
      </div>
    </section>
  )
}
