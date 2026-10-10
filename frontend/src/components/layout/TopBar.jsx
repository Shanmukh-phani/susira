import { Globe, Mail } from 'lucide-react'
import { COMPANY } from '../../data/site'

export default function TopBar() {
  return (
    <div className="bg-navy-900 text-xs text-slate-200">
      <div className="container-x flex h-9 items-center justify-between gap-3">
        <a href={`https://${COMPANY.website}`} className="flex items-center gap-1.5 hover:text-white">
          <Globe className="h-3.5 w-3.5" /> {COMPANY.website}
        </a>
        <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white">
          <Mail className="h-3.5 w-3.5" /> {COMPANY.email}
        </a>
      </div>
    </div>
  )
}
