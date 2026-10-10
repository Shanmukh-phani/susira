import { Link } from 'react-router-dom'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import Logo from '../Logo'
import SocialLinks from '../SocialIcons'
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
    <footer className="bg-navy-900 text-slate-300">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-3">
          <Logo light subtitle={null} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{COMPANY.about}</p>
          <SocialLinks className="mt-5" itemClassName="h-8 w-8 bg-white/10 text-white hover:bg-brand-600" />
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
              <a href={COMPANY.phoneHref} className={`flex items-center gap-3 ${footerLink}`}>
                <Phone className="h-4 w-4 shrink-0 text-brand-200" /> {COMPANY.phone}
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
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All Rights Reserved.</p>
          <div className="flex gap-6">
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
