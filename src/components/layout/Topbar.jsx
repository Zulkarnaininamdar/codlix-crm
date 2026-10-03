import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  UserIcon,
  LogoutIcon,
  MenuIcon,
} from '../icons/Icons.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import './Topbar.css'

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

// No notification feed is connected yet, so the panel starts empty.
const initialNotifications = []

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, onOutside])
}

function Topbar({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const bellRef = useRef(null)
  const profileRef = useRef(null)

  useClickOutside(bellRef, () => setBellOpen(false))
  useClickOutside(profileRef, () => setProfileOpen(false))

  const unreadCount = notifications.filter((n) => !n.read).length
  const unreadNotifications = notifications.filter((n) => !n.read)
  const previousNotifications = notifications.filter((n) => n.read)

  function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <header className="topbar">
      <button className="topbar__icon-btn topbar__menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <MenuIcon />
      </button>

      <div className="topbar__heading">
        {user?.department}
      </div>

      <div className="topbar__actions">
        <div className="topbar__bell" ref={bellRef}>
          <button
            className="topbar__icon-btn"
            onClick={() => setBellOpen((v) => !v)}
            aria-label="Notifications"
          >
            <BellIcon />
            {unreadCount > 0 && <span className="topbar__badge" />}
          </button>
          <div
            className={`topbar__notif-backdrop${bellOpen ? ' is-open' : ''}`}
            onClick={() => setBellOpen(false)}
          />

          <aside
            className={`topbar__notif-panel${bellOpen ? ' is-open' : ''}`}
            role="menu"
            aria-hidden={!bellOpen}
          >
            <div className="topbar__notif-header">
              <h4>Notifications</h4>
              <button
                className="topbar__notif-close"
                onClick={() => setBellOpen(false)}
                aria-label="Close notifications"
              >
                <CloseIcon />
              </button>
            </div>

            {notifications.length > 0 ? (
              <div className="topbar__notif-list">
                {unreadNotifications.length > 0 && (
                  <div className="topbar__notif-section">
                    <span className="topbar__notif-section-label topbar__notif-section-label--unread">
                      Unread notifications
                    </span>
                    {unreadNotifications.map((n) => (
                      <button
                        key={n.id}
                        className="topbar__notif-card topbar__notif-card--unread"
                        onClick={() => markRead(n.id)}
                      >
                        <span className="topbar__notif-card-icon">
                          <BellIcon />
                        </span>
                        <span className="topbar__notif-card-text">{n.message}</span>
                      </button>
                    ))}
                  </div>
                )}

                {previousNotifications.length > 0 && (
                  <div className="topbar__notif-section">
                    <span className="topbar__notif-section-label">Previous notifications</span>
                    {previousNotifications.map((n) => (
                      <div key={n.id} className="topbar__notif-card">
                        <span className="topbar__notif-card-icon">
                          <BellIcon />
                        </span>
                        <span className="topbar__notif-card-text">{n.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="topbar__notif-empty">
                <BellIcon />
                <p>You're all caught up</p>
              </div>
            )}

            <button className="topbar__notif-footer" onClick={() => setBellOpen(false)}>
              View all notifications
            </button>
          </aside>
        </div>

        <div className="topbar__profile" ref={profileRef}>
          <button className="topbar__profile-btn" onClick={() => setProfileOpen((v) => !v)}>
            <span className="topbar__avatar">{user ? initials(user.name) : ''}</span>
            <span className="topbar__profile-info">
              <span className="topbar__profile-name">{user?.name}</span>
              <span className="topbar__profile-role">{user?.roleLabel}</span>
            </span>
            <ChevronDownIcon className={`topbar__chevron${profileOpen ? ' is-open' : ''}`} />
          </button>
          {profileOpen && (
            <div className="topbar__menu">
              <button
                className="topbar__menu-item"
                onClick={() => {
                  setProfileOpen(false)
                  navigate('/profile')
                }}
              >
                <UserIcon className="topbar__menu-icon" /> My Profile
              </button>
              <button
                className="topbar__menu-item"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <LogoutIcon className="topbar__menu-icon" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
