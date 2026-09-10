import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import Drawer from '../components/common/Drawer.jsx'
import TableFooter from '../components/common/TableFooter.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { leads as initialLeads, employees, employeeName } from '../data/mockData.js'
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  SortIcon,
  CaretUpIcon,
  CaretDownIcon,
  LeadsIcon,
  ContactsIcon,
  FollowupsIcon,
  SalesIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import './Leads.css'

const statuses = ['New', 'Contacted', 'Qualified', 'Meeting', 'Proposal', 'Negotiation', 'Won', 'Lost']
const sources = ['LinkedIn', 'Cold Email', 'Referral', 'Website', 'WhatsApp']
const priorities = ['Low', 'Medium', 'High', 'Urgent']
const priorityRank = { Low: 0, Medium: 1, High: 2, Urgent: 3 }
const statusRank = Object.fromEntries(statuses.map((s, i) => [s, i]))
const PAGE_SIZE = 6

const emptyFilters = { status: '', source: '', employee: '', priority: '', date: '' }

const columns = [
  { key: 'company', label: 'Company', sortable: true },
  { key: 'contactName', label: 'Contact', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'assignedTo', label: 'Assigned', sortable: true },
  { key: 'action', label: 'Action', sortable: false },
]

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function withinDateFilter(lead, date) {
  if (!date) return true
  const created = new Date(lead.createdAt)
  const now = new Date('2026-09-06')
  const days = (now - created) / (1000 * 60 * 60 * 24)
  if (date === '7') return days <= 7
  if (date === '30') return days <= 30
  if (date === 'month') return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  return true
}

function compareBy(key) {
  return (a, b) => {
    if (key === 'priority') return priorityRank[a.priority] - priorityRank[b.priority]
    if (key === 'status') return statusRank[a.status] - statusRank[b.status]
    if (key === 'assignedTo') return employeeName(a.assignedTo).localeCompare(employeeName(b.assignedTo))
    return String(a[key]).localeCompare(String(b[key]))
  }
}

