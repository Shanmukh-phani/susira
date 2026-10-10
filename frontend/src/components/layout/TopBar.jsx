import { Globe, Mail, Phone } from 'lucide-react'
import { COMPANY } from '../../data/site'
import SocialLinks from '../SocialIcons'

export default function TopBar() {
  return (
    <div className="bg-navy-900 text-xs text-slate-200">
      <div className="container-x flex h-9 items-center justify-between gap-3">
        <a href={`https://${COMPANY.website}`} className="hidden items-center gap-1.5 hover:text-white sm:flex">
          <Globe className="h-3.5 w-3.5" /> {COMPANY.website}
        </a>
        <div className="flex flex-1 items-center justify-between gap-4 sm:flex-none sm:justify-end">
          <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white">
            <Mail className="h-3.5 w-3.5" /> {COMPANY.email}
          </a>
          <a href={COMPANY.phoneHref} className="flex items-center gap-1.5 hover:text-white">
            <Phone className="h-3.5 w-3.5" /> {COMPANY.phone}
          </a>
          <SocialLinks
            names={['linkedin', 'facebook']}
            className="hidden md:flex"
            itemClassName="h-6 w-6 bg-white/10 hover:bg-white/20 text-white"
          />
        </div>
      </div>
    </div>
  )
}
