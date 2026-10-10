import { Link } from 'react-router-dom'
import { COMPANY } from '../data/site'

export function LogoMark({ className = 'h-10 w-10', light = false }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill={light ? '#ffffff' : '#1d4ed8'} />
      <path
        d="M42 20c-3-3-7-4-11-4-7 0-12 4-12 9 0 11 23 7 23 15 0 3-4 6-10 6-5 0-9-2-12-5"
        fill="none"
        stroke={light ? '#0a1f44' : '#ffffff'}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Logo({ light = false, to = '/', subtitle = COMPANY.tagline, name = COMPANY.name }) {
  return (
    <Link to={to} className="flex min-w-0 items-center gap-2.5">
      <LogoMark light={light} className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="min-w-0 leading-tight">
        <span className={`block truncate text-base font-bold sm:text-lg ${light ? 'text-white' : 'text-navy-900'}`}>
          {name}
        </span>
        {subtitle && (
          <span className={`block truncate text-xs ${light ? 'text-slate-300' : 'text-slate-500'}`}>{subtitle}</span>
        )}
      </span>
    </Link>
  )
}
