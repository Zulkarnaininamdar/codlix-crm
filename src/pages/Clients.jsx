import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
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
  const { items: clients } = useCrm('clients')
  const { items: projects } = useCrm('projects')
  const [search, setSearch] = useState('')

  // Project counts come from the live project list, so they stay correct when projects are added or edited.
  const projectCounts = useMemo(() => {
    const counts = {}
    projects.forEach((p) => {
      if (!['Completed', 'Cancelled'].includes(p.status)) counts[p.client] = (counts[p.client] ?? 0) + 1
    })
    return counts
  }, [projects])

  const stats = useMemo(
    () => ({
      total: clients.length,
      active: clients.filter((c) => c.status === 'Active').length,
      projects: Object.values(projectCounts).reduce((sum, n) => sum + n, 0),
      newThisMonth: clients.filter((c) => isThisMonth(c.since)).length,
    }),
    [clients, projectCounts]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) => c.company.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q))
  }, [clients, search])

  return (
    <div className="clients-page">
      <PageHeader title="Clients" subtitle="Companies whose proposals were accepted and converted" />

      <div className="clients-stats">
        <KpiCard label="Total Clients" value={stats.total} icon={CustomersIcon} accent="#2a78d6" />
        <KpiCard label="Active" value={stats.active} icon={CheckCircleIcon} accent="#1baf7a" />
        <KpiCard label="Projects Running" value={stats.projects} icon={ProjectsIcon} accent="#eb6834" />
        <KpiCard label="New This Month" value={stats.newThisMonth} icon={CalendarIcon} accent="#eda100" />
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
                  <td className="data-table__muted">{projectCounts[c.company] ?? 0}</td>
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
