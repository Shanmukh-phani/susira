import { useCallback, useEffect, useState } from 'react'
import { Download, Eye, Mail, MapPin, Phone, Search } from 'lucide-react'
import api, { assetUrl, getErrorMessage } from '../../lib/api'
import { formatDate } from '../../lib/format'
import { useSocketEvent } from '../../context/SocketContext'
import { Alert, EmptyState, Modal, Pagination, Spinner, StatusBadge } from '../../components/ui'

function CandidateModal({ id, onClose }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/users/candidates/${id}`).then(({ data }) => setData(data)).catch((err) => setError(getErrorMessage(err)))
  }, [id])

  const c = data?.candidate
  return (
    <Modal open onClose={onClose} title="Candidate Profile" size="max-w-2xl">
      <Alert>{error}</Alert>
      {!data && !error ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : c ? (
        <div className="space-y-5">
          <div>
            <p className="text-lg font-bold text-navy-900">{c.name}</p>
            {c.headline && <p className="text-sm text-slate-500">{c.headline}</p>}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-brand-600"><Mail className="h-4 w-4" />{c.email}</a>
              {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-brand-600"><Phone className="h-4 w-4" />{c.phone}</a>}
              {c.location && <span className="flex items-center gap-1 text-slate-600"><MapPin className="h-4 w-4" />{c.location}</span>}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-3">
            {[
              ['Experience', `${c.experienceYears || 0} yrs`],
              ['Current company', c.currentCompany || '-'],
              ['Education', c.education || '-'],
              ['Registered', formatDate(c.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="font-medium break-words text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>
          {c.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <span key={s} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">{s}</span>)}
            </div>
          )}
          {c.about && <p className="text-sm whitespace-pre-line text-slate-600">{c.about}</p>}
          {c.resume?.url ? (
            <a href={assetUrl(c.resume.url)} target="_blank" rel="noreferrer" className="btn-outline">
              <Download className="h-4 w-4" /> View Resume
            </a>
          ) : (
            <p className="text-sm text-slate-500">No resume uploaded.</p>
          )}
          <div>
            <p className="mb-2 text-sm font-semibold">Applications ({data.applications.length})</p>
            {data.applications.length === 0 ? (
              <p className="text-sm text-slate-500">This candidate hasn't applied to any jobs yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {data.applications.map((a) => (
                  <li key={a._id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                    <span className="min-w-0 truncate">{a.job?.title || 'Deleted job'}</span>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

export default function AdminCandidates() {
  const [query, setQuery] = useState({ q: '', page: 1 })
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    api
      .get('/users/candidates', { params: { ...query, limit: 12 } })
      .then(({ data }) => setResult(data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [query])

  useEffect(load, [load])
  useSocketEvent('candidate:new', load)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-sm text-slate-500">All registered job seekers.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setQuery({ q: search.trim(), page: 1 }) }} className="card flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, skill or location" className="input pl-9" />
        </div>
        <button className="btn-primary">Search</button>
      </form>
      <Alert>{error}</Alert>
      {!result ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : result.candidates.length === 0 ? (
        <div className="card"><EmptyState title="No candidates found" /></div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.candidates.map((c) => (
              <div key={c._id} className="card flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{c.name?.[0]?.toUpperCase()}</div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">{c.name}</p>
                    <p className="truncate text-xs text-slate-500">{c.email}</p>
                    {c.location && <p className="text-xs text-slate-500">{c.location}</p>}
                  </div>
                </div>
                {c.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.skills.slice(0, 4).map((s) => <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{s}</span>)}
                    {c.skills.length > 4 && <span className="text-xs text-slate-400">+{c.skills.length - 4}</span>}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-slate-500">
                  <span>{c.applicationsCount} application{c.applicationsCount === 1 ? '' : 's'} · {c.resume?.url ? 'Resume ✓' : 'No resume'}</span>
                  <button onClick={() => setSelected(c._id)} className="btn-outline btn-sm"><Eye className="h-4 w-4" /> View</button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={result.page} pages={result.pages} onChange={(page) => setQuery({ ...query, page })} />
        </>
      )}
      {selected && <CandidateModal id={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
