import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import Modal from '../components/common/Modal.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { employees as initialEmployees, employeeStats } from '../data/mockData.js'
import {
  PlusIcon,
  SearchIcon,
  EmployeesIcon,
  CheckCircleIcon,
  BuildingIcon,
  SalesIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import '../components/common/Badge.css'
import './Employees.css'

const departments = ['Sales', 'Marketing', 'Customer Success', 'Operations', 'Finance']
const roles = ['Sales Executive', 'Sales Manager', 'Marketing Executive', 'Marketing Manager', 'Operations Executive']
const statuses = ['Active', 'On Leave', 'Inactive']

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  department: 'Sales',
  role: 'Sales Executive',
  status: 'Active',
  joinDate: '',
  location: '',
  reportingTo: '',
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function Employees() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const stats = useMemo(() => {
    const departmentCount = new Set(employees.map((e) => e.department)).size
    return {
      total: employees.length,
      active: employees.filter((e) => e.status === 'Active').length,
      departments: departmentCount,
      won: employees.reduce((sum, e) => sum + (employeeStats[e.id]?.won ?? 0), 0),
    }
  }, [employees])

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      const matchesDept = !departmentFilter || e.department === departmentFilter
      const matchesStatus = !statusFilter || e.status === statusFilter
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [employees, search, departmentFilter, statusFilter])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addEmployee(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    const next = { id: `emp-${Date.now()}`, ...form }
    setEmployees((prev) => [next, ...prev])
    employeeStats[next.id] = { name: next.name, leads: 0, qualified: 0, meetings: 0, proposals: 0, won: 0, revenue: '₹0' }
    setForm(emptyForm)
    setAddOpen(false)
  }

  return (
    <div className="employees-page">
      <PageHeader title="Employees" subtitle="Manage your team and track individual performance">
        <button className="btn btn--primary" onClick={() => setAddOpen(true)}>
          <PlusIcon /> Add Employee
        </button>
      </PageHeader>

      <div className="employees-stats">
        <div className="employees-stat">
          <span className="employees-stat__icon"><EmployeesIcon /></span>
          <div>
            <p className="employees-stat__value">{stats.total}</p>
            <p className="employees-stat__label">Total Employees</p>
          </div>
        </div>
        <div className="employees-stat">
          <span className="employees-stat__icon"><CheckCircleIcon /></span>
          <div>
            <p className="employees-stat__value">{stats.active}</p>
            <p className="employees-stat__label">Active Now</p>
          </div>
        </div>
        <div className="employees-stat">
          <span className="employees-stat__icon"><BuildingIcon /></span>
          <div>
            <p className="employees-stat__value">{stats.departments}</p>
            <p className="employees-stat__label">Departments</p>
          </div>
        </div>
        <div className="employees-stat">
          <span className="employees-stat__icon"><SalesIcon /></span>
          <div>
            <p className="employees-stat__value">{stats.won}</p>
            <p className="employees-stat__label">Deals Won</p>
          </div>
        </div>
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
          <select className="employees-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
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
                <th>Meetings</th>
                <th>Won</th>
                <th>Revenue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const stat = employeeStats[emp.id]
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
                    <td className="data-table__muted">{stat?.meetings ?? 0}</td>
                    <td className="data-table__muted">{stat?.won ?? 0}</td>
                    <td className="data-table__strong">{stat?.revenue ?? '₹0'}</td>
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Employee" width="600px">
        <form className="employee-form" onSubmit={addEmployee}>
          <div className="form-grid">
            <div className="field field--full">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Neha Kapoor" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@codlixtech.in" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98200 00000" />
            </div>
            <div className="field">
              <label>Department</label>
              <select value={form.department} onChange={(e) => set('department', e.target.value)}>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => set('role', e.target.value)}>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Join Date</label>
              <input type="date" value={form.joinDate} onChange={(e) => set('joinDate', e.target.value)} />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Location</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Mumbai, India" />
            </div>
            <div className="field">
              <label>Reporting To</label>
              <input value={form.reportingTo} onChange={(e) => set('reportingTo', e.target.value)} placeholder="Manager name" />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">Add Employee</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Employees
