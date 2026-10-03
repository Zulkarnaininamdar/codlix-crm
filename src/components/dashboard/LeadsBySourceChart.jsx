import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ChartTooltip from './ChartTooltip.jsx'
import ChartEmpty from './ChartEmpty.jsx'
import './LeadsBySourceChart.css'

const palette = ['#2F6FE4', '#E1306C', '#14A800', '#FF4500', '#25D366', '#8B5CF6', '#9CA3AF']

/** `data` is [{ label, value }] where value is a lead count per source. */
function LeadsBySourceChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) return <ChartEmpty>No leads with a source yet.</ChartEmpty>

  const sourceData = data.map((d, i) => ({
    label: d.label,
    value: Math.round((d.value / total) * 1000) / 10,
    count: d.value,
    color: palette[i % palette.length],
  }))

  return (
    <div className="leads-source">
      <div className="leads-source__chart">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={sourceData}
              dataKey="value"
              nameKey="label"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="none"
            >
              {sourceData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="leads-source__center">
          <span className="leads-source__total">{total.toLocaleString()}</span>
          <span className="leads-source__total-label">Total Leads</span>
        </div>
      </div>

      <ul className="leads-source__legend">
        {sourceData.map((entry) => (
          <li key={entry.label}>
            <span className="leads-source__dot" style={{ background: entry.color }} />
            <span className="leads-source__label">{entry.label}</span>
            <span className="leads-source__value">{entry.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LeadsBySourceChart
