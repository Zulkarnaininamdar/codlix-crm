import KpiCard from '../components/dashboard/KpiCard.jsx'
import ChartCard from '../components/dashboard/ChartCard.jsx'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import LeadPipeline from '../components/dashboard/LeadPipeline.jsx'
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart.jsx'
import MonthlyRevenueChart from '../components/dashboard/MonthlyRevenueChart.jsx'
import RecentLeadsTable from '../components/dashboard/RecentLeadsTable.jsx'
import ActionPanel from '../components/dashboard/ActionPanel.jsx'
import {
  LeadsIcon,
  ContactsIcon,
  FollowupsIcon,
  MeetingsIcon,
  ProposalsIcon,
  SalesIcon,
} from '../components/icons/Icons.jsx'
import './Dashboard.css'

const kpis = [
  { label: 'Total Leads', value: '1,245', icon: LeadsIcon, trend: 12 },
  { label: 'New Leads', value: '85', icon: ContactsIcon, trend: 8 },
  { label: 'Qualified', value: '42', icon: FollowupsIcon, trend: -4 },
  { label: 'Meetings', value: '18', icon: MeetingsIcon, trend: 15 },
  { label: 'Proposals', value: '9', icon: ProposalsIcon, trend: 5 },
  { label: 'Won Deals', value: '4', icon: SalesIcon, trend: -2 },
]

function Dashboard() {
  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard__kpis">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="dashboard-body">
        <div className="dashboard-main">
          <ChartCard title="Lead Pipeline" subtitle="New → Contacted → Qualified → Meeting → Proposal → Won">
            <LeadPipeline />
          </ChartCard>

          <div className="dashboard__chart-grid">
            <ChartCard title="Leads by Source" subtitle="Where this month's leads came from">
              <LeadsBySourceChart />
            </ChartCard>
            <ChartCard title="Monthly Revenue" subtitle="Closed revenue, last 8 months">
              <MonthlyRevenueChart />
            </ChartCard>
          </div>

          <ChartCard title="Recent Leads" subtitle="Latest activity across your pipeline">
            <RecentLeadsTable />
          </ChartCard>
        </div>

        <aside className="dashboard-rail">
          <div className="dashboard-rail__actions-head">
            <h2>Today's Actions</h2>
            <p>Follow-ups, meetings & tasks that need your attention</p>
          </div>
          <ActionPanel />
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
