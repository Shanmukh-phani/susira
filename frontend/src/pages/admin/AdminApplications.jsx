import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, Eye, Mail, Phone, Search, X } from 'lucide-react'
import api, { assetUrl, getErrorMessage } from '../../lib/api'
import { APPLICATION_STATUSES, formatDate, timeAgo } from '../../lib/format'
import { useToast } from '../../context/ToastContext'
import { useSocketEvent } from '../../context/SocketContext'
import { Alert, EmptyState, Modal, Pagination, Spinner, StatusBadge } from '../../components/ui'

function ApplicationModal({ id, onClose, onUpdated }) {
  const toast = useToast()
  const [app, setApp] = useState(null)
  const [status, setStatus] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/applications/${id}`).then(({ data }) => {
      setApp(data.application)
      setStatus(data.application.status)
      setNote(data.application.adminNote || '')
    })
  }, [id])

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await api.patch(`/applications/${id}/status`, { status, note })
      toast.success('Status updated - candidate has been notified')
      onUpdated(data.application)
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setSaving(false)
    }
  }

  const c = app?.candidate
  return (
    <Modal
      open
      onClose={onClose}
      title="Application Details"
      size="max-w-2xl"
      footer={
        app && (
          <>
            <button className="btn-outline" onClick={onClose}>Close</button>
            <button className="btn-primary" disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Update Status'}</button>
          </>
        )
      }
    >
      {!app ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-navy-900">{c?.name || 'Deleted user'}</p>
              <p className="text-sm text-slate-500">{c?.headline}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {c?.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-brand-600"><Mail className="h-4 w-4" />{c.email}</a>}
                {c?.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-brand-600"><Phone className="h-4 w-4" />{c.phone}</a>}
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-3">
            {[
              ['Applied for', app.job?.title || 'Deleted job'],
              ['Applied on', formatDate(app.createdAt)],
              ['Location', c?.location || '-'],
              ['Experience', c ? `${c.experienceYears || 0} yrs` : '-'],
              ['Expected salary', app.expectedSalary || '-'],
              ['Notice period', app.noticePeriod || '-'],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="font-medium break-words text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>

          {c?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <span key={s} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">{s}</span>)}
            </div>
          )}

          {app.coverLetter && (
            <div>
              <p className="mb-1 text-sm font-semibold">Cover letter</p>
              <p className="rounded-lg border border-slate-200 p-3 text-sm whitespace-pre-line text-slate-600">{app.coverLetter}</p>
            </div>
          )}

          <a href={assetUrl(app.resume?.url)} target="_blank" rel="noreferrer" className="btn-outline">
            <Download className="h-4 w-4" /> View Resume {app.resume?.originalName ? `(${app.resume.originalName})` : ''}
          </a>

          <div className="grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="app-status">Update status</label>
              <select id="app-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {APPLICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="app-note">Note to candidate (optional)</label>
              <input id="app-note" className="input" placeholder="e.g. Interview on Monday 10 AM" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>

          {app.history?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">History</p>
              <ol className="space-y-2 border-l-2 border-brand-100 pl-4">
                {[...app.history].reverse().map((h, i) => (
                  <li key={i} className="text-sm">
                    <StatusBadge status={h.status} /> <span className="ml-1 text-xs text-slate-500">{timeAgo(h.at)}</span>
                    {h.note && <p className="mt-0.5 text-slate-600">{h.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default function AdminApplications() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const toast = useToast()

  const status = params.get('status') || ''
  const job = params.get('job') || ''
  const page = Number(params.get('page')) || 1
  const q = params.get('q') || ''

  const setParam = (updates) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    if (!('page' in updates)) next.delete('page')
    setParams(next)
  }

  const load = useCallback(() => {
    api
      .get('/applications', { params: { status, job, page, q, limit: 10 } })
      .then(({ data }) => setResult(data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [status, job, page, q])

  useEffect(load, [load])
  useEffect(() => {
    if (!job) return setJobTitle('')
    api.get(`/jobs/${job}`).then(({ data }) => setJobTitle(data.job.title)).catch(() => setJobTitle('Selected job'))
  }, [job])

  useSocketEvent('application:new', load)
  useSocketEvent('application:withdrawn', load)

  const quickStatus = async (app, newStatus) => {
    try {
      await api.patch(`/applications/${app._id}/status`, { status: newStatus })
      toast.success(`${app.candidate?.name}: ${APPLICATION_STATUSES.find((s) => s.value === newStatus).label}`)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm text-slate-500">Review candidates, view resumes and move them through the hiring pipeline.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ value: '', label: 'All' }, ...APPLICATION_STATUSES].map((s) => (
          <button
            key={s.value}
            onClick={() => setParam({ status: s.value })}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${status === s.value ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setParam({ q: search.trim() }) }} className="card flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate name, email or job title" className="input pl-9" />
        </div>
        <button className="btn-primary">Search</button>
      </form>

      {job && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">Showing applicants for</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">
            {jobTitle || '...'}
            <button onClick={() => setParam({ job: '' })} aria-label="Clear job filter"><X className="h-3.5 w-3.5" /></button>
          </span>
        </div>
      )}

      <Alert>{error}</Alert>

      <div className="card overflow-hidden">
        {!result ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : result.applications.length === 0 ? (
          <EmptyState title="No applications found" text="Try another status or clear your search." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-navy-900 uppercase">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Job</th>
                    <th className="hidden px-4 py-3 lg:table-cell">Applied</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.applications.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-navy-900">{a.candidate?.name || 'Deleted user'}</p>
                        <p className="text-xs text-slate-500">{a.candidate?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-navy-900">{a.job?.title || 'Deleted job'}</p>
                        <p className="text-xs text-slate-500">{a.job?.location}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">{timeAgo(a.createdAt)}</td>
                      <td className="px-4 py-3">
                        <select
                          aria-label="Change status"
                          value={a.status}
                          onChange={(e) => quickStatus(a, e.target.value)}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium"
                        >
                          {APPLICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <a href={assetUrl(a.resume?.url)} target="_blank" rel="noreferrer" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" title="Resume"><Download className="h-4 w-4" /></a>
                          <button onClick={() => setSelected(a._id)} className="rounded-md p-2 text-brand-600 hover:bg-brand-50" title="View details"><Eye className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 md:hidden">
              {result.applications.map((a) => (
                <li key={a._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900">{a.candidate?.name || 'Deleted user'}</p>
                      <p className="truncate text-xs text-slate-500">{a.job?.title} · {timeAgo(a.createdAt)}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setSelected(a._id)} className="btn-primary btn-sm flex-1"><Eye className="h-4 w-4" /> Review</button>
                    <a href={assetUrl(a.resume?.url)} target="_blank" rel="noreferrer" className="btn-outline btn-sm"><Download className="h-4 w-4" /> Resume</a>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 p-4">
              <Pagination page={result.page} pages={result.pages} onChange={(p) => setParam({ page: String(p) })} />
            </div>
          </>
        )}
      </div>

      {selected && <ApplicationModal id={selected} onClose={() => setSelected(null)} onUpdated={load} />}
      <p className="text-center text-xs text-slate-400">
        Tip: open a job's applicants from the <Link to="/admin/jobs" className="text-brand-600">Jobs</Link> page.
      </p>
    </div>
  )
}
