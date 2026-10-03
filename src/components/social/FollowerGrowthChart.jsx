import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from '../dashboard/ChartTooltip.jsx'

function FollowerGrowthChart({ history }) {
  const data = history.map((point) => ({
    label: new Date(point.day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    followers: point.followers,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={{ fill: '#8a8a92', fontSize: 12.5 }}
        />
        <YAxis
          domain={['dataMin - 50', 'dataMax + 50']}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#8a8a92', fontSize: 12.5 }}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
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
