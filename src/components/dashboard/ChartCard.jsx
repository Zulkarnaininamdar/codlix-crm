import './ChartCard.css'

function ChartCard({ title, subtitle, className = '', children }) {
  return (
    <section className={`chart-card ${className}`.trim()}>
      <header className="chart-card__head">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </header>
      <div className="chart-card__body">{children}</div>
    </section>
  )
}

export default ChartCard
