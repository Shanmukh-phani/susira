import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import api, { getErrorMessage } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { Alert, PageLoader } from '../../components/ui'

const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary']
const DEPARTMENTS = ['IT', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Operations', 'Business', 'Engineering', 'Healthcare', 'General']

const EMPTY = {
  title: '',
  company: 'Susira Solutions',
  location: '',
  department: 'IT',
  employmentType: 'Full Time',
  experienceMin: 0,
  experienceMax: 2,
  salaryMin: '',
  salaryMax: '',
  openings: 1,
  skills: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  status: 'open',
}

const toForm = (job) => ({
  ...EMPTY,
  ...job,
  skills: (job.skills || []).join(', '),
  responsibilities: (job.responsibilities || []).join('\n'),
  requirements: (job.requirements || []).join('\n'),
  benefits: (job.benefits || []).join('\n'),
})

function Field({ label, htmlFor, children, hint, className = '' }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export default function AdminJobForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => setForm(toForm(data.job)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (Number(form.experienceMax) < Number(form.experienceMin)) return setError('Maximum experience cannot be less than minimum')
    if (form.salaryMin !== '' && form.salaryMax !== '' && Number(form.salaryMax) < Number(form.salaryMin)) {
      return setError('Maximum salary cannot be less than minimum')
    }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/jobs/${id}`, form)
      else await api.post('/jobs', form)
      toast.success(isEdit ? 'Job updated' : 'Job posted - candidates can see it now')
      navigate('/admin/jobs')
    } catch (err) {
      setError(getErrorMessage(err))
      setSaving(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>
        <p className="text-sm text-slate-500">Jobs marked "Open" appear instantly on the Careers page.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Alert>{error}</Alert>

        <section className="card space-y-4 p-5 sm:p-6">
          <h2 className="font-bold">Basic Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job Title *" htmlFor="title" className="sm:col-span-2">
              <input id="title" required className="input" placeholder="e.g. React Developer" value={form.title} onChange={update('title')} />
            </Field>
            <Field label="Company / Client" htmlFor="company">
              <input id="company" className="input" value={form.company} onChange={update('company')} />
            </Field>
            <Field label="Location *" htmlFor="location">
              <input id="location" required className="input" placeholder="e.g. Hyderabad" value={form.location} onChange={update('location')} />
            </Field>
            <Field label="Department" htmlFor="department">
              <input id="department" list="departments" className="input" value={form.department} onChange={update('department')} />
              <datalist id="departments">
                {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
              </datalist>
            </Field>
            <Field label="Employment Type" htmlFor="employmentType">
              <select id="employmentType" className="input" value={form.employmentType} onChange={update('employmentType')}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </section>

        <section className="card space-y-4 p-5 sm:p-6">
          <h2 className="font-bold">Experience, Salary &amp; Openings</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Field label="Min Exp (yrs)" htmlFor="experienceMin">
              <input id="experienceMin" type="number" min="0" step="0.5" required className="input" value={form.experienceMin} onChange={update('experienceMin')} />
            </Field>
            <Field label="Max Exp (yrs)" htmlFor="experienceMax">
              <input id="experienceMax" type="number" min="0" step="0.5" required className="input" value={form.experienceMax} onChange={update('experienceMax')} />
            </Field>
            <Field label="Min Salary (LPA)" htmlFor="salaryMin">
              <input id="salaryMin" type="number" min="0" step="0.1" className="input" value={form.salaryMin} onChange={update('salaryMin')} />
            </Field>
            <Field label="Max Salary (LPA)" htmlFor="salaryMax">
              <input id="salaryMax" type="number" min="0" step="0.1" className="input" value={form.salaryMax} onChange={update('salaryMax')} />
            </Field>
            <Field label="Openings" htmlFor="openings" className="col-span-2 md:col-span-1">
              <input id="openings" type="number" min="1" className="input" value={form.openings} onChange={update('openings')} />
            </Field>
          </div>
        </section>

        <section className="card space-y-4 p-5 sm:p-6">
          <h2 className="font-bold">Description</h2>
          <Field label="Skills" htmlFor="skills" hint="Comma separated - used for the Skills filter on the Careers page">
            <input id="skills" className="input" placeholder="React, JavaScript, Redux" value={form.skills} onChange={update('skills')} />
          </Field>
          <Field label="Job Description *" htmlFor="description">
            <textarea id="description" required rows={5} className="input" value={form.description} onChange={update('description')} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Responsibilities" htmlFor="responsibilities" hint="One per line">
              <textarea id="responsibilities" rows={6} className="input" value={form.responsibilities} onChange={update('responsibilities')} />
            </Field>
            <Field label="Requirements" htmlFor="requirements" hint="One per line">
              <textarea id="requirements" rows={6} className="input" value={form.requirements} onChange={update('requirements')} />
            </Field>
            <Field label="Benefits" htmlFor="benefits" hint="One per line">
              <textarea id="benefits" rows={6} className="input" value={form.benefits} onChange={update('benefits')} />
            </Field>
          </div>
        </section>

        <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <fieldset className="flex items-center gap-5">
            <legend className="sr-only">Status</legend>
            {['open', 'closed'].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm font-medium capitalize">
                <input type="radio" name="status" value={s} checked={form.status === s} onChange={update('status')} /> {s}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/admin/jobs" className="btn-outline">Cancel</Link>
            <button disabled={saving} className="btn-primary">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : isEdit ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