function Leads() {
  const [rows, setRows] = useState(initialLeads)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(() => new Set())

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const stats = useMemo(
    () => ({
      total: rows.length,
      new: rows.filter((l) => l.status === 'New').length,
      qualified: rows.filter((l) => l.status === 'Qualified').length,
      won: rows.filter((l) => l.status === 'Won').length,
    }),
    [rows]
  )

  const filteredLeads = useMemo(() => {
    let list = rows.filter((lead) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        lead.company.toLowerCase().includes(q) ||
        lead.contactName.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q)

      return (
        matchesSearch &&
        (!filters.status || lead.status === filters.status) &&
        (!filters.source || lead.source === filters.source) &&
        (!filters.employee || lead.assignedTo === filters.employee) &&
        (!filters.priority || lead.priority === filters.priority) &&
        withinDateFilter(lead, filters.date)
      )
    })

    if (sort.key) {
      list = [...list].sort(compareBy(sort.key))
      if (sort.dir === 'desc') list.reverse()
    }

    return list
  }, [rows, search, filters, sort])

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE))
  const pageRows = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageIds = pageRows.map((l) => l.id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  function changeSearch(value) {
    setSearch(value)
    setPage(1)
  }

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })
  }

  function goToPage(next) {
    setPage(Math.min(Math.max(1, next), totalPages))
  }

  function deleteSelected() {
    setRows((prev) => prev.filter((l) => !selected.has(l.id)))
    setSelected(new Set())
  }

  return (
    <div className="leads-page">
      <PageHeader title="Leads" subtitle="Manage and track every lead across your pipeline">
        <Link to="/leads/new" className="btn btn--primary">
          <PlusIcon /> Add Lead
        </Link>
      </PageHeader>

      <div className="leads-stats">
        <div className="leads-stat">
          <span className="leads-stat__icon"><LeadsIcon /></span>
          <div>
            <p className="leads-stat__value">{stats.total}</p>
            <p className="leads-stat__label">Total Leads</p>
          </div>
        </div>
        <div className="leads-stat">
          <span className="leads-stat__icon"><ContactsIcon /></span>
          <div>
            <p className="leads-stat__value">{stats.new}</p>
            <p className="leads-stat__label">New</p>
          </div>
        </div>
        <div className="leads-stat">
          <span className="leads-stat__icon"><FollowupsIcon /></span>
          <div>
            <p className="leads-stat__value">{stats.qualified}</p>
            <p className="leads-stat__label">Qualified</p>
          </div>
        </div>
        <div className="leads-stat">
          <span className="leads-stat__icon"><SalesIcon /></span>
          <div>
            <p className="leads-stat__value">{stats.won}</p>
            <p className="leads-stat__label">Won</p>
          </div>
        </div>
      </div>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>All Leads</h3>
            <span>{filteredLeads.length} of {rows.length}</span>
          </div>
          <div className="leads-search">
            <SearchIcon className="leads-search__icon" />
            <input
              type="text"
              placeholder="Search by company, contact or email..."
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--secondary" onClick={() => setDrawerOpen(true)}>
            <FilterIcon /> Filter
            {activeFilterCount > 0 && <span className="leads-filter-count">{activeFilterCount}</span>}
          </button>
        </div>

        {selected.size > 0 && (
          <div className="data-table__bulk-bar">
            <span>{selected.size} selected</span>
            <div className="data-table__bulk-bar-actions">
              <button className="btn btn--sm btn--ghost" onClick={() => setSelected(new Set())}>
                Clear
              </button>
              <button className="btn btn--sm btn--dark" onClick={deleteSelected}>
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="data-table__checkbox-col">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAllOnPage}
                    aria-label="Select all rows on this page"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`${col.sortable ? 'is-sortable' : ''}${sort.key === col.key ? ' is-sorted' : ''}`}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <span className="data-table__th-inner">
                      {col.label}
                      {col.sortable && (
                        sort.key === col.key
                          ? (sort.dir === 'asc' ? <CaretUpIcon className="data-table__sort-icon" /> : <CaretDownIcon className="data-table__sort-icon" />)
                          : <SortIcon className="data-table__sort-icon" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((lead) => (
                <tr key={lead.id} className={selected.has(lead.id) ? 'is-selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggleRow(lead.id)}
                      aria-label={`Select ${lead.company}`}
                    />
                  </td>
                  <td>
                    <p className="data-table__primary">{lead.company}</p>
                    <p className="data-table__secondary">{lead.industry}</p>
                  </td>
                  <td>
                    <p className="data-table__primary">{lead.contactName}</p>
                    <p className="data-table__secondary">{lead.designation}</p>
                  </td>
                  <td>
                    <p className="data-table__primary">{lead.priority}</p>
                  </td>
                  <td>
                    <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
                  </td>
                  <td>
                    <div className="data-table__who">
                      <span className="data-table__avatar">{initials(employeeName(lead.assignedTo))}</span>
                      <p className="data-table__primary">{employeeName(lead.assignedTo)}</p>
                    </div>
                  </td>
                  <td>
                    <Link to={`/leads/${lead.id}`} className="data-table__link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="data-table__empty">No leads match your search or filters.</div>
          )}
        </div>

        {filteredLeads.length > 0 && (
          <TableFooter page={page} pageSize={PAGE_SIZE} total={filteredLeads.length} onPageChange={goToPage} />
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter Leads"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setFilters(emptyFilters)}>
              Clear all
            </button>
            <button className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>
              Show {filteredLeads.length} results
            </button>
          </>
        }
      >
        <div className="field">
          <label>Status</label>
          <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Source</label>
          <select value={filters.source} onChange={(e) => updateFilter('source', e.target.value)}>
            <option value="">Any source</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Employee</label>
          <select value={filters.employee} onChange={(e) => updateFilter('employee', e.target.value)}>
            <option value="">Any employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Priority</label>
          <select value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)}>
            <option value="">Any priority</option>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Date created</label>
          <select value={filters.date} onChange={(e) => updateFilter('date', e.target.value)}>
            <option value="">Any time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="month">This month</option>
          </select>
        </div>
      </Drawer>
    </div>
  )
}

export default Leads
