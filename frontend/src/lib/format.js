const trimNum = (n) => (Number.isInteger(n) ? n : Number(n).toFixed(1).replace(/\.0$/, ''))

export function formatSalary(job) {
  if (!job) return ''
  const { salaryMin = 0, salaryMax = 0 } = job
  if (!salaryMin && !salaryMax) return 'Not disclosed'
  if (salaryMin === salaryMax || !salaryMax) return `₹${trimNum(salaryMin || salaryMax)} LPA`
  return `₹${trimNum(salaryMin)} - ${trimNum(salaryMax)} LPA`
}

export function formatExperience(job) {
  if (!job) return ''
  const { experienceMin = 0, experienceMax = 0 } = job
  if (!experienceMin && !experienceMax) return 'Fresher'
  if (experienceMin === experienceMax) return `${experienceMin} Years`
  return `${experienceMin} - ${experienceMax} Years`
}

export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function timeAgo(value) {
  if (!value) return ''
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [name, secs] of units) {
    const n = Math.floor(seconds / secs)
    if (n >= 1) return `${n} ${name}${n > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', className: 'bg-slate-100 text-slate-700' },
  { value: 'under-review', label: 'Under Review', className: 'bg-amber-100 text-amber-800' },
  { value: 'shortlisted', label: 'Shortlisted', className: 'bg-sky-100 text-sky-800' },
  { value: 'interview', label: 'Interview', className: 'bg-indigo-100 text-indigo-800' },
  { value: 'offered', label: 'Offered', className: 'bg-teal-100 text-teal-800' },
  { value: 'hired', label: 'Hired', className: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Not Selected', className: 'bg-red-100 text-red-700' },
]

export const statusMeta = (value) =>
  APPLICATION_STATUSES.find((s) => s.value === value) || { value, label: value, className: 'bg-slate-100 text-slate-700' }
