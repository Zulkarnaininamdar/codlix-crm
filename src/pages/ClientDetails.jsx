import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/common/Tabs.jsx'
import Badge from '../components/common/Badge.jsx'
import Drawer from '../components/common/Drawer.jsx'
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
  BudgetIcon,
  CalendarIcon,
  ProjectsIcon,
  PlusIcon,
  ProposalsIcon,
  FlagIcon,
  FolderIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import './CompanyDetails.css'
import './ClientDetails.css'

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'projects', label: 'Projects' },
  { value: 'proposals', label: 'Proposals' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'activities', label: 'Activities' },
  { value: 'documents', label: 'Documents' },
]

const CLIENT_STATUSES = ['Active', 'Inactive']
const PROJECT_STATUSES = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']
const CLOSED_PROJECT_STATUSES = ['Completed', 'Cancelled']

// `company` is not editable here: projects are linked to the client by company name.
const CLIENT_FIELDS = [
  { key: 'owner', label: 'Account Owner', type: 'owner' },
  { key: 'since', label: 'Client Since', type: 'date' },
  { key: 'revenue', label: 'Lifetime Revenue', placeholder: 'e.g. ₹11.8L' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'contactName', label: 'Contact Person' },
  { key: 'designation', label: 'Designation' },
  { key: 'email', label: 'Email', inputType: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'industry', label: 'Industry' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'address', label: 'Address', full: true },
  { key: 'website', label: 'Website' },
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function ClientDetails() {
  const { id } = useParams()
  const { employees } = useLeads()
  const { items: clients, update: updateClient } = useCrm('clients')
  const { items: companies } = useCrm('companies')
  const { items: projects, create: createProject, update: updateProject } = useCrm('projects')
  const { items: proposals } = useCrm('proposals')
  const { items: contacts } = useCrm('contacts')
  const [tab, setTab] = useState('overview')
  const [clientDrawerOpen, setClientDrawerOpen] = useState(false)
  const [clientForm, setClientForm] = useState({})
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [projectForm, setProjectForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [actionError, setActionError] = useState('')
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
  const runningProjects = clientProjects.filter((p) => !CLOSED_PROJECT_STATUSES.includes(p.status))
  const clientProposals = proposals.filter((p) => p.company === client.company)
  const clientContacts = contacts.filter((c) => c.companyId === companyRecord?.id)
  const primaryContact = clientContacts[0]

  function openEditClient() {
    setClientForm(Object.fromEntries(CLIENT_FIELDS.map((f) => [f.key, client[f.key] ?? ''])))
    setFormError('')
    setClientDrawerOpen(true)
  }

  async function saveClient(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await updateClient(client.id, clientForm)
      setClientDrawerOpen(false)
    } catch (err) {
      setFormError(err.message || 'Could not save the client.')
    } finally {
      setSaving(false)
    }
  }

  function openAddProject() {
    setEditingProjectId(null)
    setProjectForm({ name: '', manager: '', startDate: todayISO(), endDate: '', progress: 0, amount: '', status: 'Active' })
    setFormError('')
    setProjectDrawerOpen(true)
  }

  function openEditProject(p) {
    setEditingProjectId(p.id)
    setProjectForm({
      name: p.name ?? '',
      manager: p.manager ?? '',
      startDate: p.startDate ?? '',
      endDate: p.endDate ?? '',
      progress: p.progress ?? 0,
      amount: p.amount ?? '',
      status: p.status ?? 'Active',
    })
    setFormError('')
    setProjectDrawerOpen(true)
  }

  async function saveProject(e) {
    e.preventDefault()
    if (!projectForm.name.trim()) return setFormError('Project name is required.')
    if (!projectForm.manager) return setFormError('Select a project manager.')
    const body = {
      ...projectForm,
      name: projectForm.name.trim(),
      progress: Math.min(100, Math.max(0, Number(projectForm.progress) || 0)),
    }
    setSaving(true)
    setFormError('')
    try {
      if (editingProjectId) await updateProject(editingProjectId, body)
      else await createProject({ ...body, client: client.company })
      setProjectDrawerOpen(false)
    } catch (err) {
      setFormError(err.message || 'Could not save the project.')
    } finally {
      setSaving(false)
    }
  }

  async function changeProjectStatus(p, status) {
    setActionError('')
    try {
      await updateProject(p.id, { status })
    } catch (err) {
      setActionError(err.message || 'Could not update the project status.')
    }
  }

  function renderClientField(f) {
    return (
      <div className={`field${f.full ? ' field--full' : ''}`} key={f.key}>
        <label>{f.label}</label>
        {f.type === 'owner' ? (
          <select value={clientForm.owner} onChange={(e) => setClientForm((prev) => ({ ...prev, owner: e.target.value }))}>
            <option value="">Select owner</option>
            {employees.map((emp) => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
          </select>
        ) : f.type === 'status' ? (
          <select value={clientForm.status} onChange={(e) => setClientForm((prev) => ({ ...prev, status: e.target.value }))}>
            {CLIENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <input
            type={f.type === 'date' ? 'date' : f.inputType ?? 'text'}
            value={clientForm[f.key] ?? ''}
            placeholder={f.placeholder}
            onChange={(e) => setClientForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
          />
        )}
      </div>
    )
  }

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

        <div className="company-details__quick-actions">
          <div className="company-details__action-row">
            <button type="button" className="btn btn--primary btn--sm" onClick={openEditClient}>
              Edit Client
            </button>
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
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <section className="company-details__card">
            {tab === 'overview' && (
              <div className="info-grid">
                <div className="info-block">
                  <h4>Account Information</h4>
                  <ul>
                    <li><CalendarIcon /> Client since {client.since}</li>
                    <li><UserIcon /> Managed by {client.owner}</li>
                    {(client.city || companyRecord?.country) && (
                      <li><MapPinIcon /> {[client.city, client.country || companyRecord?.country].filter(Boolean).join(', ')}</li>
                    )}
                  </ul>
                </div>
                <div className="info-block">
                  <h4>Status &amp; Revenue</h4>
                  <ul>
                    <li><FlagIcon /> {client.status}</li>
                    <li><BudgetIcon /> {client.revenue || '—'} lifetime revenue</li>
                    {(client.industry || companyRecord?.industry) && (
                      <li><BuildingIcon /> {client.industry || companyRecord.industry}</li>
                    )}
                  </ul>
                </div>

                <div className="info-tiles field--full">
                  <div className="info-tile">
                    <span className="info-tile__label"><ProjectsIcon /> Total Projects</span>
                    <span className="info-tile__value">{clientProjects.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><ProjectsIcon /> Running Projects</span>
                    <span className="info-tile__value">{runningProjects.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><ProposalsIcon /> Proposals Sent</span>
                    <span className="info-tile__value">{clientProposals.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><BudgetIcon /> Lifetime Revenue</span>
                    <span className="info-tile__value">{client.revenue || '—'}</span>
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
              <>
                <div className="client-section-head">
                  <p className="client-section-head__count">
                    {clientProjects.length} project{clientProjects.length === 1 ? '' : 's'} · {runningProjects.length} running
                  </p>
                  <button type="button" className="btn btn--primary btn--sm" onClick={openAddProject}>
                    <PlusIcon /> Add Project
                  </button>
                </div>
                {actionError && <p className="field__error">{actionError}</p>}
                {clientProjects.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Manager</th>
                        <th>End Date</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {clientProjects.map((p) => (
                        <tr key={p.id}>
                          <td><Link to={`/projects/${p.id}`} className="data-table__link">{p.name}</Link></td>
                          <td className="data-table__muted">{p.manager}</td>
                          <td className="data-table__muted">{p.endDate || '—'}</td>
                          <td className="data-table__muted">{p.progress ?? 0}%</td>
                          <td>
                            <div className="client-status-cell">
                              <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                              <select
                                className="client-status-select"
                                value={p.status}
                                onChange={(e) => changeProjectStatus(p, e.target.value)}
                                aria-label={`Change status of ${p.name}`}
                              >
                                {[...new Set([p.status, ...PROJECT_STATUSES])].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            <button type="button" className="data-table__link" onClick={() => openEditProject(p)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="company-details__empty">No projects yet. Use Add Project to create one.</p>}
              </>
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
                  <span className="info-tile__value">{client.revenue || '—'}</span>
                </div>
                <div className="info-tile">
                  <span className="info-tile__label"><ProjectsIcon /> Running Projects</span>
                  <span className="info-tile__value">{runningProjects.length}</span>
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
                    <p className="timeline__text">{clientProjects.length} project(s), {runningProjects.length} running.</p>
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
            ) : client.contactName ? (
              <div className="primary-contact-card">
                <div className="data-table__avatar">{initials(client.contactName)}</div>
                <div className="primary-contact-card__body">
                  <p className="data-table__primary">{client.contactName}</p>
                  <p className="data-table__secondary">{client.designation}</p>
                  <ul className="primary-contact-card__meta">
                    {client.phone && <li><PhoneIcon /> {client.phone}</li>}
                    {client.email && <li><MailIcon /> {client.email}</li>}
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
              {(client.industry || companyRecord) && (
                <li>
                  <span className="kv-label"><BuildingIcon /> Industry</span>
                  <p>{client.industry || companyRecord.industry}</p>
                </li>
              )}
              <li>
                <span className="kv-label"><BudgetIcon /> Lifetime Revenue</span>
                <p>{client.revenue || '—'}</p>
              </li>
              <li>
                <span className="kv-label"><ProjectsIcon /> Running Projects</span>
                <p>{runningProjects.length}</p>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <Drawer
        open={clientDrawerOpen}
        onClose={() => setClientDrawerOpen(false)}
        title="Edit Client"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setClientDrawerOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="edit-client-form" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-client-form" onSubmit={saveClient} noValidate>
          <div className="field">
            <label>Company</label>
            <input value={client.company} disabled />
            <span className="client-form__hint">Company name cannot be changed here.</span>
          </div>
          <div className="form-grid">{CLIENT_FIELDS.map(renderClientField)}</div>
          {formError && <p className="field__error">{formError}</p>}
        </form>
      </Drawer>

      <Drawer
        open={projectDrawerOpen}
        onClose={() => setProjectDrawerOpen(false)}
        title={editingProjectId ? 'Edit Project' : 'Add Project'}
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setProjectDrawerOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="client-project-form" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Saving…' : editingProjectId ? 'Save Changes' : 'Add Project'}
            </button>
          </>
        }
      >
        <form id="client-project-form" onSubmit={saveProject} noValidate>
          <div className="form-grid">
            <div className="field field--full">
              <label>Project Name<span className="required">*</span></label>
              <input value={projectForm.name ?? ''} onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Website Revamp" />
            </div>
            <div className="field field--full">
              <label>Project Manager<span className="required">*</span></label>
              <select value={projectForm.manager ?? ''} onChange={(e) => setProjectForm((prev) => ({ ...prev, manager: e.target.value }))}>
                <option value="">Select manager</option>
                {employees.map((emp) => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={projectForm.status ?? 'Active'} onChange={(e) => setProjectForm((prev) => ({ ...prev, status: e.target.value }))}>
                {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Progress %</label>
              <input type="number" min="0" max="100" value={projectForm.progress ?? 0} onChange={(e) => setProjectForm((prev) => ({ ...prev, progress: e.target.value }))} />
            </div>
            <div className="field">
              <label>Start Date</label>
              <input type="date" value={projectForm.startDate ?? ''} onChange={(e) => setProjectForm((prev) => ({ ...prev, startDate: e.target.value }))} />
            </div>
            <div className="field">
              <label>End Date</label>
              <input type="date" value={projectForm.endDate ?? ''} onChange={(e) => setProjectForm((prev) => ({ ...prev, endDate: e.target.value }))} />
            </div>
            <div className="field field--full">
              <label>Project Amount</label>
              <input value={projectForm.amount ?? ''} onChange={(e) => setProjectForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="e.g. ₹5.2L" />
            </div>
          </div>
          {formError && <p className="field__error">{formError}</p>}
        </form>
      </Drawer>
    </div>
  )
}

export default ClientDetails
