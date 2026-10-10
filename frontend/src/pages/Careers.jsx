import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ChevronRight,
  FileText,
  ListChecks,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Upload,
  UserPlus,
  Send,
} from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'
import PageBanner from '../components/PageBanner'
import JobsTable from '../components/jobs/JobsTable'
import { CtaBand } from '../components/sections'
import { EmptyState, Pagination, Spinner } from '../components/ui'
import { useSocketEvent } from '../context/SocketContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import useAppliedJobIds from '../hooks/useAppliedJobIds'

const FILTER_KEYS = ['location', 'experience', 'salary', 'skill', 'employmentType', 'department']
const PAGE_SIZE = 8

function CandidatesCan({ onSearchClick, firstJobId }) {
  const { isCandidate } = useAuth()
  const items = [
    { label: 'Search Jobs', icon: Search, onClick: onSearchClick },
    { label: 'View Complete Job Description', icon: FileText, to: firstJobId ? `/jobs/${firstJobId}` : '/careers' },
    { label: 'Apply Online', icon: Send, to: isCandidate ? '/candidate/dashboard' : '/login' },
    {
      label: 'Upload Resume',
      icon: Upload,
      to: isCandidate ? '/candidate/dashboard?tab=resume' : `/login?next=${encodeURIComponent('/candidate/dashboard?tab=resume')}`,
    },
    { label: 'Create Candidate Profile', icon: UserPlus, to: isCandidate ? '/candidate/dashboard?tab=profile' : '/register' },
  ]
  const cls =
    'group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 px-3 py-3 text-left text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:shadow-soft'
  return (
    <aside className="card h-fit p-4 sm:p-5">
      <h2 className="mb-4 font-bold text-navy-900">Candidates can</h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((item) => {
          const content = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </>
          )
          return (
            <li key={item.label}>
              {item.to ? (
                <Link to={item.to} className={cls}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={item.onClick} className={cls}>
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="input py-2">
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  )
}

export default function Careers() {
  const [params, setParams] = useSearchParams()
  const toast = useToast()
  const searchRef = useRef(null)
  const { appliedIds } = useAppliedJobIds()

  const [options, setOptions] = useState(null)
  const [query, setQuery] = useState(params.get('q') || '')
  const [draft, setDraft] = useState(() => Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ''])))
  const [showFilters, setShowFilters] = useState(false)
  const [result, setResult] = useState({ jobs: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const page = Number(params.get('page')) || 1
  const paramsKey = params.toString()

  const loadOptions = useCallback(() => {
    api.get('/jobs/filters').then(({ data }) => setOptions(data)).catch(() => {})
  }, [])

  const loadJobs = useCallback(() => {
    const search = new URLSearchParams(paramsKey)
    const query = Object.fromEntries(search.entries())
    setError('')
    return api
      .get('/jobs', { params: { ...query, limit: PAGE_SIZE } })
      .then(({ data }) => setResult(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [paramsKey])

  useEffect(loadOptions, [loadOptions])
  useEffect(() => {
    setLoading(true)
    loadJobs()
  }, [loadJobs])

  useSocketEvent('job:created', (job) => {
    toast.info(`${job.title} - ${job.location}`, 'New job posted')
    loadJobs()
    loadOptions()
  })
  useSocketEvent('job:updated', () => {
    loadJobs()
    loadOptions()
  })
  useSocketEvent('job:deleted', () => {
    loadJobs()
    loadOptions()
  })

  const apply = (next) => {
    const sp = new URLSearchParams()
    const merged = { q: query.trim(), ...draft, ...next }
    Object.entries(merged).forEach(([k, v]) => v && k !== 'page' && sp.set(k, v))
    if (next?.page > 1) sp.set('page', next.page)
    setParams(sp)
  }

  const clearFilters = () => {
    setQuery('')
    setDraft(Object.fromEntries(FILTER_KEYS.map((k) => [k, ''])))
    setParams(new URLSearchParams())
  }

  const onSearch = (e) => {
    e.preventDefault()
    apply()
  }

  const goToPage = (p) => {
    apply({ page: p })
    document.getElementById('vacancies')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setFilter = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))
  const activeCount = FILTER_KEYS.filter((k) => params.get(k)).length + (params.get('q') ? 1 : 0)
  const from = result.total === 0 ? 0 : (result.page - 1) * PAGE_SIZE + 1
  const to = Math.min(result.page * PAGE_SIZE, result.total)

  return (
    <>
      <PageBanner title="Careers / Jobs" crumbs={[{ label: 'Careers / Jobs' }]} />

      <section className="container-x py-8 sm:py-10">
        {/* Search + filters */}
        <form onSubmit={onSearch} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex max-w-2xl flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pl-4 shadow-soft transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for job title, skills or company"
                aria-label="Search jobs"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              />
              <button className="btn-primary px-4 py-2" aria-label="Search">
                <span className="hidden sm:inline">Search</span>
                <Search className="h-4 w-4 sm:hidden" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="btn-outline shrink-0 px-3.5 lg:hidden"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="rounded-full bg-brand-600 px-1.5 text-xs text-white">{activeCount}</span>
              )}
            </button>
          </div>

          <div className={`${showFilters ? 'grid' : 'hidden'} gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid lg:grid-cols-[repeat(6,minmax(0,1fr))_auto_auto]`}>
            <FilterSelect label="Location" value={draft.location} onChange={setFilter('location')} options={options?.locations || []} />
            <FilterSelect label="Experience" value={draft.experience} onChange={setFilter('experience')} options={options?.experience || []} />
            <FilterSelect label="Salary" value={draft.salary} onChange={setFilter('salary')} options={options?.salary || []} />
            <FilterSelect label="Skills" value={draft.skill} onChange={setFilter('skill')} options={options?.skills || []} />
            <FilterSelect
              label="Employment Type"
              value={draft.employmentType}
              onChange={setFilter('employmentType')}
              options={options?.employmentTypes || []}
            />
            <FilterSelect label="Department" value={draft.department} onChange={setFilter('department')} options={options?.departments || []} />
            <button type="submit" className="btn-primary py-2">
              <SlidersHorizontal className="h-4 w-4" /> Apply Filters
            </button>
            <button type="button" onClick={clearFilters} className="btn py-2 text-brand-600 hover:bg-brand-50">
              <RotateCcw className="h-4 w-4" /> Clear Filters
            </button>
          </div>
        </form>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <CandidatesCan onSearchClick={() => searchRef.current?.focus()} firstJobId={result.jobs[0]?._id} />
          </div>

          <div id="vacancies" className="card order-1 scroll-mt-24 overflow-hidden lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4">
              <h2 className="font-bold text-navy-900">Current Vacancies</h2>
              <p className="text-xs text-slate-500 sm:text-sm">
                Showing {from}-{to} of {result.total} Jobs
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner />
              </div>
            ) : error ? (
              <EmptyState title="Could not load jobs" text={error} action={<button className="btn-primary" onClick={loadJobs}>Retry</button>} />
            ) : result.jobs.length === 0 ? (
              <EmptyState
                title="No jobs match your search"
                text="Try different keywords or clear the filters to see all openings."
                action={
                  <button className="btn-outline" onClick={clearFilters}>
                    <ListChecks className="h-4 w-4" /> Show all jobs
                  </button>
                }
              />
            ) : (
              <>
                <JobsTable jobs={result.jobs} appliedIds={appliedIds} />
                <div className="border-t border-slate-100 px-4 py-4">
                  <Pagination page={page} pages={result.pages} onChange={goToPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
