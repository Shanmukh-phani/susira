import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Quote, Search, UserPlus } from 'lucide-react'
import api from '../lib/api'
import { formatExperience, formatSalary, timeAgo } from '../lib/format'
import { COMPANY, IMAGES, SERVICES, TESTIMONIALS } from '../data/site'
import { StatsBar, WhyChoose, CtaBand } from '../components/sections'
import { SafeImage, SectionHeading, Spinner } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useSocketEvent } from '../context/SocketContext'

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
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="container-x">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">
              Latest <span className="text-brand-600">Job Openings</span>
            </h2>
            <p className="mt-2 text-slate-500">Fresh opportunities updated in real time by our recruiters.</p>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-navy-900 group-hover:text-brand-600">{job.title}</h3>
                  <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    {job.employmentType}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span>{formatExperience(job)}</span>
                  <span>{formatSalary(job)}</span>
                </div>
                <p className="mt-auto pt-4 text-xs text-slate-400">Posted {timeAgo(job.createdAt)}</p>
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

  const search = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/careers?q=${encodeURIComponent(query.trim())}` : '/careers')
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="container-x grid items-center gap-10 pt-10 pb-28 sm:pt-14 lg:grid-cols-2 lg:pt-16 lg:pb-36">
          <div className="relative z-10">
            <h1 className="text-4xl leading-tight font-extrabold sm:text-5xl lg:text-[3.4rem]">
              Connecting Talent.
              <br />
              <span className="text-brand-600">Building Futures.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-600 sm:text-lg">
              {COMPANY.name} provides end-to-end recruitment and staffing solutions to help businesses grow and people
              advance.
            </p>
            <form onSubmit={search} className="mt-6 flex max-w-lg overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm focus-within:border-brand-500">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title, skills or location"
                aria-label="Search jobs"
                className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
              />
              <button className="bg-brand-600 px-4 text-white hover:bg-brand-700" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/careers" className="btn-primary px-6 py-3">
                Explore Opportunities <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={user ? (isCandidate ? '/candidate/dashboard' : '/admin') : '/register'}
                className="btn-outline px-6 py-3"
              >
                <UserPlus className="h-4 w-4" /> {user ? 'Go to Dashboard' : 'Register as Candidate'}
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 -z-0 rounded-[2rem] bg-brand-100/60 blur-2xl" />
            <SafeImage
              src={IMAGES.hero}
              alt="Recruitment consultant at Sri susira solutions"
              className="relative aspect-[4/3] w-full rounded-3xl object-cover object-top shadow-xl lg:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="container-x relative z-10 -mt-20 lg:-mt-24">
        <StatsBar />
      </div>

      <WhyChoose />

      {/* Services */}
      <section className="py-14 sm:py-16">
        <div className="container-x">
          <SectionHeading
            title="Our"
            highlight="Services"
            subtitle="Comprehensive workforce solutions tailored to every stage of your business."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="card group flex gap-4 p-5 transition hover:border-brand-200 hover:shadow-md sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 group-hover:text-brand-600">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LatestJobs />

      {/* Testimonials */}
      <section className="py-14 sm:py-16">
        <div className="container-x">
          <SectionHeading title="What Our" highlight="Clients Say" />
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card p-6">
                <Quote className="h-8 w-8 text-brand-200" />
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-600">{t.quote}</blockquote>
                <figcaption className="mt-4">
                  <p className="font-semibold text-navy-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
