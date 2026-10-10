import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, CheckCircle2, FileText, Mail, Users } from 'lucide-react'
import api, { getErrorMessage } from '../../lib/api'
import { APPLICATION_STATUSES, timeAgo } from '../../lib/format'
import { useSocketEvent } from '../../context/SocketContext'
import { Alert, EmptyState, PageLoader, StatusBadge } from '../../components/ui'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api
      .get('/stats/admin')
      .then(({ data }) => setData(data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  useEffect(load, [load])
  useSocketEvent('application:new', load)
  useSocketEvent('application:updated', load)
  useSocketEvent('contact:new', load)
  useSocketEvent('candidate:new', load)
  useSocketEvent('admin:job:changed', load)

  if (error) return <Alert>{error}</Alert>
  if (!data) return <PageLoader />

  const { totals, byStatus, recentApplications, topJobs } = data
  const cards = [
    { label: 'Open Jobs', value: totals.openJobs, sub: `${totals.totalJobs} total`, icon: Briefcase, to: '/admin/jobs', color: 'bg-brand-50 text-brand-600' },
    { label: 'Applications', value: totals.applications, sub: `${byStatus.applied || 0} new`, icon: FileText, to: '/admin/applications', color: 'bg-amber-50 text-amber-600' },
    { label: 'Candidates', value: totals.candidates, sub: 'registered', icon: Users, to: '/admin/candidates', color: 'bg-teal-50 text-teal-600' },
    { label: 'Unread Messages', value: totals.unreadMessages, sub: 'enquiries', icon: Mail, to: '/admin/messages', color: 'bg-rose-50 text-rose-600' },
  ]
  const maxStatus = Math.max(1, ...Object.values(byStatus))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your recruitment pipeline - updates in real time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card flex items-center gap-4 p-5 transition hover:shadow-md">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${c.color}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{c.value}</p>
              <p className="text-sm text-slate-500">
                {c.label} <span className="text-xs text-slate-400">· {c.sub}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Recent Applications</h2>
            <Link to="/admin/applications" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <EmptyState title="No applications yet" text="Applications will appear here as candidates apply." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentApplications.map((a) => (
                <li key={a._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy-900">{a.candidate?.name || 'Deleted user'}</p>
                    <p className="truncate text-xs text-slate-500">
                      {a.job?.title || 'Deleted job'} · {timeAgo(a.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-bold">Pipeline by Status</h2>
          <ul className="space-y-3">
            {APPLICATION_STATUSES.map((s) => (
              <li key={s.value}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-semibold text-navy-900">{byStatus[s.value] || 0}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${((byStatus[s.value] || 0) / maxStatus) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold">Top Jobs by Applications</h2>
          <Link to="/admin/jobs/new" className="text-sm font-medium text-brand-600 hover:underline">
            + Post a job
          </Link>
        </div>
        {topJobs.length === 0 ? (
          <EmptyState title="No jobs posted" action={<Link to="/admin/jobs/new" className="btn-primary">Post your first job</Link>} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {topJobs.map((j) => (
              <li key={j._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <Link to={`/admin/applications?job=${j._id}`} className="font-medium text-navy-900 hover:text-brand-600">
                    {j.title}
                  </Link>
                  <p className="text-xs text-slate-500">{j.location}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-brand-600" /> {j.applicationsCount} applicants
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${j.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {j.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
