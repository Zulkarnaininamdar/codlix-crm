import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import TableFooter from '../components/common/TableFooter.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import '../components/common/PageHeader.css'
import '../components/common/DataTable.css'

const PAGE_SIZE = 8

function Companies() {
  const { items: companies } = useCrm('companies')
  const [page, setPage] = useState(1)
  const pageRows = companies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="companies-page">
      <PageHeader title="Companies" subtitle="Every organization you're doing business with" />

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>All Companies</h3>
            <span>{companies.length} total</span>
          </div>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Country</th>
                <th className="is-num">Contacts</th>
                <th className="is-num">Active Leads</th>
                <th>Client Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/companies/${c.id}`} className="data-table__link">{c.name}</Link>
                  </td>
                  <td className="data-table__muted">{c.industry}</td>
                  <td className="data-table__muted">{c.country}</td>
                  <td className="data-table__muted is-num">{c.contacts}</td>
                  <td className="data-table__muted is-num">{c.activeLeads}</td>
                  <td><Badge tone={statusTone(c.clientStatus === 'Client' ? 'won' : 'new')}>{c.clientStatus}</Badge></td>
                  <td className="data-table__muted">{c.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter page={page} pageSize={PAGE_SIZE} total={companies.length} onPageChange={setPage} />
      </div>
    </div>
  )
}

export default Companies
