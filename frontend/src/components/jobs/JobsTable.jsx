import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle2, Clock, IndianRupee, MapPin } from 'lucide-react'
import { formatExperience, formatSalary } from '../../lib/format'

export default function JobsTable({ jobs, appliedIds = new Set() }) {
  return (
    <>
      {/* Tablet / desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-navy-900 uppercase">
              <th className="px-4 py-3">Job Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Salary</th>
              <th className="hidden px-4 py-3 lg:table-cell">Employment Type</th>
              <th className="px-4 py-3 text-right">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <Link to={`/jobs/${job._id}`} className="font-semibold text-navy-900 hover:text-brand-600">
                    {job.title}
                  </Link>
                  <p className="text-xs text-slate-500">{job.department}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{job.location}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">{formatExperience(job)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">{formatSalary(job)}</td>
                <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">{job.employmentType}</td>
                <td className="px-4 py-3 text-right">
                  {appliedIds.has(job._id) ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap text-green-700">
                      <CheckCircle2 className="h-4 w-4" /> Applied
                    </span>
                  ) : (
                    <Link to={`/jobs/${job._id}`} className="btn-primary btn-sm whitespace-nowrap">
                      View &amp; Apply
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {jobs.map((job) => (
          <li key={job._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/jobs/${job._id}`} className="font-semibold text-navy-900 hover:text-brand-600">
                  {job.title}
                </Link>
                <p className="text-xs text-slate-500">{job.department}</p>
              </div>
              {appliedIds.has(job._id) && (
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Applied
                </span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-600" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-600" /> {formatExperience(job)}
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-brand-600" /> {formatSalary(job)}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-brand-600" /> {job.employmentType}
              </span>
            </div>
            <Link to={`/jobs/${job._id}`} className="btn-primary btn-sm mt-3 w-full">
              {appliedIds.has(job._id) ? 'View Details' : 'View & Apply'}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
