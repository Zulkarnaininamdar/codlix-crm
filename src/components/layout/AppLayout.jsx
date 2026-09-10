import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AppLayout.css'

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
