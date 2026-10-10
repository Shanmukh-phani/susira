import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Eye, Target } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import { CtaBand, StatsBar, WhyChoose } from '../components/sections'
import { SafeImage, SectionHeading } from '../components/ui'
import { COMPANY, IMAGES, INDUSTRIES, VALUES } from '../data/site'

const PROCESS = [
  { step: '01', title: 'Understand', text: 'We study your business, culture and exact role requirements.' },
  { step: '02', title: 'Source', text: 'We tap our talent network, job portals and referrals to find candidates.' },
  { step: '03', title: 'Screen', text: 'Every profile is assessed for skills, experience and culture fit.' },
  { step: '04', title: 'Deliver', text: 'We coordinate interviews, offers and onboarding until joining.' },
]

export default function About() {
  return (
    <>
      <PageBanner title="About Company" crumbs={[{ label: 'About Company' }]} image={IMAGES.team} />

      <section className="container-x grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2">
        <SafeImage src={IMAGES.about} alt="Our team celebrating a successful placement" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">Who we are</p>
          <h2 className="section-title mt-2">{COMPANY.name}</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {COMPANY.name} is a recruitment and staffing company headquartered in {COMPANY.address}. For over a decade we have
            partnered with startups, SMEs and large enterprises to build high-performing teams across IT and non-IT
            functions.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Our consultants combine deep industry knowledge with a people-first approach - helping businesses grow with the
            right talent, and helping candidates find careers where they can thrive.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {['Pan-India hiring network', 'Dedicated account managers', 'Fast turnaround times', 'Compliance-first approach'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-navy-900">
                <CheckCircle2 className="h-5 w-5 text-brand-600" /> {item}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn-primary mt-8">
            Partner with us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container-x pb-4">
        <StatsBar />
      </section>

      <section className="container-x grid gap-6 py-14 md:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <Target className="h-10 w-10 text-brand-600" strokeWidth={1.5} />
          <h3 className="mt-4 text-xl font-bold">Our Mission</h3>
          <p className="mt-2 leading-relaxed text-slate-600">
            To connect organisations with exceptional talent through transparent, efficient and ethical recruitment
            practices - creating lasting value for clients and candidates alike.
          </p>
        </div>
        <div className="card p-6 sm:p-8">
          <Eye className="h-10 w-10 text-brand-600" strokeWidth={1.5} />
          <h3 className="mt-4 text-xl font-bold">Our Vision</h3>
          <p className="mt-2 leading-relaxed text-slate-600">
            To be the most trusted workforce partner in India, known for quality placements, people-centric service and
            long-term relationships.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-x">
          <SectionHeading title="Our" highlight="Hiring Process" subtitle="A proven four-step approach that delivers the right talent, faster." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.step} className="card p-6">
                <span className="text-3xl font-extrabold text-brand-200">{p.step}</span>
                <h3 className="mt-2 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-16">
        <SectionHeading title="Our" highlight="Core Values" />
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="card flex gap-4 p-6">
              <v.icon className="h-8 w-8 shrink-0 text-brand-600" strokeWidth={1.5} />
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-lg font-bold">Industries we serve</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map((i) => (
              <span key={i} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600">
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <CtaBand />
    </>
  )
}
