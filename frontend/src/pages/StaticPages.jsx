import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import { CtaBand } from '../components/sections'
import { CAREER_RESOURCES, COMPANY, IMAGES } from '../data/site'

export function CareerResources() {
  return (
    <>
      <PageBanner
        title="Career Resources"
        crumbs={[{ label: 'Career Resources' }]}
        image={IMAGES.team}
        subtitle="Practical tips to help you land your next role."
      />
      <section className="container-x grid gap-5 py-12 sm:py-14 md:grid-cols-2">
        {CAREER_RESOURCES.map((r) => (
          <article key={r.title} className="card p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 shrink-0 text-brand-600" />
              <h2 className="text-lg font-bold">{r.title}</h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {r.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <CtaBand />
    </>
  )
}

function LegalPage({ title, sections }) {
  return (
    <>
      <PageBanner title={title} crumbs={[{ label: title }]} image={IMAGES.office} />
      <section className="container-x py-12 sm:py-14">
        <div className="card mx-auto max-w-3xl p-6 sm:p-10">
          <p className="text-sm text-slate-500">Last updated: January 2026</p>
          {sections.map((s) => (
            <div key={s.heading} className="mt-6">
              <h2 className="text-lg font-bold">{s.heading}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
          <p className="mt-8 text-sm text-slate-500">
            Questions? <Link to="/contact" className="font-semibold text-brand-600">Contact us</Link> or email{' '}
            <a href={`mailto:${COMPANY.email}`} className="font-semibold text-brand-600">{COMPANY.email}</a>.
          </p>
        </div>
      </section>
    </>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        {
          heading: 'Information we collect',
          text: 'When you register, apply for a job or contact us, we collect details such as your name, email, phone number, work history, skills and resume.',
        },
        {
          heading: 'How we use your information',
          text: 'Your information is used to match you with suitable opportunities, share your profile with prospective employers for roles you apply to, and communicate with you about your applications.',
        },
        {
          heading: 'Sharing',
          text: `${COMPANY.name} does not sell your personal data. Profiles are shared only with client companies relevant to the positions you have applied for.`,
        },
        {
          heading: 'Data security',
          text: 'We use industry-standard safeguards, including encrypted passwords and access controls, to protect your information.',
        },
        {
          heading: 'Your rights',
          text: 'You can update your profile at any time from your dashboard, or contact us to request deletion of your data.',
        },
      ]}
    />
  )
}

export function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        { heading: 'Acceptance', text: 'By using this website you agree to these terms. If you do not agree, please do not use the site.' },
        {
          heading: 'Candidate responsibilities',
          text: 'Candidates must provide accurate, truthful information in their profiles and resumes. Misrepresentation may lead to removal of the account.',
        },
        {
          heading: 'No placement guarantee',
          text: 'Applying through this portal does not guarantee an interview or employment. Hiring decisions rest with the employer.',
        },
        {
          heading: 'No fees for candidates',
          text: `${COMPANY.name} never charges candidates for job placement. Please report any such request to us immediately.`,
        },
        {
          heading: 'Changes',
          text: 'We may update these terms from time to time. Continued use of the site constitutes acceptance of the revised terms.',
        },
      ]}
    />
  )
}

export function NotFound() {
  return (
    <section className="container-x flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for doesn't exist or has been moved.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/careers" className="btn-outline">Browse Jobs</Link>
      </div>
    </section>
  )
}
