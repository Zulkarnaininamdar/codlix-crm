import './KpiCard.css'

function KpiCard({ label, value, icon: Icon, trend, accent = '#6448f4', onClick, active }) {
  const positive = trend >= 0
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`kpi-card${onClick ? ' kpi-card--clickable' : ''}${active ? ' is-active' : ''}`}
      style={{ '--kpi-accent': accent }}
      onClick={onClick}
      aria-pressed={onClick ? Boolean(active) : undefined}
    >
      <div className="kpi-card__head">
        <div className="kpi-card__icon">
          <Icon />
        </div>
        <span className="kpi-card__label" title={label}>{label}</span>
      </div>

      <p className="kpi-card__value">{value}</p>

      {typeof trend === 'number' && (
        <span className={`kpi-card__trend${positive ? ' is-up' : ' is-down'}`}>
          {positive ? '+' : '-'}{Math.abs(trend)}%
        </span>
      )}
    </Tag>
  )
}

export default KpiCard
