import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from '../dashboard/ChartTooltip.jsx'
import { instagramAnalytics } from '../../data/socialMediaData.js'

function EngagementChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={instagramAnalytics.engagementBySource} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="source"
          width={92}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#5b5b63', fontSize: 12.5 }}
        />
        <Tooltip cursor={{ fill: 'rgba(221,42,123,0.06)' }} content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} engagements`} />} />
        <Bar dataKey="value" fill="#dd2a7b" radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default EngagementChart
