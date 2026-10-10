import { Link } from 'react-router-dom'
import { Globe, Mail, MapPin } from 'lucide-react'
import Logo from '../Logo'
import { COMPANY, SERVICES } from '../../data/site'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Company' },
  { to: '/services', label: 'Services' },
  { to: '/careers', label: 'Careers / Jobs' },
  { to: '/clients', label: 'Client Companies' },
  { to: '/contact', label: 'Contact Us' },
]

const CANDIDATE_LINKS = [
  { to: '/careers', label: 'Search Jobs' },
  { to: '/register', label: 'Create Profile' },
  { to: '/candidate/dashboard?tab=resume', label: 'Upload Resume' },
  { to: '/career-resources', label: 'Career Resources' },
  { to: '/contact', label: 'Contact Us' },
]

function Column({ title, children }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

const footerLink = 'text-slate-300 transition-colors hover:text-white'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-[2rem] bg-navy-900 text-slate-300 sm:rounded-t-[2.5rem]">
      <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl" aria-hidden="true" />
      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-3">
          <Logo light subtitle={null} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{COMPANY.about}</p>
        </div>
        <div className="lg:col-span-2">
          <Column title="Quick Links">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={footerLink}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
        </div>
        <div className="lg:col-span-2">
          <Column title="Our Services">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className={footerLink}>
                  {s.title}
                </Link>
              </li>
            ))}
          </Column>
        </div>
        <div className="lg:col-span-2">
          <Column title="For Candidates">
            {CANDIDATE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className={footerLink}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
        </div>
        <div className="lg:col-span-3">
          <Column title="Contact Info">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />
              <span>
                {COMPANY.name}
                <br />
                {COMPANY.address}
              </span>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className={`flex items-center gap-3 ${footerLink}`}>
                <Mail className="h-4 w-4 shrink-0 text-brand-200" /> {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={`https://${COMPANY.website}`} className={`flex items-center gap-3 ${footerLink}`}>
                <Globe className="h-4 w-4 shrink-0 text-brand-200" /> {COMPANY.website}
              </a>
            </li>
          </Column>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center text-xs sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className={footerLink}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={footerLink}>
              Terms &amp; Conditions
            </Link>
            <Link to="/admin/login" className={footerLink}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
