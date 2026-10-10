import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Upload, UserPlus } from 'lucide-react'
import { STATS, WHY_CHOOSE, COMPANY } from '../data/site'
import { SectionHeading } from './ui'
import { useAuth } from '../context/AuthContext'

export function StatsBar({ className = '' }) {
  return (
    <div className={`glass grid grid-cols-2 gap-2 rounded-3xl p-2 shadow-lift sm:gap-3 sm:p-3 lg:grid-cols-4 ${className}`}>
      {STATS.map((s) => (
        <div
          key={s.label}
          className="group flex flex-col items-start gap-3 rounded-2xl bg-white p-4 transition duration-300 hover:bg-brand-50/60 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
        >
          <div className="icon-tile h-11 w-11 shrink-0 transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
            <s.icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 sm:text-sm">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why us"
          title="Why Choose"
          highlight={`${COMPANY.name}?`}
          subtitle="A people-first recruitment partner focused on quality, speed and long-term success."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {WHY_CHOOSE.map((item, i) => (
            <div key={item.title} className="card card-hover group relative overflow-hidden p-6 sm:p-7">
              <span className="absolute top-5 right-6 text-5xl font-extrabold text-slate-100 transition group-hover:text-brand-50">
                0{i + 1}
              </span>
              <div className="icon-tile relative h-12 w-12">
                <item.icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="relative mt-6 text-lg font-bold">{item.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
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
    <section className="container-x py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 p-7 sm:p-10 lg:p-14">
        <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 -left-10 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100">
              <Sparkles className="h-3.5 w-3.5" /> Your next role is waiting
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">Looking for the right opportunity?</h2>
            <p className="mt-3 text-slate-300 sm:text-lg">Register now and let employers find you.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to={registerLink} className="btn bg-white px-6 py-3.5 text-navy-900 shadow-lift hover:-translate-y-0.5 hover:bg-brand-50">
              <UserPlus className="h-5 w-5" /> {isCandidate ? 'Update Profile' : 'Register as Candidate'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to={resumeLink} className="btn-ghost-light px-6 py-3.5">
              <Upload className="h-5 w-5" /> Upload Resume
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
