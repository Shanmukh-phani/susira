import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BadgeCheck, Briefcase, Clock, IndianRupee, MapPin, Quote, Search, Star, UserPlus } from 'lucide-react'
import api from '../lib/api'
import { formatExperience, formatSalary, timeAgo } from '../lib/format'
import { COMPANY, IMAGES, SERVICES, TESTIMONIALS } from '../data/site'
import { StatsBar, WhyChoose, CtaBand } from '../components/sections'
import { SafeImage, SectionHeading, Spinner } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useSocketEvent } from '../context/SocketContext'

const POPULAR = ['React', 'Java', 'HR', 'Payroll', 'Hyderabad']
const AVATARS = ['RK', 'AR', 'SB', 'PM']

function LatestJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    api
      .get('/jobs', { params: { limit: 6 } })
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])
  useSocketEvent('job:created', load)
  useSocketEvent('job:updated', load)
  useSocketEvent('job:deleted', load)

  return (
    <section className="relative overflow-hidden bg-slate-50/80 py-16 sm:py-24">
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
              </span>
              Live openings
            </span>
            <h2 className="section-title">
              Latest <span className="text-gradient">Job Openings</span>
            </h2>
            <p className="mt-3 text-slate-500 sm:text-lg">Fresh opportunities updated in real time by our recruiters.</p>
          </div>
          <Link to="/careers" className="btn-outline self-start sm:self-auto">
            View All Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          <p className="card p-8 text-center text-slate-500">New openings will be posted soon. Check back later!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {jobs.map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="card card-hover group flex flex-col p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-base font-bold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                    {job.title?.[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-navy-900 group-hover:text-brand-600">{job.title}</h3>
                    <p className="truncate text-xs text-slate-500">{job.department}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
                </div>
                <div className="mt-5 mb-5 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                    <Clock className="h-3.5 w-3.5" /> {formatExperience(job)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                    <IndianRupee className="h-3.5 w-3.5" /> {formatSalary(job).replace('₹', '')}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">{job.employmentType}</span>
                  <span className="text-slate-400">{timeAgo(job.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { user, isCandidate } = useAuth()
  const [query, setQuery] = useState('')
  const [openJobs, setOpenJobs] = useState(null)

  const loadStats = useCallback(() => {
    api
      .get('/stats/public')
      .then(({ data }) => setOpenJobs(data.openJobs))
      .catch(() => {})
  }, [])
  useEffect(loadStats, [loadStats])
  useSocketEvent('job:created', loadStats)
  useSocketEvent('job:updated', loadStats)
  useSocketEvent('job:deleted', loadStats)

  const search = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/careers?q=${encodeURIComponent(query.trim())}` : '/careers')
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl" aria-hidden="true" />
        <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-brand-100/70 blur-3xl" aria-hidden="true" />

        <div className="container-x relative grid items-center gap-12 pt-10 pb-32 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-20 lg:pb-40">
          <div className="animate-fade-up relative z-10">
            <span className="glass inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs font-semibold text-navy-900 shadow-soft">
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-white">New</span>
              {openJobs > 0 ? `${openJobs} open position${openJobs === 1 ? '' : 's'} hiring now` : 'Now hiring across India'}
            </span>
            <h1 className="mt-6 text-[2.4rem] leading-[1.08] font-extrabold tracking-tight sm:text-[3.25rem] lg:text-5xl xl:text-[3.6rem]">
              Connecting Talent.
              <br />
              <span className="text-gradient">Building Futures.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              {COMPANY.name} provides end-to-end recruitment and staffing solutions to help businesses grow and people
              advance.
            </p>

            <form
              onSubmit={search}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-5 shadow-lift transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100"
            >
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skills or location"
                aria-label="Search jobs"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none sm:text-base"
              />
              <button className="btn-primary px-4 py-2.5 sm:px-6" aria-label="Search jobs">
                <span className="hidden sm:inline">Search</span>
                <ArrowRight className="h-4 w-4 sm:hidden" />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-medium text-slate-500">Popular:</span>
              {POPULAR.map((p) => (
                <Link
                  key={p}
                  to={`/careers?q=${encodeURIComponent(p)}`}
                  className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                >
                  {p}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/careers" className="btn-primary px-7 py-3.5">
                Explore Opportunities <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={user ? (isCandidate ? '/candidate/dashboard' : '/admin') : '/register'} className="btn-outline px-7 py-3.5">
                <UserPlus className="h-4 w-4" /> {user ? 'Go to Dashboard' : 'Register as Candidate'}
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {AVATARS.map((a, i) => (
                  <span
                    key={a}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${
                      ['bg-brand-600', 'bg-navy-800', 'bg-brand-500', 'bg-navy-700'][i]
                    }`}
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-500">
                  <span className="font-bold text-navy-900">25K+</span> professionals placed
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
            <div className="absolute inset-6 -z-0 rounded-[2.5rem] bg-gradient-to-br from-brand-500 to-brand-700 opacity-20 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[2.5rem] border border-white/70 bg-white/50 p-2 shadow-lift backdrop-blur">
              <SafeImage
                src={IMAGES.hero}
                alt="Young professionals working together around a laptop"
                className="aspect-square w-full rounded-[2rem] object-cover object-center"
              />
            </div>

            <div className="glass animate-float absolute top-8 left-2 flex items-center gap-3 rounded-2xl p-3 pr-4 shadow-lift sm:-left-6 lg:-left-10">
              <span className="icon-tile h-10 w-10">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900">Profile shortlisted</p>
                <p className="text-xs text-slate-500">React Developer · just now</p>
              </div>
            </div>

            <div
              className="glass animate-float absolute right-2 bottom-10 flex items-center gap-3 rounded-2xl p-3 pr-4 shadow-lift sm:-right-6 lg:-right-8"
              style={{ animationDelay: '1.5s' }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900">200+ Companies</p>
                <p className="text-xs text-slate-500">trust us to hire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="container-x relative z-10 -mt-20 lg:-mt-24">
        <StatsBar />
      </div>

      <WhyChoose />

      {/* Services */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we do"
            title="Our"
            highlight="Services"
            subtitle="Comprehensive workforce solutions tailored to every stage of your business."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="card card-hover group relative flex flex-col overflow-hidden p-6 sm:p-7"
              >
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-50 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden="true" />
                <div className="relative flex items-start justify-between">
                  <div className="icon-tile h-12 w-12">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:rotate-45 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="relative mt-6 text-lg font-bold text-navy-900">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LatestJobs />

      {/* Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Testimonials" title="What Our" highlight="Clients Say" />
          <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
            {TESTIMONIALS.map((t, i) => {
              const featured = i === 1
              return (
                <figure
                  key={t.name}
                  className={`relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-7 ${
                    featured ? 'bg-navy-900 text-white shadow-lift' : 'card card-hover'
                  }`}
                >
                  {featured && <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />}
                  <div className="relative flex items-center justify-between">
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className={`h-8 w-8 ${featured ? 'text-brand-500' : 'text-brand-100'}`} />
                  </div>
                  <blockquote className={`relative mt-5 flex-1 leading-relaxed ${featured ? 'text-slate-200' : 'text-slate-600'}`}>
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                        featured ? 'bg-white text-navy-900' : 'bg-brand-600 text-white'
                      }`}
                    >
                      {t.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')}
                    </span>
                    <span>
                      <span className={`block font-bold ${featured ? 'text-white' : 'text-navy-900'}`}>{t.name}</span>
                      <span className={`block text-xs ${featured ? 'text-slate-400' : 'text-slate-500'}`}>{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
