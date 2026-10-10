import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { IMAGES } from '../data/site'

export default function PageBanner({ title, crumbs = [], image = IMAGES.careers, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden h-full w-3/5 object-cover md:block"
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/40 md:via-navy-900/85" />
      <div className="container-x relative py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-slate-300">{subtitle}</p>}
        <nav className="mt-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-300" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4" />
              {c.to ? (
                <Link to={c.to} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
