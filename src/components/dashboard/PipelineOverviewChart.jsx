import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip.jsx'
import ChartEmpty from './ChartEmpty.jsx'

const palette = ['#4F8FEA', '#9B6DF0', '#3DC9A0', '#F2B705', '#F2994A', '#34C77A', '#F2555A']

/** `data` is [{ stage, value }] where value is a lead count for that stage. */
function PipelineOverviewChart({ data }) {
  if (data.every((d) => d.value === 0)) return <ChartEmpty>No leads to chart yet.</ChartEmpty>

  const colored = data.map((d, i) => ({ ...d, color: palette[i % palette.length] }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={colored} margin={{ top: 24, right: 8, bottom: 0, left: -20 }}>
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#8a8a92', fontSize: 12 }}
        />
        <YAxis hide />
        <Tooltip cursor={{ fill: 'rgba(100,72,244,0.06)' }} content={<ChartTooltip formatter={(v) => `${v} leads`} />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={34}>
          {colored.map((entry) => (
            <Cell key={entry.stage} fill={entry.color} />
          ))}
          <LabelList dataKey="value" position="top" fill="#121214" fontSize={12.5} fontWeight={700} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default PipelineOverviewChart
