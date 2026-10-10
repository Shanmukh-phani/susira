import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from './ui'

export default function ProtectedRoute({ role }) {
  const { user, loading, token } = useAuth()
  const location = useLocation()

  if (loading || (token && !user)) return <PageLoader />

  const loginPath = role === 'admin' ? '/admin/login' : '/login'
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${loginPath}?next=${next}`} replace />
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/candidate/dashboard'} replace />
  }
  return <Outlet />
}
