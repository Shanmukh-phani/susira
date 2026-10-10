import { Link } from 'react-router-dom'
import { Sparkles, Upload, UserPlus } from 'lucide-react'
import { STATS, WHY_CHOOSE, COMPANY } from '../data/site'
import { SectionHeading } from './ui'
import { useAuth } from '../context/AuthContext'

export function StatsBar({ className = '' }) {
  return (
    <div className={`card grid grid-cols-2 divide-slate-200 lg:grid-cols-4 lg:divide-x ${className}`}>
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-center gap-3 p-4 sm:gap-4 sm:p-6 ${i < 2 ? 'border-b border-slate-200 lg:border-b-0' : ''} ${
            i % 2 === 0 ? 'border-r border-slate-200 lg:border-r-0' : ''
          }`}
        >
          <s.icon className="h-8 w-8 shrink-0 text-brand-600 sm:h-10 sm:w-10" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-xl font-bold text-navy-900 sm:text-2xl">{s.value}</p>
            <p className="text-xs text-slate-500 sm:text-sm">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function WhyChoose() {
  return (
    <section className="py-14 sm:py-16">
      <div className="container-x">
        <SectionHeading title="Why Choose" highlight={`${COMPANY.name}?`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {WHY_CHOOSE.map((item) => (
            <div key={item.title} className="card p-6 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <item.icon className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <h3 className="font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CtaBand() {
  const { user, isCandidate } = useAuth()
  const registerLink = user ? (isCandidate ? '/candidate/dashboard?tab=profile' : '/admin') : '/register'
  const resumeLink = isCandidate
    ? '/candidate/dashboard?tab=resume'
    : `/login?next=${encodeURIComponent('/candidate/dashboard?tab=resume')}`
  return (
    <section className="container-x py-10 sm:py-12">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy-900 p-6 sm:p-8 lg:flex-row lg:items-center lg:p-10">
        <div className="flex items-start gap-4">
          <Sparkles className="mt-1 h-8 w-8 shrink-0 text-brand-200" />
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">Looking for the right opportunity?</h2>
            <p className="mt-1 text-slate-300">Register now and let employers find you.</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link to={registerLink} className="btn-ghost-light px-6 py-3">
            <UserPlus className="h-5 w-5" /> {isCandidate ? 'Update Profile' : 'Register as Candidate'}
          </Link>
          <Link to={resumeLink} className="btn-ghost-light px-6 py-3">
            <Upload className="h-5 w-5" /> Upload Resume
          </Link>
        </div>
      </div>
    </section>
  )
}
