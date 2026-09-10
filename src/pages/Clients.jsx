import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { clients } from '../data/mockData.js'
import { SearchIcon, CustomersIcon, CheckCircleIcon, ProjectsIcon, CalendarIcon } from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/DataTable.css'
import './Clients.css'

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function isThisMonth(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

function Clients() {
  const [search, setSearch] = useState('')

  const stats = useMemo(
    () => ({
      total: clients.length,
      active: clients.filter((c) => c.status === 'Active').length,
      projects: clients.reduce((sum, c) => sum + c.projects, 0),
      newThisMonth: clients.filter((c) => isThisMonth(c.since)).length,
    }),
    []
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) => c.company.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="clients-page">
      <PageHeader title="Clients" subtitle="Companies whose proposals were accepted and converted" />

      <div className="clients-stats">
        <div className="clients-stat">
          <span className="clients-stat__icon"><CustomersIcon /></span>
          <div>
            <p className="clients-stat__value">{stats.total}</p>
            <p className="clients-stat__label">Total Clients</p>
          </div>
        </div>
        <div className="clients-stat">
          <span className="clients-stat__icon"><CheckCircleIcon /></span>
          <div>
            <p className="clients-stat__value">{stats.active}</p>
            <p className="clients-stat__label">Active</p>
          </div>
        </div>
        <div className="clients-stat">
          <span className="clients-stat__icon"><ProjectsIcon /></span>
          <div>
            <p className="clients-stat__value">{stats.projects}</p>
            <p className="clients-stat__label">Projects Running</p>
          </div>
        </div>
        <div className="clients-stat">
          <span className="clients-stat__icon"><CalendarIcon /></span>
          <div>
            <p className="clients-stat__value">{stats.newThisMonth}</p>
            <p className="clients-stat__label">New This Month</p>
          </div>
        </div>
      </div>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>All Clients</h3>
            <span>{filtered.length} of {clients.length}</span>
          </div>
          <div className="clients-search">
            <SearchIcon className="clients-search__icon" />
            <input
              type="text"
              placeholder="Search by company or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Client Since</th>
                <th>Owner</th>
                <th>Projects</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="data-table__who">
                      <span className="data-table__avatar">{initials(c.company)}</span>
                      <p className="data-table__primary">{c.company}</p>
                    </div>
                  </td>
                  <td className="data-table__muted">{c.since}</td>
                  <td className="data-table__muted">{c.owner}</td>
                  <td className="data-table__muted">{c.projects}</td>
                  <td className="data-table__strong">{c.revenue}</td>
                  <td><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                  <td><Link to={`/clients/${c.id}`} className="data-table__link">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="data-table__empty">No clients match your search.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clients
