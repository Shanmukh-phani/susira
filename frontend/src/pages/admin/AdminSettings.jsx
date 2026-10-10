import { PasswordForm } from '../candidate/CandidateDashboard'

export default function AdminSettings() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="text-sm text-slate-500">Update the password for your admin account.</p>
      </div>
      <div className="card p-5 sm:p-6">
        <PasswordForm />
      </div>
    </div>
  )
}
