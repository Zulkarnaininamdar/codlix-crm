import './RecentLeadsTable.css'

const rows = [
  { name: 'Aarav Shah', company: 'TechNova Pvt Ltd', source: 'LinkedIn', value: '₹2.4L', stage: 'Qualified', date: 'Today' },
  { name: 'Meera Nair', company: 'Orbit Systems', source: 'Website', value: '₹1.1L', stage: 'New', date: 'Today' },
  { name: 'Kabir Malhotra', company: 'Zenith Retail', source: 'Referral', value: '₹3.8L', stage: 'Proposal', date: 'Yesterday' },
  { name: 'Sneha Kulkarni', company: 'Nexa Ltd', source: 'Cold Email', value: '₹90K', stage: 'Contacted', date: 'Yesterday' },
  { name: 'Vikram Rao', company: 'Vertex Solutions', source: 'WhatsApp', value: '₹5.2L', stage: 'Won', date: '2 days ago' },
]

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function RecentLeadsTable() {
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
            <tr key={row.name}>
              <td>
                <div className="recent-leads__who">
                  <span className="recent-leads__avatar">{initials(row.name)}</span>
                  <div>
                    <p className="recent-leads__name">{row.name}</p>
                    <p className="recent-leads__company">{row.company}</p>
                  </div>
                </div>
              </td>
              <td className="recent-leads__muted">{row.source}</td>
              <td className="recent-leads__value">{row.value}</td>
              <td>
                <span className={`recent-leads__stage recent-leads__stage--${row.stage.toLowerCase()}`}>
                  {row.stage}
                </span>
              </td>
              <td className="recent-leads__muted">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentLeadsTable
