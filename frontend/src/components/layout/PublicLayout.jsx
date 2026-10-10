import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'
import { useSocketEvent } from '../../context/SocketContext'
import { useToast } from '../../context/ToastContext'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const { isCandidate } = useAuth()
  const toast = useToast()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useSocketEvent('application:status', (data) => {
    if (!isCandidate || pathname.startsWith('/candidate')) return
    toast.info(`Your application for ${data.job?.title || 'a job'} is now "${data.statusLabel}".`, 'Application update')
  })

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
