import './KpiCard.css'

function KpiCard({ label, value, icon: Icon, trend }) {
  const positive = trend >= 0

  return (
    <div className="kpi-card">
      <div className="kpi-card__icon">
        <Icon />
      </div>

      <div className="kpi-card__row">
        <div>
          <span className="kpi-card__label">{label}</span>
          <p className="kpi-card__value">{value}</p>
        </div>
        {typeof trend === 'number' && (
          <span className={`kpi-card__trend${positive ? ' is-up' : ' is-down'}`}>
            {positive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}

export default KpiCard
