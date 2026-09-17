import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from '../dashboard/ChartTooltip.jsx'
import { instagramAnalytics } from '../../data/socialMediaData.js'

function FollowerGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={instagramAnalytics.followerGrowth} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#8a8a92', fontSize: 12.5 }}
        />
        <YAxis
          domain={['dataMin - 400', 'dataMax + 400']}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#8a8a92', fontSize: 12.5 }}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          width={48}
        />
        <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} followers`} />} cursor={{ stroke: '#ececef' }} />
        <Line
          type="monotone"
          dataKey="followers"
          stroke="#dd2a7b"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#dd2a7b' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default FollowerGrowthChart
