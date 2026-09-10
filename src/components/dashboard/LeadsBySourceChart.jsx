import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip.jsx'

const data = [
  { source: 'LinkedIn', value: 132 },
  { source: 'Cold Email', value: 98 },
  { source: 'Referral', value: 76 },
  { source: 'Website', value: 54 },
  { source: 'WhatsApp', value: 31 },
]

function LeadsBySourceChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="source"
          width={92}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#5b5b63', fontSize: 12.5 }}
        />
        <Tooltip cursor={{ fill: 'rgba(100,72,244,0.06)' }} content={<ChartTooltip formatter={(v) => `${v} leads`} />} />
        <Bar dataKey="value" fill="#6448F4" radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default LeadsBySourceChart
