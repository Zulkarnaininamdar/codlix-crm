import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/common/Tabs.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { clients, companies, projects, proposals, contactsByCompany } from '../data/mockData.js'
import {
  ArrowLeftIcon,
  BuildingIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  LinkedinIcon,
  BudgetIcon,
  CalendarIcon,
  ProjectsIcon,
  ProposalsIcon,
  FlagIcon,
  FolderIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import './CompanyDetails.css'

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'projects', label: 'Projects' },
  { value: 'proposals', label: 'Proposals' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'activities', label: 'Activities' },
  { value: 'documents', label: 'Documents' },
]

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function ClientDetails() {
  const { id } = useParams()
  const [tab, setTab] = useState('overview')
  const client = clients.find((c) => c.id === id)

  if (!client) {
    return (
      <div className="company-details-page">
        <Link to="/clients" className="back-link"><ArrowLeftIcon /> Back to Clients</Link>
        <p className="company-details__not-found">Client not found.</p>
      </div>
    )
  }

  const companyRecord = companies.find((co) => co.name === client.company)
  const clientProjects = projects.filter((p) => p.client === client.company)
  const clientProposals = proposals.filter((p) => p.company === client.company)
  const clientContacts = contactsByCompany.find((c) => c.company === client.company)?.contacts ?? []
  const primaryContact = clientContacts[0]

  return (
    <div className="company-details-page">
      <Link to="/clients" className="back-link">
        <ArrowLeftIcon /> Back to Clients
      </Link>

      <header className="company-details__header">
        <div className="company-details__heading">
          <span className="company-details__avatar">{initials(client.company)}</span>
          <div>
            <div className="company-details__title-row">
              <h1>{client.company}</h1>
              <Badge tone={statusTone(client.status)}>{client.status}</Badge>
            </div>
            <div className="company-details__meta">
              <span><span className="company-details__meta-label">Client Since</span> {client.since}</span>
              <span><span className="company-details__meta-label">Owner</span> {client.owner}</span>
              <span><span className="company-details__meta-label">Revenue</span> {client.revenue}</span>
              {companyRecord && (
                <span><span className="company-details__meta-label">Industry</span> {companyRecord.industry}</span>
              )}
            </div>
          </div>
        </div>

        {primaryContact && (
          <div className="company-details__quick-actions">
            <div className="company-details__action-row">
              <a href={`tel:${primaryContact.phone}`} className="btn btn--secondary btn--sm">
                <PhoneIcon /> Call
              </a>
              <a href={`mailto:${primaryContact.email}`} className="btn btn--secondary btn--sm">
                <MailIcon /> Email
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="company-details__body">
        <div className="company-details__main">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <section className="company-details__card">
            {tab === 'overview' && (
              <div className="info-grid">
                <div className="info-block">
                  <h4>Account Information</h4>
                  <ul>
                    <li><CalendarIcon /> Client since {client.since}</li>
                    <li><UserIcon /> Managed by {client.owner}</li>
                    {companyRecord && <li><MapPinIcon /> {companyRecord.country}</li>}
                  </ul>
                </div>
                <div className="info-block">
                  <h4>Status &amp; Revenue</h4>
                  <ul>
                    <li><FlagIcon /> {client.status}</li>
                    <li><BudgetIcon /> {client.revenue} lifetime revenue</li>
                    {companyRecord && <li><BuildingIcon /> {companyRecord.industry}</li>}
                  </ul>
                </div>

                <div className="info-tiles field--full">
                  <div className="info-tile">
                    <span className="info-tile__label"><ProjectsIcon /> Projects Running</span>
                    <span className="info-tile__value">{clientProjects.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><ProposalsIcon /> Proposals Sent</span>
                    <span className="info-tile__value">{clientProposals.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><BudgetIcon /> Lifetime Revenue</span>
                    <span className="info-tile__value">{client.revenue}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><CalendarIcon /> Client Since</span>
                    <span className="info-tile__value">{client.since}</span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'contacts' && (
              clientContacts.length > 0 ? (
                <ul className="simple-list">
                  {clientContacts.map((c) => (
                    <li key={c.id}>
                      <div className="data-table__avatar">{initials(c.name)}</div>
                      <div>
                        <p className="data-table__primary">{c.name}</p>
                        <p className="data-table__secondary">{c.designation} · {c.phone}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="company-details__empty">No contacts recorded.</p>
            )}

            {tab === 'projects' && (
              clientProjects.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Project</th><th>Manager</th><th>Progress</th><th>Status</th></tr></thead>
                  <tbody>
                    {clientProjects.map((p) => (
                      <tr key={p.id}>
                        <td><Link to={`/projects/${p.id}`} className="data-table__link">{p.name}</Link></td>
                        <td className="data-table__muted">{p.manager}</td>
                        <td className="data-table__muted">{p.progress}%</td>
                        <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="company-details__empty">No projects yet.</p>
            )}

            {tab === 'proposals' && (
              clientProposals.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Proposal No.</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {clientProposals.map((p) => (
                      <tr key={p.id}>
                        <td><Link to={`/proposals/${p.id}`} className="data-table__link">{p.id}</Link></td>
                        <td className="data-table__muted">{p.service}</td>
                        <td className="data-table__strong">{p.amount}</td>
                        <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="company-details__empty">No proposals yet.</p>
            )}

            {tab === 'revenue' && (
              <div className="info-tiles info-tiles--flush">
                <div className="info-tile">
                  <span className="info-tile__label"><BudgetIcon /> Lifetime Revenue</span>
                  <span className="info-tile__value">{client.revenue}</span>
                </div>
                <div className="info-tile">
                  <span className="info-tile__label"><ProjectsIcon /> Active Projects</span>
                  <span className="info-tile__value">{clientProjects.length}</span>
                </div>
                <div className="info-tile">
                  <span className="info-tile__label"><ProposalsIcon /> Proposals Sent</span>
                  <span className="info-tile__value">{clientProposals.length}</span>
                </div>
                <div className="info-tile">
                  <span className="info-tile__label"><FlagIcon /> Status</span>
                  <span className="info-tile__value">{client.status}</span>
                </div>
              </div>
            )}

            {tab === 'activities' && (
              <ul className="timeline">
                <li className="timeline__item">
                  <span className="timeline__icon timeline__icon--system"><FlagIcon /></span>
                  <div>
                    <p className="timeline__date">Converted</p>
                    <p className="timeline__text">Proposal accepted and converted to client on {client.since}.</p>
                  </div>
                </li>
                <li className="timeline__item">
                  <span className="timeline__icon"><ProjectsIcon /></span>
                  <div>
                    <p className="timeline__date">Projects</p>
                    <p className="timeline__text">{clientProjects.length} project(s) currently running.</p>
                  </div>
                </li>
                <li className="timeline__item">
                  <span className="timeline__icon"><ProposalsIcon /></span>
                  <div>
                    <p className="timeline__date">Proposals</p>
                    <p className="timeline__text">{clientProposals.length} proposal(s) sent to date.</p>
                  </div>
                </li>
              </ul>
            )}

            {tab === 'documents' && (
              <p className="company-details__empty">
                <FolderIcon style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle' }} />
                No documents uploaded yet.
              </p>
            )}
          </section>
        </div>

        <aside className="company-details__rail">
          <section className="company-details__card">
            <h3>Primary Contact</h3>
            {primaryContact ? (
              <div className="primary-contact-card">
                <div className="data-table__avatar">{initials(primaryContact.name)}</div>
                <div className="primary-contact-card__body">
                  <p className="data-table__primary">{primaryContact.name}</p>
                  <p className="data-table__secondary">{primaryContact.designation}</p>
                  <ul className="primary-contact-card__meta">
                    <li><PhoneIcon /> {primaryContact.phone}</li>
                    <li><MailIcon /> {primaryContact.email}</li>
                    {primaryContact.linkedin && <li><LinkedinIcon /> {primaryContact.linkedin}</li>}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="company-details__empty">No primary contact on file yet.</p>
            )}
          </section>

          <section className="company-details__card">
            <h3>Client Snapshot</h3>
            <ul className="kv-list">
              <li>
                <span className="kv-label"><FlagIcon /> Status</span>
                <p>{client.status}</p>
              </li>
              <li>
                <span className="kv-label"><UserIcon /> Owner</span>
                <p>{client.owner}</p>
              </li>
              <li>
                <span className="kv-label"><CalendarIcon /> Client Since</span>
                <p>{client.since}</p>
              </li>
              {companyRecord && (
                <li>
                  <span className="kv-label"><BuildingIcon /> Industry</span>
                  <p>{companyRecord.industry}</p>
                </li>
              )}
              <li>
                <span className="kv-label"><BudgetIcon /> Lifetime Revenue</span>
                <p>{client.revenue}</p>
              </li>
              <li>
                <span className="kv-label"><ProjectsIcon /> Active Projects</span>
                <p>{clientProjects.length}</p>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default ClientDetails
