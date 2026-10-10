import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import { CtaBand, WhyChoose } from '../components/sections'
import { SectionHeading } from '../components/ui'
import { IMAGES, SERVICES } from '../data/site'

export default function Services() {
  return (
    <>
      <PageBanner
        title="Our Services"
        crumbs={[{ label: 'Services' }]}
        image={IMAGES.office}
        subtitle="Recruitment, staffing and payroll solutions designed around your business."
      />
      <section className="container-x py-14 sm:py-16">
        <SectionHeading
          title="What we"
          highlight="offer"
          subtitle="Whether you need one specialist or an entire team, we have a service model that fits."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.slug} className="card flex flex-col p-6 transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{s.description}</p>
              <Link to={`/services/${s.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-2.5">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <WhyChoose />
      <CtaBand />
    </>
  )
}
