import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../../assets/codlix-logo.png'
import { ChevronDownIcon } from '../icons/Icons.jsx'
import { navConfig, socialManagerNavConfig } from './navConfig.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import './Sidebar.css'

function groupContainsPath(group, pathname) {
  return group.children?.some((c) => pathname.startsWith(c.path))
}

function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const items = user?.role === 'social-media-manager' ? socialManagerNavConfig : navConfig
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {}
    items.forEach((item) => {
      if (item.type === 'group') {
        initial[item.label] = groupContainsPath(item, location.pathname)
      }
    })
    return initial
  })

  function toggleGroup(label) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={logo} alt="Codlix" className="sidebar__logo" />
        <span className="sidebar__brand-text">
          CODLIX <strong>TECH</strong>
        </span>
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => {
          if (item.type === 'link') {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
              >
                <Icon className="sidebar__icon" />
                <span>{item.label}</span>
              </NavLink>
            )
          }

          const GroupIcon = item.icon
          const isOpen = !!openGroups[item.label]
          const isGroupActive = groupContainsPath(item, location.pathname)

          return (
            <div className="sidebar__group" key={item.label}>
              <button
                type="button"
                className={`sidebar__group-head${isGroupActive ? ' is-active' : ''}`}
                onClick={() => toggleGroup(item.label)}
                aria-expanded={isOpen}
              >
                <GroupIcon className="sidebar__icon" />
                <span className="sidebar__group-label">{item.label}</span>
                <ChevronDownIcon className={`sidebar__chevron${isOpen ? ' is-open' : ''}`} />
              </button>

              <div className={`sidebar__submenu${isOpen ? ' is-open' : ''}`}>
                <div className="sidebar__submenu-inner">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end={child.end}
                      className={({ isActive }) => `sidebar__sublink${isActive ? ' is-active' : ''}`}
                    >
                      <span className="sidebar__sublink-dot" />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
