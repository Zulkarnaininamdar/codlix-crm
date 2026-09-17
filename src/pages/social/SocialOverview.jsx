import KpiCard from '../../components/dashboard/KpiCard.jsx'
import ChartCard from '../../components/dashboard/ChartCard.jsx'
import FollowerGrowthChart from '../../components/social/FollowerGrowthChart.jsx'
import EngagementChart from '../../components/social/EngagementChart.jsx'
import { instagramAnalytics } from '../../data/socialMediaData.js'
import { InstagramIcon, AnalyticsIcon, HeartIcon, GlobeIcon } from '../../components/icons/Icons.jsx'

const kpis = [
  { label: 'Followers', value: instagramAnalytics.followers.toLocaleString(), icon: InstagramIcon, trend: instagramAnalytics.followersTrend },
  { label: 'Engagement Rate', value: `${instagramAnalytics.engagementRate}%`, icon: AnalyticsIcon, trend: instagramAnalytics.engagementTrend },
  { label: 'Avg Likes / Post', value: instagramAnalytics.avgLikes.toLocaleString(), icon: HeartIcon, trend: instagramAnalytics.avgLikesTrend },
  { label: 'Reach', value: instagramAnalytics.reach.toLocaleString(), icon: GlobeIcon, trend: instagramAnalytics.reachTrend },
]

function SocialOverview() {
  return (
    <div className="social-page__section">
      <div className="social-page__kpis">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="social-page__chart-grid">
        <ChartCard title="Follower Growth" subtitle="Last 8 weeks">
          <FollowerGrowthChart />
        </ChartCard>
        <ChartCard title="Engagement by Format" subtitle="Likes & comments, last 30 days">
          <EngagementChart />
        </ChartCard>
      </div>
    </div>
  )
}

export default SocialOverview
