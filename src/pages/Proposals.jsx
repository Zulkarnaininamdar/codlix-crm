import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import TableFooter from '../components/common/TableFooter.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { proposals } from '../data/mockData.js'
import {
  SearchIcon,
  PlusIcon,
  ProposalsIcon,
  NoteIcon,
  SendIcon,
  CheckCircleIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import './Proposals.css'

const PAGE_SIZE = 8

function amountToNumber(amount) {
  return Number(amount.replace(/[^\d]/g, '')) || 0
}

function Proposals() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const stats = useMemo(
    () => ({
      total: proposals.length,
      draft: proposals.filter((p) => p.status === 'Draft').length,
      sent: proposals.filter((p) => p.status === 'Sent').length,
      accepted: proposals.filter((p) => p.status === 'Accepted').length,
    }),
    []
  )

  const totalValue = useMemo(
    () => proposals.reduce((sum, p) => sum + amountToNumber(p.amount), 0),
    []
  )

  const filteredProposals = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return proposals
    return proposals.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q)
    )
  }, [search])

  function changeSearch(value) {
    setSearch(value)
    setPage(1)
  }

  const pageRows = filteredProposals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="proposals-page">
      <PageHeader title="Proposals" subtitle="Track every quote from draft to acceptance">
        <Link to="/proposals/new" className="btn btn--primary">
          <PlusIcon /> Create Proposal
        </Link>
      </PageHeader>

      <div className="proposals-stats">
        <div className="proposals-stat">
          <span className="proposals-stat__icon"><ProposalsIcon /></span>
          <div>
            <p className="proposals-stat__value">{stats.total}</p>
            <p className="proposals-stat__label">Total Proposals</p>
          </div>
        </div>
        <div className="proposals-stat">
          <span className="proposals-stat__icon"><NoteIcon /></span>
          <div>
            <p className="proposals-stat__value">{stats.draft}</p>
            <p className="proposals-stat__label">Draft</p>
          </div>
        </div>
        <div className="proposals-stat">
          <span className="proposals-stat__icon"><SendIcon /></span>
          <div>
            <p className="proposals-stat__value">{stats.sent}</p>
            <p className="proposals-stat__label">Sent</p>
          </div>
        </div>
        <div className="proposals-stat">
          <span className="proposals-stat__icon"><CheckCircleIcon /></span>
          <div>
            <p className="proposals-stat__value">{stats.accepted}</p>
            <p className="proposals-stat__label">Accepted</p>
          </div>
        </div>
      </div>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>All Proposals</h3>
            <span>{filteredProposals.length} of {proposals.length} · {`₹${totalValue.toLocaleString('en-IN')}`} total value</span>
          </div>
          <div className="proposals-search">
            <SearchIcon className="proposals-search__icon" />
            <input
              type="text"
              placeholder="Search by proposal no., company or service..."
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Proposal No.</th>
                <th>Company</th>
                <th>Service</th>
                <th className="is-num">Amount</th>
                <th>Created By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/proposals/${p.id}`} className="data-table__link">{p.id}</Link></td>
                  <td className="data-table__primary">{p.company}</td>
                  <td className="data-table__muted">{p.service}</td>
                  <td className="data-table__strong is-num">{p.amount}</td>
                  <td className="data-table__muted">{p.createdBy}</td>
                  <td className="data-table__muted">{p.date}</td>
                  <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProposals.length === 0 && (
            <div className="data-table__empty">No proposals match your search.</div>
          )}
        </div>

        {filteredProposals.length > 0 && (
          <TableFooter page={page} pageSize={PAGE_SIZE} total={filteredProposals.length} onPageChange={setPage} />
        )}
      </div>
    </div>
  )
}

export default Proposals
