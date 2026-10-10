import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import { CtaBand } from '../components/sections'
import { IMAGES, SERVICES } from '../data/site'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) return <Navigate to="/services" replace />

  return (
    <>
      <PageBanner
        title={service.title}
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
        image={IMAGES.office}
        subtitle={service.short}
      />
      <section className="container-x grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="card p-6 sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-white">
            <service.icon className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-bold">{service.title}</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{service.description}</p>
          <h3 className="mt-8 text-lg font-bold">What's included</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-slate-600">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={`/contact?type=employer&subject=${encodeURIComponent(service.title)}`} className="btn-primary">
              Request this service <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
        <aside className="card h-fit p-4">
          <h3 className="mb-3 px-2 font-bold">All Services</h3>
          <ul className="space-y-1">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                    s.slug === slug ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-brand-50'
                  }`}
                >
                  <s.icon className="h-4 w-4" /> {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
      <CtaBand />
    </>
  )
}
