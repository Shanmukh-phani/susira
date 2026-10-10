import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ToastProvider } from './context/ToastContext'
import PublicLayout from './components/layout/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { PageLoader } from './components/ui'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Careers = lazy(() => import('./pages/Careers'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Clients = lazy(() => import('./pages/Clients'))
const Contact = lazy(() => import('./pages/Contact'))
const CandidateDashboard = lazy(() => import('./pages/candidate/CandidateDashboard'))
const CandidateLogin = lazy(() => import('./pages/auth/AuthPages').then((m) => ({ default: m.CandidateLogin })))
const Register = lazy(() => import('./pages/auth/AuthPages').then((m) => ({ default: m.Register })))
const AdminLogin = lazy(() => import('./pages/auth/AuthPages').then((m) => ({ default: m.AdminLogin })))
const CareerResources = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.CareerResources })))
const PrivacyPolicy = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.PrivacyPolicy })))
const Terms = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.NotFound })))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'))
const AdminJobForm = lazy(() => import('./pages/admin/AdminJobForm'))
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'))
const AdminCandidates = lazy(() => import('./pages/admin/AdminCandidates'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:slug" element={<ServiceDetail />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="jobs/:id" element={<JobDetail />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<CandidateLogin />} />
                  <Route path="register" element={<Register />} />
                  <Route path="career-resources" element={<CareerResources />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route element={<ProtectedRoute role="candidate" />}>
                    <Route path="candidate/dashboard" element={<CandidateDashboard />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="admin" element={<ProtectedRoute role="admin" />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="jobs" element={<AdminJobs />} />
                    <Route path="jobs/new" element={<AdminJobForm />} />
                    <Route path="jobs/:id/edit" element={<AdminJobForm />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="candidates" element={<AdminCandidates />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
