import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Tabs from '../components/common/Tabs.jsx'
import StageTracker from '../components/common/StageTracker.jsx'
import Drawer from '../components/common/Drawer.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { leads, pipelineStages, employeeName, companies, followUps } from '../data/mockData.js'
import {
  ArrowLeftIcon,
  PhoneIcon,
  MailIcon,
  WhatsappIcon,
  FollowupsIcon,
  MeetingsIcon,
  ProposalsIcon,
  GlobeIcon,
  MapPinIcon,
  LinkedinIcon,
  FlagIcon,
  BuildingIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  PlusIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/StageTracker.css'
import '../components/common/Form.css'
import './LeadDetails.css'

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'followups', label: 'Follow-ups' },
  { value: 'notes', label: 'Notes' },
]

const followupIcons = { Call: PhoneIcon, Email: MailIcon, WhatsApp: WhatsappIcon, Meeting: MeetingsIcon }

const customFollowupTypes = ['Call', 'Email', 'WhatsApp', 'Meeting', 'Other']

const emptyCustomFollowup = { type: 'Call', date: '', time: '', notes: '' }

const emptyContact = { name: '', designation: '', phone: '', email: '', linkedin: '' }

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatFollowupDate(dateISO) {
  if (!dateISO) return 'Today'
  if (dateISO === todayISO()) return 'Today'
  return new Date(dateISO).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function LeadDetails() {
  const { id } = useParams()
  const lead = leads.find((l) => l.id === id)
  const [tab, setTab] = useState('overview')
  const [leadFollowUps, setLeadFollowUps] = useState(() => followUps.filter((f) => f.lead === lead?.company))
  const [noteDraft, setNoteDraft] = useState(lead?.notes ?? '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [dealDetailsOpen, setDealDetailsOpen] = useState(true)
  const [customFollowupOpen, setCustomFollowupOpen] = useState(false)
  const [customFollowup, setCustomFollowup] = useState(emptyCustomFollowup)
  const [extraContacts, setExtraContacts] = useState([])
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false)
  const [contactForm, setContactForm] = useState(emptyContact)

  if (!lead) {
    return (
      <div className="lead-details-page">
        <Link to="/leads" className="btn btn--ghost">
          <ArrowLeftIcon /> Back to Leads
        </Link>
        <p className="lead-details__not-found">Lead #{id} was not found.</p>
      </div>
    )
  }

  const isLost = lead.status === 'Lost'
  const stageIndex = pipelineStages.indexOf(lead.status)
  const whatsappNumber = lead.phone.replace(/[^\d]/g, '')
  const relatedCompany = companies.find((c) => c.name === lead.company)

  function addCustomFollowUp(e) {
    e.preventDefault()
    const isToday = !customFollowup.date || customFollowup.date === todayISO()
    setLeadFollowUps((prev) => [
      {
        id: `f-${lead.id}-${Date.now()}`,
        lead: lead.company,
        employee: employeeName(lead.assignedTo),
        type: customFollowup.type,
        date: formatFollowupDate(customFollowup.date),
        time: customFollowup.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: 'Pending',
        bucket: isToday ? 'today' : 'upcoming',
        notes: customFollowup.notes || `${customFollowup.type} follow-up scheduled.`,
      },
      ...prev,
    ])
    setCustomFollowup(emptyCustomFollowup)
    setCustomFollowupOpen(false)
  }

  function addContact(e) {
    e.preventDefault()
    if (!contactForm.name.trim()) return
    setExtraContacts((prev) => [...prev, { id: `ct-${lead.id}-${Date.now()}`, ...contactForm }])
    setContactForm(emptyContact)
    setContactDrawerOpen(false)
  }

  function completeFollowUp(followupId) {
    setLeadFollowUps((prev) => prev.map((f) => (f.id === followupId ? { ...f, status: 'Done' } : f)))
  }

  function rescheduleFollowUp(followupId) {
    setLeadFollowUps((prev) =>
      prev.map((f) => (f.id === followupId ? { ...f, status: 'Pending', bucket: 'upcoming', date: 'Tomorrow' } : f))
    )
  }

  return (
    <div className="lead-details-page">
      <Link to="/leads" className="back-link">
        <ArrowLeftIcon /> Back to Leads
      </Link>

      <header className="lead-details__header">
        <div className="lead-details__heading">
          <span className="lead-details__avatar">{lead.company.slice(0, 2).toUpperCase()}</span>
          <div>
            <div className="lead-details__title-row">
              <h1>{lead.company}</h1>
              <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
              <Badge tone={statusTone(lead.priority)}>{lead.priority} Priority</Badge>
            </div>
            <div className="lead-details__meta">
              <span><span className="lead-details__meta-label">Owner</span> {employeeName(lead.assignedTo)}</span>
              <span><span className="lead-details__meta-label">Source</span> {lead.source}</span>
              <span><span className="lead-details__meta-label">Created</span> {lead.createdAt}</span>
              <span><span className="lead-details__meta-label">Expected Close</span> {lead.closingDate}</span>
            </div>
          </div>
        </div>

        <div className="lead-details__quick-actions">
          <div className="lead-details__action-row">
            <a href={`tel:${lead.phone}`} className="btn btn--secondary btn--sm">
              <PhoneIcon /> Call
            </a>
            <a href={`mailto:${lead.email}`} className="btn btn--secondary btn--sm">
              <MailIcon /> Email
            </a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="btn btn--secondary btn--sm">
              <WhatsappIcon /> WhatsApp
            </a>
          </div>
          <div className="lead-details__action-row">
            <Link to="/follow-ups" className="btn btn--ghost btn--sm">
              <FollowupsIcon /> Follow-up
            </Link>
            <Link to="/meetings" className="btn btn--ghost btn--sm">
              <MeetingsIcon /> Meeting
            </Link>
            <Link to="/proposals" className="btn btn--ghost btn--sm">
              <ProposalsIcon /> Proposal
            </Link>
          </div>
        </div>
      </header>

      {isLost ? (
        <div className="lead-details__lost-banner">
          <FlagIcon /> This lead was marked as <strong>Lost</strong>
        </div>
      ) : (
        <StageTracker stages={pipelineStages} currentIndex={stageIndex} />
      )}

      <div className="lead-details__body">
        <div className="lead-details__main">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <section className="lead-details__card">
            {tab === 'overview' && (
              <div className="info-grid">
                <div className="info-block">
                  <h4>Company Information</h4>
                  <ul>
                    <li><GlobeIcon /> {lead.website}</li>
                    <li><MapPinIcon /> {lead.city}, {lead.country}</li>
                    <li>{lead.industry}</li>
                  </ul>
                </div>
                <div className="info-block">
                  <div className="info-block__head">
                    <h4>Contact Information</h4>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => setContactDrawerOpen(true)}
                    >
                      <PlusIcon /> Add Contact
                    </button>
                  </div>
                  <ul>
                    <li>{lead.contactName} — {lead.designation}</li>
                    <li><PhoneIcon /> {lead.phone}</li>
                    <li><MailIcon /> {lead.email}</li>
                    <li><LinkedinIcon /> {lead.linkedin}</li>
                  </ul>

                  {extraContacts.map((c) => (
                    <ul className="info-block__extra-contact" key={c.id}>
                      <li>{c.name}{c.designation ? ` — ${c.designation}` : ''}</li>
                      {c.phone && <li><PhoneIcon /> {c.phone}</li>}
                      {c.email && <li><MailIcon /> {c.email}</li>}
                      {c.linkedin && <li><LinkedinIcon /> {c.linkedin}</li>}
                    </ul>
                  ))}
                </div>

                <div className="info-tiles field--full">
                  <div className="info-tile">
                    <span className="info-tile__label">Service Required</span>
                    <span className="info-tile__value">{lead.service}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label">Lead Source</span>
                    <span className="info-tile__value">{lead.source}</span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'followups' && (
              <>
                <div className="activity-composer">
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => setCustomFollowupOpen(true)}
                  >
                    <PlusIcon /> Add Follow-up
                  </button>
                </div>

                {leadFollowUps.length > 0 ? (
                  <ul className="followup-list">
                    {leadFollowUps.map((f) => {
                      const Icon = followupIcons[f.type] ?? FollowupsIcon
                      return (
                        <li className="followup-item" key={f.id}>
                          <span className="followup-item__icon">
                            <Icon />
                          </span>
                          <div className="followup-item__body">
                            <div className="followup-item__top">
                              <p className="followup-item__type">{f.type}</p>
                              <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                            </div>
                            <p className="followup-item__meta">
                              {f.date} · {f.time} · {f.employee}
                            </p>
                            {f.notes && <p className="followup-item__notes">{f.notes}</p>}
                          </div>
                          {f.status !== 'Done' && (
                            <div className="followup-item__actions">
                              <button className="btn btn--ghost btn--sm" onClick={() => rescheduleFollowUp(f.id)}>
                                Reschedule
                              </button>
                              <button className="btn btn--primary btn--sm" onClick={() => completeFollowUp(f.id)}>
                                Complete
                              </button>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="lead-details__empty">No follow-ups scheduled yet. Use the buttons above to schedule one.</p>
                )}
              </>
            )}

            {tab === 'notes' && (
              <div className="lead-details__notes-tab">
                <textarea
                  value={noteDraft}
                  onChange={(e) => {
                    setNoteDraft(e.target.value)
                    setNoteSaved(false)
                  }}
                  placeholder="Add internal notes about this lead..."
                />
                <div className="lead-details__notes-actions">
                  {noteSaved && <span className="lead-details__notes-saved">Saved</span>}
                  <button className="btn btn--primary btn--sm" onClick={() => setNoteSaved(true)}>Save Note</button>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="lead-details__rail">
          <section className="lead-details__card">
            <button
              type="button"
              className="lead-details__card-toggle"
              onClick={() => setDealDetailsOpen((v) => !v)}
              aria-expanded={dealDetailsOpen}
            >
              <h3>Deal Details</h3>
              <ChevronDownIcon
                className={`lead-details__card-chevron${dealDetailsOpen ? ' is-open' : ''}`}
              />
            </button>
            {dealDetailsOpen && (
              <ul className="kv-list">
                <li>
                  <span className="kv-label"><UserIcon /> Owner</span>
                  <p>{employeeName(lead.assignedTo)}</p>
                </li>
                <li>
                  <span className="kv-label"><GlobeIcon /> Lead Source</span>
                  <p>{lead.source}</p>
                </li>
                <li>
                  <span className="kv-label"><FlagIcon /> Priority</span>
                  <p>{lead.priority}</p>
                </li>
                <li>
                  <span className="kv-label"><CalendarIcon /> Created</span>
                  <p>{lead.createdAt}</p>
                </li>
                <li>
                  <span className="kv-label"><FollowupsIcon /> Expected Close</span>
                  <p>{lead.closingDate}</p>
                </li>
              </ul>
            )}
          </section>

          {relatedCompany && (
            <section className="lead-details__card">
              <h3>Related</h3>
              <Link to={`/companies/${relatedCompany.id}`} className="related-company-card">
                <span className="related-company-card__icon"><BuildingIcon /></span>
                <div>
                  <p className="data-table__primary">{relatedCompany.name}</p>
                  <p className="data-table__secondary">View company profile</p>
                </div>
                <ChevronRightIcon className="related-company-card__chevron" />
              </Link>
            </section>
          )}
        </aside>
      </div>

      <Drawer
        open={customFollowupOpen}
        onClose={() => setCustomFollowupOpen(false)}
        title="Custom Follow-up"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setCustomFollowupOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="custom-followup-form" className="btn btn--primary btn--block">
              Add Follow-up
            </button>
          </>
        }
      >
        <form id="custom-followup-form" onSubmit={addCustomFollowUp} noValidate>
          <div className="field">
            <label>Type</label>
            <select
              value={customFollowup.type}
              onChange={(e) => setCustomFollowup((prev) => ({ ...prev, type: e.target.value }))}
            >
              {customFollowupTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={customFollowup.date}
              onChange={(e) => setCustomFollowup((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Time</label>
            <input
              type="time"
              value={customFollowup.time}
              onChange={(e) => setCustomFollowup((prev) => ({ ...prev, time: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea
              value={customFollowup.notes}
              onChange={(e) => setCustomFollowup((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="What's this follow-up about?"
            />
          </div>
        </form>
      </Drawer>

      <Drawer
        open={contactDrawerOpen}
        onClose={() => setContactDrawerOpen(false)}
        title="Add Contact"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setContactDrawerOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-contact-form" className="btn btn--primary btn--block">
              Add Contact
            </button>
          </>
        }
      >
        <form id="add-contact-form" onSubmit={addContact} noValidate>
          <div className="field">
            <label>Name</label>
            <input
              value={contactForm.name}
              onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Priya Sharma"
              required
            />
          </div>
          <div className="field">
            <label>Designation</label>
            <input
              value={contactForm.designation}
              onChange={(e) => setContactForm((prev) => ({ ...prev, designation: e.target.value }))}
              placeholder="e.g. Finance Manager"
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={contactForm.phone}
              onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. +91 98765 43210"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. priya@company.com"
            />
          </div>
          <div className="field">
            <label>LinkedIn</label>
            <input
              value={contactForm.linkedin}
              onChange={(e) => setContactForm((prev) => ({ ...prev, linkedin: e.target.value }))}
              placeholder="e.g. linkedin.com/in/priyasharma"
            />
          </div>
        </form>
      </Drawer>
    </div>
  )
}

export default LeadDetails
