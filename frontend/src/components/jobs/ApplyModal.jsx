import { useState } from 'react'
import { FileText, Send } from 'lucide-react'
import api, { getErrorMessage } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { Alert, Modal } from '../ui'

const MAX_SIZE = 5 * 1024 * 1024
const ACCEPT = '.pdf,.doc,.docx'

export default function ApplyModal({ job, open, onClose, onApplied }) {
  const { user, setUser } = useAuth()
  const hasProfileResume = Boolean(user?.resume?.url)
  const [useProfileResume, setUseProfileResume] = useState(hasProfileResume)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ coverLetter: '', expectedSalary: '', noticePeriod: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onFile = (e) => {
    const selected = e.target.files?.[0]
    setError('')
    if (!selected) return setFile(null)
    if (!/\.(pdf|docx?)$/i.test(selected.name)) return setError('Only PDF, DOC or DOCX files are allowed')
    if (selected.size > MAX_SIZE) return setError('Resume must be smaller than 5 MB')
    setFile(selected)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!(useProfileResume && hasProfileResume) && !file) return setError('Please upload your resume')
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (!(useProfileResume && hasProfileResume) && file) data.append('resume', file)

    setSubmitting(true)
    try {
      const res = await api.post(`/applications/job/${job._id}`, data)
      if (!hasProfileResume && file) {
        const me = await api.get('/auth/me')
        setUser(me.data.user)
      }
      onApplied?.(res.data.application)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Apply for ${job?.title || ''}`}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" form="apply-form" disabled={submitting} className="btn-primary">
            <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </>
      }
    >
      <form id="apply-form" onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold text-navy-900">{user?.name}</p>
          <p className="text-slate-500">
            {user?.email}
            {user?.phone ? ` · ${user.phone}` : ''}
          </p>
        </div>

        <fieldset>
          <legend className="label">Resume *</legend>
          {hasProfileResume && (
            <div className="mb-2 space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" checked={useProfileResume} onChange={() => setUseProfileResume(true)} />
                <FileText className="h-4 w-4 text-brand-600" />
                <span className="truncate">Use saved resume ({user.resume.originalName || 'resume'})</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" checked={!useProfileResume} onChange={() => setUseProfileResume(false)} />
                Upload a different resume
              </label>
            </div>
          )}
          {(!hasProfileResume || !useProfileResume) && (
            <>
              <input
                type="file"
                accept={ACCEPT}
                onChange={onFile}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              />
              <p className="mt-1 text-xs text-slate-500">PDF, DOC or DOCX up to 5 MB</p>
            </>
          )}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="expectedSalary">
              Expected Salary
            </label>
            <input
              id="expectedSalary"
              className="input"
              placeholder="e.g. 8 LPA"
              value={form.expectedSalary}
              onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="noticePeriod">
              Notice Period
            </label>
            <input
              id="noticePeriod"
              className="input"
              placeholder="e.g. 30 days"
              value={form.noticePeriod}
              onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="coverLetter">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            rows={4}
            className="input"
            placeholder="Tell us why you are a great fit for this role"
            value={form.coverLetter}
            onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  )
}
