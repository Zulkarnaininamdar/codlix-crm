import KpiCard from '../../components/dashboard/KpiCard.jsx'
import ChartCard from '../../components/dashboard/ChartCard.jsx'
import FollowerGrowthChart from '../../components/social/FollowerGrowthChart.jsx'
import EngagementChart from '../../components/social/EngagementChart.jsx'
import { useApi } from '../../hooks/useApi.js'
import { InstagramIcon, AnalyticsIcon, HeartIcon, GlobeIcon } from '../../components/icons/Icons.jsx'

function SocialOverview() {
  const { data, error, loading } = useApi('/social/analytics')

  if (loading && !data) return <p className="social-page__empty">Loading analytics…</p>
  if (error) return <p className="social-page__empty">Could not load analytics. {error.message}</p>

  const kpis = [
    { label: 'Followers', value: data.followers.toLocaleString(), icon: InstagramIcon, trend: data.followersTrend },
    { label: 'Engagement Rate', value: `${data.engagementRate}%`, icon: AnalyticsIcon, trend: data.engagementTrend },
    { label: 'Avg Likes / Post', value: data.avgLikes.toLocaleString(), icon: HeartIcon, trend: data.avgLikesTrend },
    { label: 'Reach (30 days)', value: data.reach.toLocaleString(), icon: GlobeIcon, trend: data.reachTrend },
  ]
  const hasHistory = data.followerHistory.length > 1
  const hasEngagement = data.engagementBySource.length > 0

  return (
    <div className="social-page__section">
      <div className="social-page__kpis">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="social-page__chart-grid">
        <ChartCard title="Follower Growth" subtitle="Daily, last 30 days">
          {hasHistory ? (
            <FollowerGrowthChart history={data.followerHistory} />
          ) : (
            <p className="social-page__empty">Follower history appears after a few daily syncs.</p>
          )}
        </ChartCard>
        <ChartCard title="Engagement by Format" subtitle="Likes & comments on recent posts">
          {hasEngagement ? (
            <EngagementChart data={data.engagementBySource} />
          ) : (
            <p className="social-page__empty">No published posts synced yet.</p>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

export default SocialOverview
