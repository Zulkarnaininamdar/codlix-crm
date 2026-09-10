import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip.jsx'

const data = [
  { month: 'Jan', revenue: 8.2 },
  { month: 'Feb', revenue: 9.1 },
  { month: 'Mar', revenue: 8.7 },
  { month: 'Apr', revenue: 10.4 },
  { month: 'May', revenue: 11.8 },
  { month: 'Jun', revenue: 11.2 },
  { month: 'Jul', revenue: 13.5 },
  { month: 'Aug', revenue: 14.9 },
]

function MonthlyRevenueChart() {
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
