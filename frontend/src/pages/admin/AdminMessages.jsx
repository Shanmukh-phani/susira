import { useCallback, useEffect, useState } from 'react'
import { Building2, Mail, MailOpen, Phone, Trash2 } from 'lucide-react'
import api, { getErrorMessage } from '../../lib/api'
import { formatDate, timeAgo } from '../../lib/format'
import { useToast } from '../../context/ToastContext'
import { useSocketEvent } from '../../context/SocketContext'
import { Alert, EmptyState, Pagination, Spinner } from '../../components/ui'

const TYPE_LABELS = { general: 'General', employer: 'Employer', candidate: 'Job seeker' }

export default function AdminMessages() {
  const toast = useToast()
  const [query, setQuery] = useState({ type: '', unread: '', page: 1 })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(() => {
    api
      .get('/contact', { params: { ...query, limit: 10 } })
      .then(({ data }) => setResult(data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [query])

  useEffect(load, [load])
  useSocketEvent('contact:new', load)

  const toggleOpen = async (m) => {
    setExpanded(expanded === m._id ? null : m._id)
    if (!m.isRead) {
      await api.patch(`/contact/${m._id}/read`, { isRead: true }).catch(() => {})
      load()
    }
  }

  const markUnread = async (m) => {
    await api.patch(`/contact/${m._id}/read`, { isRead: false })
    load()
  }

  const remove = async (m) => {
    if (!window.confirm(`Delete message from ${m.name}?`)) return
    try {
      await api.delete(`/contact/${m._id}`)
      toast.success('Message deleted')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-slate-500">Enquiries from the Contact Us page{result ? ` · ${result.unread} unread` : ''}.</p>
        </div>
        <div className="flex gap-2">
          <select className="input py-2" value={query.type} onChange={(e) => setQuery({ ...query, type: e.target.value, page: 1 })} aria-label="Type">
            <option value="">All types</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select className="input py-2" value={query.unread} onChange={(e) => setQuery({ ...query, unread: e.target.value, page: 1 })} aria-label="Read status">
            <option value="">All</option>
            <option value="true">Unread only</option>
          </select>
        </div>
      </div>
      <Alert>{error}</Alert>
      <div className="card overflow-hidden">
        {!result ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : result.messages.length === 0 ? (
          <EmptyState title="No messages" text="Enquiries submitted on the website will show up here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {result.messages.map((m) => (
              <li key={m._id} className={m.isRead ? '' : 'bg-brand-50/40'}>
                <button onClick={() => toggleOpen(m)} className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-slate-50 sm:px-5">
                  {m.isRead ? <MailOpen className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" /> : <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3">
                      <p className={`truncate ${m.isRead ? 'text-slate-700' : 'font-semibold text-navy-900'}`}>{m.name}</p>
                      <span className="text-xs text-slate-400">{timeAgo(m.createdAt)}</span>
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs">{TYPE_LABELS[m.type]}</span>
                      {m.subject || m.message}
                    </p>
                  </div>
                </button>
                {expanded === m._id && (
                  <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pl-13">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-brand-600"><Mail className="h-4 w-4" />{m.email}</a>
                      {m.phone && <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-brand-600"><Phone className="h-4 w-4" />{m.phone}</a>}
                      {m.company && <span className="flex items-center gap-1 text-slate-600"><Building2 className="h-4 w-4" />{m.company}</span>}
                    </div>
                    <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm whitespace-pre-line text-slate-700">{m.message}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400">Received {formatDate(m.createdAt)}</span>
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Your enquiry'}`)}`} className="btn-primary btn-sm">Reply</a>
                      <button onClick={() => markUnread(m)} className="btn-outline btn-sm">Mark unread</button>
                      <button onClick={() => remove(m)} className="btn-sm btn text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {result && (
          <div className="border-t border-slate-100 p-4">
            <Pagination page={result.page} pages={result.pages} onChange={(page) => setQuery({ ...query, page })} />
          </div>
        )}
      </div>
    </div>
  )
}
