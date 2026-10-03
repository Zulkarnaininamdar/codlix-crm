import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AppLayout.css'

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) return null
  if (!user) return <Navigate to="/" replace />

  if (
    user.role === 'social-media-manager' &&
    !location.pathname.startsWith('/marketing/social') &&
    location.pathname !== '/profile'
  ) {
    return <Navigate to="/marketing/social" replace />
  }

  if (location.pathname.startsWith('/team') && user.role !== 'sales-manager') {
    return <Navigate to="/dashboard" replace />
  }

  if (location.pathname.startsWith('/clients') && user.role !== 'sales-manager') {
    return <Navigate to="/dashboard" replace />
  }

  function handleMenuClick() {
    if (window.innerWidth <= 1024) {
      setMobileOpen((v) => !v)
    } else {
      setSidebarOpen((v) => !v)
    }
  }

  return (
    <div className="app-layout">
      <div
        className={`app-layout__sidebar${mobileOpen ? ' is-open' : ''}${!sidebarOpen ? ' is-collapsed' : ''}`}
      >
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="app-layout__backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <div className="app-layout__main">
        <Topbar onMenuClick={handleMenuClick} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
