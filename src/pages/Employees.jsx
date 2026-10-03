import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  SearchIcon,
  EmployeesIcon,
  CheckCircleIcon,
  BuildingIcon,
  SalesIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Badge.css'
import './Employees.css'

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function Employees() {
  const { employees, leads } = useLeads()
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  const leadStats = useMemo(() => {
    const byEmployee = {}
    leads.forEach((lead) => {
      const entry = (byEmployee[lead.assignedTo] ??= { leads: 0, won: 0 })
      entry.leads += 1
      if (lead.status === 'Won') entry.won += 1
    })
    return byEmployee
  }, [leads])

  const stats = useMemo(() => {
    const won = Object.values(leadStats).reduce((sum, s) => sum + s.won, 0)
    return {
      total: employees.length,
      sales: employees.filter((e) => e.department === 'Sales').length,
      departments: new Set(employees.map((e) => e.department)).size,
      won,
    }
  }, [employees, leadStats])

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || (e.email ?? '').toLowerCase().includes(q)
      const matchesDept = !departmentFilter || e.department === departmentFilter
      return matchesSearch && matchesDept
    })
  }, [employees, search, departmentFilter])

  return (
    <div className="employees-page">
      <PageHeader title="Employees" subtitle="Your team and how each person is performing on leads" />

      <div className="employees-stats">
        <KpiCard label="Total Employees" value={stats.total} icon={EmployeesIcon} accent="#2a78d6" />
        <KpiCard label="Sales Team" value={stats.sales} icon={CheckCircleIcon} accent="#1baf7a" />
        <KpiCard label="Departments" value={stats.departments} icon={BuildingIcon} accent="#eb6834" />
        <KpiCard label="Leads Won" value={stats.won} icon={SalesIcon} accent="#eda100" />
      </div>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>All Employees</h3>
            <span>{filteredEmployees.length} of {employees.length}</span>
          </div>
          <div className="employees-search">
            <SearchIcon className="employees-search__icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="employees-filter-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="">All Departments</option>
            {[...new Set(employees.map((e) => e.department))].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Leads</th>
                <th>Won</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const stat = leadStats[emp.id]
                return (
                  <tr key={emp.id} className="is-clickable">
                    <td>
                      <div className="data-table__who">
                        <span className="data-table__avatar">{initials(emp.name)}</span>
                        <div>
                          <Link to={`/employees/${emp.id}`} className="data-table__link">{emp.name}</Link>
                          <p className="data-table__secondary">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="data-table__muted">{emp.department}</td>
                    <td className="data-table__muted">{emp.role}</td>
                    <td><Badge tone={statusTone(emp.status)}>{emp.status}</Badge></td>
                    <td className="data-table__muted">{stat?.leads ?? 0}</td>
                    <td className="data-table__muted">{stat?.won ?? 0}</td>
                    <td>
                      <Link to={`/employees/${emp.id}`} className="data-table__link">View</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="data-table__empty">No employees match your search or filters.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Employees
