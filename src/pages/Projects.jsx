import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import { SearchIcon, ProjectsIcon, TrendUpIcon, CheckCircleIcon, FlagIcon, PlusIcon } from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/DataTable.css'
import './Projects.css'

function Projects() {
  const { items: projects } = useCrm('projects')
  const [search, setSearch] = useState('')

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status === 'Active').length
    const completed = projects.filter((p) => p.status === 'Completed').length
    const avgProgress = projects.length
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress ?? 0), 0) / projects.length)
      : 0
    return { total: projects.length, active, completed, avgProgress }
  }, [projects])

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.manager.toLowerCase().includes(q)
    )
  }, [projects, search])

  return (
    <div className="projects-page">
      <PageHeader title="Projects" subtitle="Track delivery progress across every active engagement">
        <Link to="/projects/new" className="btn btn--primary">
          <PlusIcon /> Create New Project
        </Link>
      </PageHeader>

      <div className="projects-stats">
        <KpiCard label="Total Projects" value={stats.total} icon={ProjectsIcon} accent="#2a78d6" />
        <KpiCard label="Active" value={stats.active} icon={FlagIcon} accent="#eda100" />
        <KpiCard label="Completed" value={stats.completed} icon={CheckCircleIcon} accent="#1baf7a" />
        <KpiCard label="Avg. Progress" value={`${stats.avgProgress}%`} icon={TrendUpIcon} accent="#eb6834" />
      </div>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>All Projects</h3>
            <span>{filteredProjects.length} of {projects.length}</span>
          </div>
          <div className="projects-search">
            <SearchIcon className="projects-search__icon" />
            <input
              type="text"
              placeholder="Search by project, client or manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Manager</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/projects/${p.id}`} className="data-table__link">{p.name}</Link></td>
                  <td className="data-table__muted">{p.client}</td>
                  <td className="data-table__muted">{p.manager}</td>
                  <td className="data-table__muted">{p.startDate}</td>
                  <td className="data-table__muted">{p.endDate}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-cell__bar"><div style={{ width: `${p.progress}%` }} /></div>
                      <span>{p.progress}%</span>
                    </div>
                  </td>
                  <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="data-table__empty">No projects match your search.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
