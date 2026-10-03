import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip.jsx'
import ChartEmpty from './ChartEmpty.jsx'

/** `data` is [{ month, revenue }] with revenue in lakhs. Empty until deal values are recorded. */
function MonthlyRevenueChart({ data }) {
  if (!data || data.length === 0) {
    return <ChartEmpty>Revenue will appear here once won deals have values recorded.</ChartEmpty>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#8a8a92', fontSize: 12.5 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#8a8a92', fontSize: 12.5 }}
          tickFormatter={(v) => `${v}L`}
          width={40}
        />
        <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L revenue`} />} cursor={{ stroke: '#ececef' }} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#6448F4"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#6448F4' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MonthlyRevenueChart
