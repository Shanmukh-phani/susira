import { Link } from 'react-router-dom'
import { ArrowRight, Building2, MapPin, Quote } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import { CtaBand, StatsBar } from '../components/sections'
import { SectionHeading } from '../components/ui'
import { CLIENTS, IMAGES, INDUSTRIES, TESTIMONIALS } from '../data/site'

const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

export default function Clients() {
  return (
    <>
      <PageBanner
        title="Client Companies"
        crumbs={[{ label: 'Client Companies' }]}
        image={IMAGES.office}
        subtitle="Trusted by 200+ organisations across India."
      />

      <section className="container-x py-14 sm:py-16">
        <SectionHeading title="Companies that" highlight="trust us" subtitle="A few of the organisations we have helped build great teams." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CLIENTS.map((c) => (
            <div key={c.name} className="card flex items-center gap-4 p-5 transition hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-bold text-white">
                {initials(c.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy-900">{c.name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Building2 className="h-3.5 w-3.5" /> {c.industry}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {c.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-6">
        <StatsBar />
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-x">
          <SectionHeading title="Client" highlight="Testimonials" />
          <div className="grid gap-4 md:grid-cols-3">
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

      <section className="container-x py-14 text-center">
        <h2 className="section-title">Industries we serve</h2>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
          {INDUSTRIES.map((i) => (
            <span key={i} className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              {i}
            </span>
          ))}
        </div>
        <Link to="/contact?type=employer" className="btn-primary mt-8">
          Hire with us <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <CtaBand />
    </>
  )
}
