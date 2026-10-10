import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import api, { getErrorMessage } from '../../lib/api'
import { formatDate, formatExperience, formatSalary } from '../../lib/format'
import { useToast } from '../../context/ToastContext'
import { useSocketEvent } from '../../context/SocketContext'
import { Alert, EmptyState, Modal, Pagination, Spinner } from '../../components/ui'

function StatusToggle({ job, onChange }) {
  const open = job.status === 'open'
  return (
    <button
      onClick={() => onChange(job, open ? 'closed' : 'open')}
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${open ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      title={open ? 'Click to close this job' : 'Click to re-open this job'}
    >
      {open ? 'Open' : 'Closed'}
    </button>
  )
}

export default function AdminJobs() {
  const toast = useToast()
  const [filters, setFilters] = useState({ q: '', status: '', page: 1 })
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    api
      .get('/jobs/admin/all', { params: { ...filters, limit: 10 } })
      .then(({ data }) => setResult(data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [filters])

  useEffect(load, [load])
  useSocketEvent('admin:job:changed', load)
  useSocketEvent('application:new', load)

  const changeStatus = async (job, status) => {
    try {
      await api.put(`/jobs/${job._id}`, { status })
      toast.success(`"${job.title}" is now ${status}`)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/jobs/${toDelete._id}`)
      toast.success('Job deleted')
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-sm text-slate-500">Post, edit and manage job openings.</p>
        </div>
        <Link to="/admin/jobs/new" className="btn-primary self-start">
          <Plus className="h-4 w-4" /> Post New Job
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setFilters({ ...filters, q: search, page: 1 })
        }}
        className="card flex flex-col gap-3 p-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, skills, location..." className="input pl-9" />
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="input sm:w-40" aria-label="Status">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button className="btn-primary">Search</button>
      </form>

      <Alert>{error}</Alert>

      <div className="card overflow-hidden">
        {!result ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : result.jobs.length === 0 ? (
          <EmptyState title="No jobs found" action={<Link to="/admin/jobs/new" className="btn-primary">Post a job</Link>} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-navy-900 uppercase">
                  <tr>
                    <th className="px-4 py-3">Job</th>
                    <th className="px-4 py-3">Experience / Salary</th>
                    <th className="px-4 py-3">Applicants</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="hidden px-4 py-3 xl:table-cell">Posted</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-navy-900">{job.title}</p>
                        <p className="text-xs text-slate-500">{job.location} · {job.department} · {job.employmentType}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{formatExperience(job)}</p>
                        <p className="text-xs">{formatSalary(job)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/applications?job=${job._id}`} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
                          <Users className="h-4 w-4" /> {job.applicationsCount}
                        </Link>
                      </td>
                      <td className="px-4 py-3"><StatusToggle job={job} onChange={changeStatus} /></td>
                      <td className="hidden px-4 py-3 text-slate-500 xl:table-cell">{formatDate(job.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link to={`/jobs/${job._id}`} target="_blank" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" title="View on site"><Eye className="h-4 w-4" /></Link>
                          <Link to={`/admin/jobs/${job._id}/edit`} className="rounded-md p-2 text-brand-600 hover:bg-brand-50" title="Edit"><Pencil className="h-4 w-4" /></Link>
                          <button onClick={() => setToDelete(job)} className="rounded-md p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 md:hidden">
              {result.jobs.map((job) => (
                <li key={job._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900">{job.title}</p>
                      <p className="text-xs text-slate-500">{job.location} · {formatExperience(job)} · {formatSalary(job)}</p>
                    </div>
                    <StatusToggle job={job} onChange={changeStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Link to={`/admin/applications?job=${job._id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                      <Users className="h-4 w-4" /> {job.applicationsCount} applicants
                    </Link>
                    <div className="flex gap-1">
                      <Link to={`/admin/jobs/${job._id}/edit`} className="rounded-md p-2 text-brand-600 hover:bg-brand-50" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => setToDelete(job)} className="rounded-md p-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 p-4">
              <Pagination page={result.page} pages={result.pages} onChange={(page) => setFilters({ ...filters, page })} />
            </div>
          </>
        )}
      </div>

      <Modal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete job?"
        footer={
          <>
            <button className="btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn-danger" disabled={deleting} onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" /> {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-slate-600">
          This will permanently delete <strong>{toDelete?.title}</strong> and all {toDelete?.applicationsCount || 0} of its applications. Consider
          closing the job instead if you want to keep the records.
        </p>
      </Modal>
    </div>
  )
}
