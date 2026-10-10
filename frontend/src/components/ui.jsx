import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Inbox, Loader2, X } from 'lucide-react'
import { statusMeta } from '../lib/format'

export function Spinner({ className = 'h-6 w-6' }) {
  return <Loader2 className={`animate-spin text-brand-600 ${className}`} />
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', text, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="font-semibold text-navy-900">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function StatusBadge({ status }) {
  const meta = statusMeta(status)
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {meta.label}
    </span>
  )
}

export function Alert({ type = 'error', children }) {
  if (!children) return null
  const styles = type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'
  return <div className={`rounded-md border px-3 py-2.5 text-sm ${styles}`}>{children}</div>
}

function pageNumbers(page, pages) {
  const delta = 2
  const start = Math.max(1, Math.min(page - delta, pages - delta * 2))
  const end = Math.min(pages, Math.max(page + delta, 1 + delta * 2))
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null
  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
      </button>
      {pageNumbers(page, pages).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`h-9 min-w-9 rounded-full px-2 text-sm font-semibold transition ${
            n === page ? 'bg-brand-600 text-white shadow-glow' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export function Modal({ open, onClose, title, children, size = 'max-w-lg', footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`animate-fade-up relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${size}`}>
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-navy-900">{title}</h2>
          <button onClick={onClose} className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-3 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function SafeImage({ src, alt, className, fallbackClassName = 'bg-gradient-to-br from-brand-100 to-brand-200' }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`${className} ${fallbackClassName}`} aria-hidden="true" />
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />
}

export function SectionHeading({ title, highlight, subtitle, eyebrow, align = 'center' }) {
  return (
    <div className={`mb-10 sm:mb-12 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : ''}`}>
      {eyebrow && (
        <span className="eyebrow mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> {eyebrow}
        </span>
      )}
      <h2 className="section-title">
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {subtitle && <p className="mt-4 text-base text-slate-500 sm:text-lg">{subtitle}</p>}
    </div>
  )
}
