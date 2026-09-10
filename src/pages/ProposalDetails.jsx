import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { proposals } from '../data/mockData.js'
import { ArrowLeftIcon, SendIcon } from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import './ProposalDetails.css'

const statusOptions = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired']

function currency(n) {
  return `₹${n.toLocaleString('en-IN')}`
}

function ProposalDetails() {
  const { id } = useParams()
  const proposal = proposals.find((p) => p.id === id)
  const [status, setStatus] = useState(proposal?.status)
  const availableStatuses = statusOptions.includes(status) ? statusOptions : [status, ...statusOptions]

  if (!proposal) {
    return (
      <div className="proposal-details-page">
        <Link to="/proposals" className="back-link"><ArrowLeftIcon /> Back to Proposals</Link>
        <p className="proposal-details__empty">Proposal not found.</p>
      </div>
    )
  }

  const rows = proposal.items.map((item) => {
    const subtotal = item.qty * item.price
    const afterDiscount = subtotal - subtotal * (item.discount / 100)
    const withTax = afterDiscount + afterDiscount * (item.tax / 100)
    return { ...item, subtotal, afterDiscount, withTax }
  })
  const grandTotal = rows.reduce((sum, r) => sum + r.withTax, 0)

  return (
    <div className="proposal-details-page">
      <Link to="/proposals" className="back-link"><ArrowLeftIcon /> Back to Proposals</Link>

      <header className="proposal-details__header">
        <div>
          <h1>Proposal #{proposal.id}</h1>
          <p>{proposal.company} — {proposal.service}</p>
        </div>
        <div className="proposal-details__status">
          <Badge tone={statusTone(status)}>{status}</Badge>
          <select
            className="proposal-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Change proposal status"
          >
            {availableStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="proposal-details__card">
        <div className="proposal-details__meta">
          <div><span className="kv-label">Client</span><p>{proposal.company}</p></div>
          <div><span className="kv-label">Created By</span><p>{proposal.createdBy}</p></div>
          <div><span className="kv-label">Date</span><p>{proposal.date}</p></div>
        </div>

        <h3 className="proposal-details__section-title">Services</h3>
        <div className="data-table-wrap__scroll">
          <table className="data-table proposal-line-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.service}>
                  <td className="data-table__primary">{row.service}</td>
                  <td className="data-table__muted">{row.qty}</td>
                  <td className="data-table__muted">{currency(row.price)}</td>
                  <td className="data-table__muted">{row.discount}%</td>
                  <td className="data-table__muted">{row.tax}%</td>
                  <td className="data-table__strong">{currency(Math.round(row.withTax))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="proposal-details__total">
          <span>Grand Total</span>
          <strong>{currency(Math.round(grandTotal))}</strong>
        </div>

        {(status === 'Accepted' || status === 'Draft') && (
          <div className="proposal-details__actions">
            {status === 'Accepted' ? (
              <Link to="/clients" className="btn btn--dark">Convert to Client</Link>
            ) : (
              <button className="btn btn--primary" onClick={() => setStatus('Sent')}>
                <SendIcon /> Send Proposal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalDetails
