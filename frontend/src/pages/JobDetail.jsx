import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  IndianRupee,
  Layers,
  MapPin,
  Send,
  Users,
} from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'
import { formatDate, formatExperience, formatSalary } from '../lib/format'
import PageBanner from '../components/PageBanner'
import ApplyModal from '../components/jobs/ApplyModal'
import { EmptyState, PageLoader } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useSocketEvent } from '../context/SocketContext'
import useAppliedJobIds from '../hooks/useAppliedJobIds'

function ListSection({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-bold text-navy-900">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-slate-600">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user, isAdmin } = useAuth()
  const { appliedIds, refreshApplied } = useAppliedJobIds()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [applyOpen, setApplyOpen] = useState(false)

  const load = useCallback(() => {
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(getErrorMessage(err, 'Job not found')))
  }, [id])

  useEffect(() => {
    setData(null)
    setError('')
    load()
  }, [load])

  useSocketEvent('job:updated', (job) => job._id === id && load())
  useSocketEvent('job:deleted', (job) => {
    if (job._id === id) setError('This job has been removed by the recruiter.')
  })

  if (error) {
    return (
      <div className="container-x py-16">
        <EmptyState
          title="Job not available"
          text={error}
          action={
            <Link to="/careers" className="btn-primary">
              Browse all jobs
            </Link>
          }
        />
      </div>
    )
  }
  if (!data) return <PageLoader />

  const { job, similar } = data
  const applied = appliedIds.has(job._id)
  const closed = job.status !== 'open'

  const onApplyClick = () => {
    if (!user) return navigate(`/login?next=${encodeURIComponent(`/jobs/${job._id}`)}`)
    setApplyOpen(true)
  }

  const facts = [
    { icon: MapPin, label: 'Location', value: job.location },
    { icon: Clock, label: 'Experience', value: formatExperience(job) },
    { icon: IndianRupee, label: 'Salary', value: formatSalary(job) },
    { icon: Briefcase, label: 'Employment Type', value: job.employmentType },
    { icon: Layers, label: 'Department', value: job.department },
    { icon: Users, label: 'Openings', value: job.openings },
  ]

  const applyAction = isAdmin ? (
    <Link to={`/admin/jobs/${job._id}/edit`} className="btn-primary w-full">
      Edit this job
    </Link>
  ) : closed ? (
    <p className="rounded-md bg-slate-100 px-3 py-2.5 text-center text-sm font-medium text-slate-600">
      This job is no longer accepting applications
    </p>
  ) : applied ? (
    <Link to="/candidate/dashboard" className="btn w-full bg-green-50 text-green-700 hover:bg-green-100">
      <CheckCircle2 className="h-4 w-4" /> Applied - Track Status
    </Link>
  ) : (
    <button onClick={onApplyClick} className="btn-primary w-full py-3">
      <Send className="h-4 w-4" /> {user ? 'Apply Now' : 'Login to Apply'}
    </button>
  )

  return (
    <>
      <PageBanner title={job.title} crumbs={[{ label: 'Careers / Jobs', to: '/careers' }, { label: job.title }]} />

      <section className="container-x py-8 sm:py-10">
        <Link to="/careers" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to all jobs
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="card p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-slate-500">
                  <Building2 className="h-4 w-4" /> {job.company}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${closed ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}
              >
                {closed ? 'Closed' : 'Actively hiring'}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-2">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">{f.label}</dt>
                    <dd className="text-sm font-semibold break-words text-navy-900">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-navy-900">Job Description</h2>
              <p className="leading-relaxed whitespace-pre-line text-slate-600">{job.description}</p>
            </div>
            <ListSection title="Key Responsibilities" items={job.responsibilities} />
            <ListSection title="Requirements" items={job.requirements} />
            <ListSection title="Benefits" items={job.benefits} />

            {job.skills?.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-bold text-navy-900">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Link
                      key={s}
                      to={`/careers?skill=${encodeURIComponent(s)}`}
                      className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 hover:bg-brand-100"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8 border-t border-slate-100 pt-6 lg:hidden">{applyAction}</div>
          </article>

          <aside className="space-y-6">
            <div className="card p-5 lg:sticky lg:top-24">
              <h2 className="font-bold text-navy-900">Interested in this role?</h2>
              <p className="mt-1 mb-4 text-sm text-slate-500">Posted on {formatDate(job.createdAt)}</p>
              {applyAction}
              {!user && (
                <p className="mt-3 text-center text-sm text-slate-500">
                  New here?{' '}
                  <Link to={`/register?next=${encodeURIComponent(`/jobs/${job._id}`)}`} className="font-semibold text-brand-600">
                    Create a profile
                  </Link>
                </p>
              )}
            </div>

            {similar?.length > 0 && (
              <div className="card p-5">
                <h2 className="mb-3 font-bold text-navy-900">Similar Jobs</h2>
                <ul className="divide-y divide-slate-100">
                  {similar.map((s) => (
                    <li key={s._id} className="py-3">
                      <Link to={`/jobs/${s._id}`} className="font-medium text-navy-900 hover:text-brand-600">
                        {s.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {s.location} · {formatExperience(s)} · {formatSalary(s)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {applyOpen && (
        <ApplyModal
          job={job}
          open={applyOpen}
          onClose={() => setApplyOpen(false)}
          onApplied={() => {
            setApplyOpen(false)
            refreshApplied()
            toast.success('Your application has been submitted. Track it from your dashboard.', 'Applied successfully')
          }}
        />
      )}
    </>
  )
}
