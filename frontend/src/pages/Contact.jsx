import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'
import PageBanner from '../components/PageBanner'
import { Alert } from '../components/ui'
import { COMPANY, IMAGES } from '../data/site'
import { useAuth } from '../context/AuthContext'

const TYPES = [
  { value: 'general', label: 'General enquiry' },
  { value: 'employer', label: 'I want to hire talent' },
  { value: 'candidate', label: 'I am a job seeker' },
]

export default function Contact() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const initial = {
    name: user?.role === 'candidate' ? user.name : '',
    email: user?.role === 'candidate' ? user.email : '',
    phone: user?.role === 'candidate' ? user.phone || '' : '',
    company: '',
    type: TYPES.some((t) => t.value === params.get('type')) ? params.get('type') : 'general',
    subject: params.get('subject') || '',
    message: '',
  }
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ error: '', success: '' })
  const [sending, setSending] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ error: '', success: '' })
    setSending(true)
    try {
      const { data } = await api.post('/contact', form)
      setStatus({ error: '', success: data.message })
      setForm({ ...initial, type: form.type, subject: '', message: '' })
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' })
    } finally {
      setSending(false)
    }
  }

  const info = [
    { icon: MapPin, title: 'Office', text: `${COMPANY.name}, ${COMPANY.address}` },
    { icon: Phone, title: 'Phone', text: COMPANY.phone, href: COMPANY.phoneHref },
    { icon: Mail, title: 'Email', text: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: Clock, title: 'Working Hours', text: 'Mon - Sat, 9:30 AM - 6:30 PM' },
  ]

  return (
    <>
      <PageBanner title="Contact Us" crumbs={[{ label: 'Contact Us' }]} image={IMAGES.office} subtitle="We'd love to hear from you." />

      <section className="container-x grid gap-8 py-12 sm:py-14 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          {info.map((i) => (
            <div key={i.title} className="card flex gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <i.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{i.title}</p>
                {i.href ? (
                  <a href={i.href} className="text-sm break-words text-slate-600 hover:text-brand-600">
                    {i.text}
                  </a>
                ) : (
                  <p className="text-sm text-slate-600">{i.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="card space-y-4 p-5 sm:p-8">
          <div>
            <h2 className="text-xl font-bold">Send us a message</h2>
            <p className="mt-1 text-sm text-slate-500">Our team typically responds within one business day.</p>
          </div>
          <Alert>{status.error}</Alert>
          <Alert type="success">{status.success}</Alert>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="c-name">Full Name *</label>
              <input id="c-name" required className="input" value={form.name} onChange={update('name')} />
            </div>
            <div>
              <label className="label" htmlFor="c-email">Email *</label>
              <input id="c-email" type="email" required className="input" value={form.email} onChange={update('email')} />
            </div>
            <div>
              <label className="label" htmlFor="c-phone">Phone</label>
              <input id="c-phone" type="tel" className="input" value={form.phone} onChange={update('phone')} />
            </div>
            <div>
              <label className="label" htmlFor="c-company">Company</label>
              <input id="c-company" className="input" value={form.company} onChange={update('company')} />
            </div>
            <div>
              <label className="label" htmlFor="c-type">I am contacting about</label>
              <select id="c-type" className="input" value={form.type} onChange={update('type')}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="c-subject">Subject</label>
              <input id="c-subject" className="input" value={form.subject} onChange={update('subject')} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="c-message">Message *</label>
            <textarea id="c-message" required rows={5} className="input" value={form.message} onChange={update('message')} />
          </div>
          <button disabled={sending} className="btn-primary w-full sm:w-auto">
            <Send className="h-4 w-4" /> {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>

      <section className="container-x pb-12">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <iframe
            title="Office location"
            src="https://www.google.com/maps?q=Vijayawada,Andhra%20Pradesh&output=embed"
            className="h-72 w-full sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
