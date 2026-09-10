import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHeader from '../components/common/PageHeader.jsx'
import Modal from '../components/common/Modal.jsx'
import Badge from '../components/common/Badge.jsx'
import ChartTooltip from '../components/dashboard/ChartTooltip.jsx'
import { statusTone } from '../components/common/statusTone.js'
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart.jsx'
import MonthlyRevenueChart from '../components/dashboard/MonthlyRevenueChart.jsx'
import LeadPipeline from '../components/dashboard/LeadPipeline.jsx'
import { leads, followUps, employees, employeeStats } from '../data/mockData.js'
import {
  AnalyticsIcon,
  EmployeesIcon,
  SalesIcon,
  ReportsIcon,
  FollowupsIcon,
  LeadsIcon,
  BudgetIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Form.css'
import '../components/common/DataTable.css'
import './Reports.css'

const filterOptions = {
  employee: employees.map((e) => e.name),
  country: [...new Set(leads.map((l) => l.country))],
  industry: [...new Set(leads.map((l) => l.industry))],
  service: [...new Set(leads.map((l) => l.service))],
  source: [...new Set(leads.map((l) => l.source))],
}

const reportCards = [
  { key: 'source', title: 'Lead Source Report', icon: LeadsIcon, description: 'Where your leads are coming from this month.' },
  { key: 'performance', title: 'Employee Performance', icon: EmployeesIcon, description: 'Deals closed per team member.' },
  { key: 'funnel', title: 'Sales Funnel', icon: AnalyticsIcon, description: 'Conversion across every pipeline stage.' },
  { key: 'revenue', title: 'Revenue Report', icon: BudgetIcon, description: 'Closed revenue trend, last 8 months.' },
  { key: 'pipeline', title: 'Pipeline Report', icon: ReportsIcon, description: 'Open leads grouped by current stage.' },
  { key: 'followup', title: 'Follow-up Report', icon: FollowupsIcon, description: "Today, upcoming and overdue follow-ups." },
  { key: 'lost', title: 'Lost Lead Report', icon: SalesIcon, description: 'Deals lost and why they slipped away.' },
]

function Reports() {
  const [filters, setFilters] = useState({ date: '', employee: '', country: '', industry: '', service: '', source: '' })
  const [open, setOpen] = useState(null)

  function set(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const employeePerformanceData = employees.map((e) => ({ name: e.name.split(' ')[0], won: employeeStats[e.id].won }))
  const lostLeads = leads.filter((l) => l.status === 'Lost')
  const pipelineCounts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="reports-page">
      <PageHeader title="Reports" subtitle="Analyze performance across leads, employees and revenue" />

      <div className="reports-filters">
        <div className="field">
          <label>Date</label>
          <select value={filters.date} onChange={(e) => set('date', e.target.value)}>
            <option value="">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="quarter">This quarter</option>
          </select>
        </div>
        <div className="field">
          <label>Employee</label>
          <select value={filters.employee} onChange={(e) => set('employee', e.target.value)}>
            <option value="">All employees</option>
            {filterOptions.employee.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Country</label>
          <select value={filters.country} onChange={(e) => set('country', e.target.value)}>
            <option value="">All countries</option>
            {filterOptions.country.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Industry</label>
          <select value={filters.industry} onChange={(e) => set('industry', e.target.value)}>
            <option value="">All industries</option>
            {filterOptions.industry.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Service</label>
          <select value={filters.service} onChange={(e) => set('service', e.target.value)}>
            <option value="">All services</option>
            {filterOptions.service.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Lead Source</label>
          <select value={filters.source} onChange={(e) => set('source', e.target.value)}>
            <option value="">All sources</option>
            {filterOptions.source.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="reports-grid">
        {reportCards.map((r) => {
          const Icon = r.icon
          return (
            <button className="report-card" key={r.key} onClick={() => setOpen(r.key)}>
              <span className="report-card__icon"><Icon /></span>
              <div>
                <p className="report-card__title">{r.title}</p>
                <p className="report-card__description">{r.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <Modal open={open === 'source'} onClose={() => setOpen(null)} title="Lead Source Report" width="640px">
        <LeadsBySourceChart />
      </Modal>

      <Modal open={open === 'performance'} onClose={() => setOpen(null)} title="Employee Performance" width="640px">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={employeePerformanceData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8a8a92', fontSize: 12.5 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8a8a92', fontSize: 12.5 }} width={30} />
            <Tooltip cursor={{ fill: 'rgba(100,72,244,0.06)' }} content={<ChartTooltip formatter={(v) => `${v} won`} />} />
            <Bar dataKey="won" fill="#6448F4" radius={[6, 6, 0, 0]} barSize={34} />
          </BarChart>
        </ResponsiveContainer>
      </Modal>

      <Modal open={open === 'funnel'} onClose={() => setOpen(null)} title="Sales Funnel" width="720px">
        <LeadPipeline />
      </Modal>

      <Modal open={open === 'revenue'} onClose={() => setOpen(null)} title="Revenue Report" width="640px">
        <MonthlyRevenueChart />
      </Modal>

      <Modal open={open === 'pipeline'} onClose={() => setOpen(null)} title="Pipeline Report" width="480px">
        <ul className="report-list">
          {Object.entries(pipelineCounts).map(([status, count]) => (
            <li key={status}>
              <Badge tone={statusTone(status)}>{status}</Badge>
              <span>{count} lead{count > 1 ? 's' : ''}</span>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={open === 'followup'} onClose={() => setOpen(null)} title="Follow-up Report" width="480px">
        <ul className="report-list">
          <li><span>Today</span><strong>{followUps.filter((f) => f.bucket === 'today').length}</strong></li>
          <li><span>Upcoming</span><strong>{followUps.filter((f) => f.bucket === 'upcoming').length}</strong></li>
          <li><span>Overdue</span><strong>{followUps.filter((f) => f.bucket === 'overdue').length}</strong></li>
        </ul>
      </Modal>

      <Modal open={open === 'lost'} onClose={() => setOpen(null)} title="Lost Lead Report" width="560px">
        {lostLeads.length > 0 ? (
          <table className="data-table">
            <thead><tr><th>Company</th><th>Service</th><th>Notes</th></tr></thead>
            <tbody>
              {lostLeads.map((l) => (
                <tr key={l.id}>
                  <td className="data-table__primary">{l.company}</td>
                  <td className="data-table__muted">{l.service}</td>
                  <td className="data-table__muted">{l.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No lost leads this period.</p>}
      </Modal>
    </div>
  )
}

export default Reports
