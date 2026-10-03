import { useParams, Link } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import ChartTooltip from '../components/dashboard/ChartTooltip.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { pipelineStages } from '../data/pipeline.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  ArrowLeftIcon,
  LeadsIcon,
  FollowupsIcon,
  SalesIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  BriefcaseIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/Badge.css'
import '../components/common/DataTable.css'
import './EmployeeDetails.css'

const QUALIFIED_INDEX = pipelineStages.indexOf('Qualified')

/** Leads this employee owns, counted per month of creation over the last six months. */
function monthlyLeadIntake(employeeLeads) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
    return {
      month: month.toLocaleDateString('en-IN', { month: 'short' }),
      leads: employeeLeads.filter((l) => (l.createdAt ?? '').startsWith(key)).length,
    }
  })
}

function EmployeeDetails() {
  const { id } = useParams()
  const { leads, employees, loaded } = useLeads()
  const employee = employees.find((e) => e.id === id)

  if (!loaded) {
    return (
      <div className="employee-details-page">
        <p className="employee-details__empty">Loading employee…</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="employee-details-page">
        <Link to="/employees" className="back-link"><ArrowLeftIcon /> Back to Employees</Link>
        <p className="employee-details__empty">Employee not found.</p>
      </div>
    )
  }

  const employeeLeads = leads.filter((l) => l.assignedTo === id)
  const stats = {
    leads: employeeLeads.length,
    qualified: employeeLeads.filter((l) => pipelineStages.indexOf(l.status) >= QUALIFIED_INDEX).length,
    won: employeeLeads.filter((l) => l.status === 'Won').length,
  }
  const trend = monthlyLeadIntake(employeeLeads)

  return (
    <div className="employee-details-page">
      <Link to="/employees" className="back-link"><ArrowLeftIcon /> Back to Employees</Link>

      <header className="employee-details__header">
        <div className="employee-details__heading">
          <div className="employee-details__avatar">
            {employee.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="employee-details__title-row">
              <h1>{employee.name}</h1>
              {employee.status && <Badge tone={statusTone(employee.status)}>{employee.status}</Badge>}
            </div>
            <p className="employee-details__subtitle">{employee.role} · {employee.department}</p>
            <div className="employee-details__meta">
              {employee.location && (
                <span><MapPinIcon /> {employee.location}</span>
              )}
              {employee.joinDate && (
                <span><CalendarIcon /> Joined {employee.joinDate}</span>
              )}
              {employee.reportingTo && (
                <span><UserIcon /> Reports to {employee.reportingTo}</span>
              )}
              <span className="employee-details__id"><BriefcaseIcon /> {employee.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="employee-details__actions">
          {employee.phone && (
            <a href={`tel:${employee.phone}`} className="btn btn--secondary btn--sm">
              <PhoneIcon /> Call
            </a>
          )}
          {employee.email && (
            <a href={`mailto:${employee.email}`} className="btn btn--secondary btn--sm">
              <MailIcon /> Email
            </a>
          )}
        </div>
      </header>

      <div className="employee-details__kpis">
        <KpiCard label="Leads" value={stats.leads} icon={LeadsIcon} />
        <KpiCard label="Qualified" value={stats.qualified} icon={FollowupsIcon} />
        <KpiCard label="Won" value={stats.won} icon={SalesIcon} />
      </div>

      <div className="employee-details__card">
        <h3>Leads Added — Last 6 Months</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8a8a92', fontSize: 12.5 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#8a8a92', fontSize: 12.5 }} width={30} />
            <Tooltip cursor={{ fill: 'rgba(100,72,244,0.06)' }} content={<ChartTooltip formatter={(v) => `${v} leads`} />} />
            <Bar dataKey="leads" fill="#6448F4" radius={[6, 6, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="employee-details__card">
        <h3>Assigned Leads</h3>
        {employeeLeads.length > 0 ? (
          <table className="data-table">
            <thead><tr><th>Company</th><th>Status</th><th>Priority</th><th>Action</th></tr></thead>
            <tbody>
              {employeeLeads.map((l) => (
                <tr key={l.id}>
                  <td className="data-table__primary">{l.company}</td>
                  <td className="data-table__muted">{l.status}</td>
                  <td className="data-table__muted">{l.priority}</td>
                  <td><Link to={`/leads/${l.id}`} className="data-table__link">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="employee-details__empty">No leads assigned yet.</p>}
      </div>
    </div>
  )
}

export default EmployeeDetails
