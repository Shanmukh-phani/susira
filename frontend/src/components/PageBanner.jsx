import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { IMAGES } from '../data/site'

export default function PageBanner({ title, crumbs = [], image = IMAGES.careers, subtitle }) {
  return (
    <section className="px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-navy-900 sm:rounded-[2.25rem]">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30 md:left-auto md:w-3/5 md:opacity-100"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/30" aria-hidden="true" />
        <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-20 -left-10 h-64 w-64 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <div className="container-x relative py-12 sm:py-20 lg:py-24">
          <nav
            className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-slate-200 backdrop-blur"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="flex items-center gap-1 hover:text-white">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                {c.to ? (
                  <Link to={c.to} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="animate-fade-up mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
