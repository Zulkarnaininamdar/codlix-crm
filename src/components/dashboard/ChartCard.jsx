import './ChartCard.css'

function ChartCard({ title, subtitle, actions, className = '', children }) {
  return (
    <section className={`chart-card ${className}`.trim()}>
      <header className="chart-card__head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="chart-card__actions">{actions}</div>}
      </header>
      <div className="chart-card__body">{children}</div>
    </section>
  )
}

export default ChartCard
