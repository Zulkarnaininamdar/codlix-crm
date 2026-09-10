import './ChartTooltip.css'

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip__label">{label}</p>}
      {payload.map((entry) => (
        <p className="chart-tooltip__row" key={entry.dataKey}>
          <span className="chart-tooltip__dot" />
          {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

export default ChartTooltip
