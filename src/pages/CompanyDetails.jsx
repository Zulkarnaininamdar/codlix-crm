import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/common/Tabs.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  ArrowLeftIcon,
  BuildingIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  LinkedinIcon,
  ContactsIcon,
  LeadsIcon,
  ProposalsIcon,
  ProjectsIcon,
  FlagIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import './CompanyDetails.css'

const sections = [
  { value: 'info', label: 'Company Information' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'leads', label: 'Leads' },
  { value: 'proposals', label: 'Proposals' },
  { value: 'projects', label: 'Projects' },
  { value: 'activity', label: 'Activity History' },
]

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function CompanyDetails() {
  const { id } = useParams()
  const { leads } = useLeads()
  const { items: companies } = useCrm('companies')
  const { items: companyContacts } = useCrm('contacts', { parentId: id })
  const { items: proposals } = useCrm('proposals')
  const { items: projects } = useCrm('projects')
  const [section, setSection] = useState('info')
  const company = companies.find((c) => c.id === id)

  if (!company) {
    return (
      <div className="company-details-page">
        <Link to="/companies" className="back-link"><ArrowLeftIcon /> Back to Companies</Link>
        <p className="company-details__not-found">Company not found.</p>
      </div>
    )
  }

  const companyLeads = leads.filter((l) => l.company === company.name)
  const companyProposals = proposals.filter((p) => p.company === company.name)
  const companyProjects = projects.filter((p) => p.client === company.name)
  const primaryContact = companyContacts[0]
  const isClient = company.clientStatus === 'Client'

  return (
    <div className="company-details-page">
      <Link to="/companies" className="back-link">
        <ArrowLeftIcon /> Back to Companies
      </Link>

      <header className="company-details__header">
        <div className="company-details__heading">
          <span className="company-details__avatar">{initials(company.name)}</span>
          <div>
            <div className="company-details__title-row">
              <h1>{company.name}</h1>
              <Badge tone={statusTone(isClient ? 'won' : 'new')}>{company.clientStatus}</Badge>
            </div>
            <div className="company-details__meta">
              <span><span className="company-details__meta-label">Industry</span> {company.industry}</span>
              <span><span className="company-details__meta-label">Country</span> {company.country}</span>
              <span><span className="company-details__meta-label">Owner</span> {company.owner}</span>
            </div>
          </div>
        </div>

        <div className="company-details__quick-actions">
          <div className="company-details__action-row">
            {primaryContact && (
              <>
                <a href={`tel:${primaryContact.phone}`} className="btn btn--secondary btn--sm">
                  <PhoneIcon /> Call
                </a>
                <a href={`mailto:${primaryContact.email}`} className="btn btn--secondary btn--sm">
                  <MailIcon /> Email
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="company-details__body">
        <div className="company-details__main">
          <Tabs tabs={sections} active={section} onChange={setSection} />

          <section className="company-details__card">
            {section === 'info' && (
              <div className="info-grid">
                <div className="info-block">
                  <h4>Company Information</h4>
                  <ul>
                    <li><BuildingIcon /> {company.industry}</li>
                    <li><MapPinIcon /> {company.country}</li>
                  </ul>
                </div>
                <div className="info-block">
                  <h4>Ownership &amp; Status</h4>
                  <ul>
                    <li><UserIcon /> {company.owner}</li>
                    <li><FlagIcon /> {company.clientStatus}</li>
                  </ul>
                </div>

                <div className="info-tiles field--full">
                  <div className="info-tile">
                    <span className="info-tile__label"><ContactsIcon /> Total Contacts</span>
                    <span className="info-tile__value">{companyContacts.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><LeadsIcon /> Active Leads</span>
                    <span className="info-tile__value">{companyLeads.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><ProposalsIcon /> Proposals Sent</span>
                    <span className="info-tile__value">{companyProposals.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><ProjectsIcon /> Projects Running</span>
                    <span className="info-tile__value">{companyProjects.length}</span>
                  </div>
                </div>
              </div>
            )}

            {section === 'contacts' && (
              companyContacts.length > 0 ? (
                <ul className="simple-list">
                  {companyContacts.map((c) => (
                    <li key={c.id}>
                      <div className="data-table__avatar">{initials(c.name)}</div>
                      <div>
                        <p className="data-table__primary">{c.name}</p>
                        <p className="data-table__secondary">{c.designation} · {c.phone}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="company-details__empty">No contacts recorded for this company yet.</p>
            )}

            {section === 'leads' && (
              companyLeads.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Contact</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {companyLeads.map((l) => (
                      <tr key={l.id}>
                        <td className="data-table__primary">{l.contactName}</td>
                        <td className="data-table__muted">{l.priority}</td>
                        <td><Badge tone={statusTone(l.status)}>{l.status}</Badge></td>
                        <td><Link to={`/leads/${l.id}`} className="data-table__link">View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="company-details__empty">No leads linked to this company yet.</p>
            )}

            {section === 'proposals' && (
              companyProposals.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Proposal No.</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {companyProposals.map((p) => (
                      <tr key={p.id}>
                        <td><Link to={`/proposals/${p.id}`} className="data-table__link">{p.id}</Link></td>
                        <td className="data-table__muted">{p.service}</td>
                        <td className="data-table__strong">{p.amount}</td>
                        <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="company-details__empty">No proposals sent to this company yet.</p>
            )}

            {section === 'projects' && (
              companyProjects.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Project</th><th>Manager</th><th>Progress</th><th>Status</th></tr></thead>
                  <tbody>
                    {companyProjects.map((p) => (
                      <tr key={p.id}>
                        <td><Link to={`/projects/${p.id}`} className="data-table__link">{p.name}</Link></td>
                        <td className="data-table__muted">{p.manager}</td>
                        <td className="data-table__muted">{p.progress}%</td>
                        <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="company-details__empty">No projects running for this company yet.</p>
            )}

            {section === 'activity' && (
              <ul className="timeline">
                <li className="timeline__item">
                  <span className="timeline__icon timeline__icon--system"><FlagIcon /></span>
                  <div>
                    <p className="timeline__date">Record</p>
                    <p className="timeline__text">Company record created and assigned to {company.owner}.</p>
                  </div>
                </li>
                <li className="timeline__item">
                  <span className="timeline__icon"><LeadsIcon /></span>
                  <div>
                    <p className="timeline__date">Pipeline</p>
                    <p className="timeline__text">{companyLeads.length} active lead(s) currently in the pipeline.</p>
                  </div>
                </li>
                <li className="timeline__item">
                  <span className="timeline__icon"><ProposalsIcon /></span>
                  <div>
                    <p className="timeline__date">Proposals</p>
                    <p className="timeline__text">{companyProposals.length} proposal(s) sent to date.</p>
                  </div>
                </li>
              </ul>
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
            <h3>Company Snapshot</h3>
            <ul className="kv-list">
              <li>
                <span className="kv-label"><FlagIcon /> Client Status</span>
                <p>{company.clientStatus}</p>
              </li>
              <li>
                <span className="kv-label"><UserIcon /> Owner</span>
                <p>{company.owner}</p>
              </li>
              <li>
                <span className="kv-label"><BuildingIcon /> Industry</span>
                <p>{company.industry}</p>
              </li>
              <li>
                <span className="kv-label"><MapPinIcon /> Country</span>
                <p>{company.country}</p>
              </li>
              <li>
                <span className="kv-label"><ContactsIcon /> Total Contacts</span>
                <p>{companyContacts.length}</p>
              </li>
              <li>
                <span className="kv-label"><LeadsIcon /> Active Leads</span>
                <p>{companyLeads.length}</p>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default CompanyDetails
