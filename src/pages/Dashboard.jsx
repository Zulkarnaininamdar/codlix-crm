import { useMemo, useState } from 'react'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import ChartCard from '../components/dashboard/ChartCard.jsx'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import LeadPipeline from '../components/dashboard/LeadPipeline.jsx'
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart.jsx'
import PipelineOverviewChart from '../components/dashboard/PipelineOverviewChart.jsx'
import RecentLeadsTable from '../components/dashboard/RecentLeadsTable.jsx'
import ConvertToClientDrawer from '../components/crm/ConvertToClientDrawer.jsx'
import { useLeads } from '../context/LeadsContext.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { pipelineStages } from '../data/pipeline.js'
import { useCrm } from '../hooks/useCrm.js'
import {
  LeadsIcon,
  ContactsIcon,
  FollowupsIcon,
  MeetingsIcon,
  ProposalsIcon,
  SalesIcon,
  ChevronDownIcon,
} from '../components/icons/Icons.jsx'
import './Dashboard.css'

function countBy(items, pick) {
  return items.reduce((acc, item) => {
    const key = pick(item)
    if (key) acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function Dashboard() {
  const { leads, refresh } = useLeads()
  const { user } = useAuth()
  const isManager = user?.role === 'sales-manager'
  const [convertTarget, setConvertTarget] = useState(null)
  const { items: meetings } = useCrm('meetings')
  const { items: proposals } = useCrm('proposals')

  const statusCounts = useMemo(() => countBy(leads, (l) => l.status), [leads])
  const sourceCounts = useMemo(() => countBy(leads, (l) => l.source), [leads])
  const count = (status) => statusCounts[status] ?? 0

  const kpis = [
    { label: 'Total Leads', value: leads.length, icon: LeadsIcon, accent: '#2a78d6' },
    { label: 'New Leads', value: count('New'), icon: ContactsIcon, accent: '#eb6834' },
    { label: 'Qualified', value: count('Qualified'), icon: FollowupsIcon, accent: '#1baf7a' },
    { label: 'Meetings', value: meetings.length, icon: MeetingsIcon, accent: '#eda100' },
    { label: 'Proposals', value: proposals.length, icon: ProposalsIcon, accent: '#e87ba4' },
    { label: 'Won Deals', value: count('Won'), icon: SalesIcon, accent: '#008300' },
  ]

  const pipelineFunnel = pipelineStages.map((stage) => ({ label: stage, value: count(stage) }))
  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))
  const pipelineOverview = [...pipelineStages, 'Lost'].map((stage) => ({ stage, value: count(stage) }))

  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard__kpis">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="dashboard-main">
        <ChartCard title="Lead Pipeline" subtitle={pipelineStages.join(' → ')}>
          <LeadPipeline stages={pipelineFunnel} />
        </ChartCard>

        <div className="dashboard__chart-grid">
          <ChartCard title="Leads by Source">
            <LeadsBySourceChart data={sourceData} />
          </ChartCard>
          <ChartCard
            title="Pipeline Overview"
            actions={(
              <span className="chart-card__select">
                All Leads <ChevronDownIcon />
              </span>
            )}
          >
            <PipelineOverviewChart data={pipelineOverview} />
          </ChartCard>
        </div>

        <ChartCard title="Recent Leads" subtitle="Latest activity across your pipeline">
          <RecentLeadsTable leads={leads} onConvert={isManager ? setConvertTarget : undefined} />
        </ChartCard>
      </div>
      {convertTarget && (
        <ConvertToClientDrawer
          key={convertTarget.id}
          lead={convertTarget}
          open
          onClose={() => setConvertTarget(null)}
          onConverted={() => refresh()}
        />
      )}
    </div>
  )
}

export default Dashboard
