import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AppLayout.css'

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/" replace />

  if (user.role === 'social-media-manager' && !location.pathname.startsWith('/marketing/social')) {
    return <Navigate to="/marketing/social" replace />
  }

  return (
    <div className="app-layout">
      <div className={`app-layout__sidebar${mobileOpen ? ' is-open' : ''}`}>
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="app-layout__backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <div className="app-layout__main">
        <Topbar onMenuClick={() => setMobileOpen((v) => !v)} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
