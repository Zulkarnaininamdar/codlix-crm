import './DashboardHeader.css'

function DashboardHeader() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="dashboard-header">
      <div>
        <p>{today} — here's what's happening with your pipeline.</p>
      </div>
    </div>
  )
}

export default DashboardHeader
