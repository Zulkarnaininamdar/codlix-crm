import ChartEmpty from './ChartEmpty.jsx'
import './RecentLeadsTable.css'

function initials(name) {
  return (name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function dayLabel(isoDate) {
  if (!isoDate) return ''
  const today = new Date()
  const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  const date = new Date(`${isoDate}T00:00:00`)
  if (key(date) === key(today)) return 'Today'
  if (key(date) === key(yesterday)) return 'Yesterday'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/** Newest leads first. `leads` comes from the API already sorted by creation date. */
function RecentLeadsTable({ leads, onConvert }) {
  const rows = leads.slice(0, 5)
  if (rows.length === 0) return <ChartEmpty>No leads yet. New leads will appear here.</ChartEmpty>

  return (
    <div className="recent-leads">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Source</th>
            <th>Value</th>
            <th>Stage</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="recent-leads__who">
                  <span className="recent-leads__avatar">{initials(row.contactName || row.company)}</span>
                  <div>
                    <p className="recent-leads__name">{row.contactName || row.company}</p>
                    <p className="recent-leads__company">{row.company}</p>
                  </div>
                </div>
              </td>
              <td className="recent-leads__muted">{row.source || '—'}</td>
              <td className="recent-leads__value">{row.budget || '—'}</td>
              <td>
                <span className={`recent-leads__stage recent-leads__stage--${(row.status || '').toLowerCase()}`}>
                  {row.status}
                </span>
                {row.status === 'Won' && !row.convertedClientId && onConvert && (
                  <button type="button" className="btn btn--primary btn--sm recent-leads__convert" onClick={() => onConvert(row)}>
                    Convert to Client
                  </button>
                )}
              </td>
              <td className="recent-leads__muted">{dayLabel(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentLeadsTable
