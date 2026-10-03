import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Tabs from '../components/common/Tabs.jsx'
import StageTracker from '../components/common/StageTracker.jsx'
import Drawer from '../components/common/Drawer.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { pipelineStages } from '../data/pipeline.js'
import { useLeads } from '../context/LeadsContext.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useCrm } from '../hooks/useCrm.js'
import ConvertToClientDrawer from '../components/crm/ConvertToClientDrawer.jsx'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
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
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  PlusIcon,
  RefreshIcon,
  TrashIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/StageTracker.css'
import '../components/common/Form.css'
import './LeadDetails.css'
import { useConfirm } from '../components/common/ConfirmProvider.jsx'

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'followups', label: 'Follow-ups' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'proposals', label: 'Proposals' },
  { value: 'notes', label: 'Notes' },
]

const followupIcons = { Call: PhoneIcon, Email: MailIcon, WhatsApp: WhatsappIcon, Meeting: MeetingsIcon }

const customFollowupTypes = ['Call', 'Email', 'WhatsApp', 'Meeting', 'Other']
const meetingTypes = ['Video Call', 'Phone Call', 'In Person']
const proposalStatuses = ['Draft', 'Sent', 'Viewed', 'Negotiation', 'Accepted', 'Rejected']

const emptyCustomFollowup = { type: 'Call', date: '', time: '', notes: '' }
const emptyContact = { name: '', designation: '', phone: '', email: '', linkedin: '' }
const emptyMeeting = { title: '', date: '', startTime: '', endTime: '', type: 'Video Call', participants: '', agenda: '' }
const emptyProposal = { service: '', amount: '', date: '', status: 'Draft' }

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
  const { leads, employees, loaded } = useLeads()
  const lead = leads.find((l) => l.id === id)

  if (!loaded) {
    return (
      <div className="lead-details-page">
        <p className="lead-details__empty">Loading lead…</p>
      </div>
    )
  }

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

  return <LeadDetailView key={lead.id} lead={lead} employees={employees} />
}

function LeadDetailView({ lead, employees }) {
  const confirm = useConfirm()
  const employeeName = (empId) => employees.find((e) => e.id === empId)?.name ?? empId
  const { updateLead, refresh } = useLeads()
  const { user } = useAuth()
  const isManager = user?.role === 'sales-manager'
  const status = lead.status
  const [convertOpen, setConvertOpen] = useState(false)
  const [preLostStatus, setPreLostStatus] = useState(lead.status === 'Lost' ? 'New' : lead.status)
  const [tab, setTab] = useState('overview')
  const followUpsApi = useCrm('follow-ups', { parentId: lead.id })
  const meetingsApi = useCrm('meetings', { parentId: lead.id })
  const proposalsApi = useCrm('proposals')
  const leadFollowUps = followUpsApi.items
  const leadMeetings = meetingsApi.items
  const leadProposals = proposalsApi.items.filter((p) => p.company === lead.company)
  const [noteDraft, setNoteDraft] = useState(lead?.notes ?? '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [dealDetailsOpen, setDealDetailsOpen] = useState(true)
  const [customFollowupOpen, setCustomFollowupOpen] = useState(false)
  const [customFollowup, setCustomFollowup] = useState(emptyCustomFollowup)
  const [extraContacts, setExtraContacts] = useState([])
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false)
  const [contactForm, setContactForm] = useState(emptyContact)
  const [meetingDrawerOpen, setMeetingDrawerOpen] = useState(false)
  const [meetingForm, setMeetingForm] = useState(emptyMeeting)
  const [meetingError, setMeetingError] = useState('')
  const [proposalDrawerOpen, setProposalDrawerOpen] = useState(false)
  const [proposalForm, setProposalForm] = useState(emptyProposal)

  const isLost = status === 'Lost'
  const stageIndex = pipelineStages.indexOf(status)
  const whatsappNumber = (lead.phone ?? '').replace(/[^\d]/g, '')

  function changeStage(stage) {
    setPreLostStatus(stage)
    updateLead(lead.id, { status: stage })
  }

  function markAsLost() {
    setPreLostStatus(status)
    updateLead(lead.id, { status: 'Lost' })
  }

  function reopenLead() {
    updateLead(lead.id, { status: preLostStatus })
  }

  async function addCustomFollowUp(e) {
    e.preventDefault()
    const isToday = !customFollowup.date || customFollowup.date === todayISO()
    await followUpsApi.create({
      leadId: lead.id,
      lead: lead.company,
      employee: employeeName(lead.assignedTo),
      type: customFollowup.type,
      dueDate: customFollowup.date || todayISO(),
      date: formatFollowupDate(customFollowup.date),
      time: customFollowup.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: 'Pending',
      bucket: isToday ? 'today' : 'upcoming',
      notes: customFollowup.notes || `${customFollowup.type} follow-up scheduled.`,
    })
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

  async function addMeeting(e) {
    e.preventDefault()
    if (!meetingForm.title.trim()) {
      setMeetingError('Meeting title is required.')
      return
    }
    setMeetingError('')
    try {
      await meetingsApi.create({
      leadId: lead.id,
      title: meetingForm.title,
      lead: lead.company,
      date: meetingForm.date || todayISO(),
      startTime: meetingForm.startTime,
      endTime: meetingForm.endTime,
      type: meetingForm.type,
      link: '',
      participants: meetingForm.participants
        ? meetingForm.participants.split(',').map((p) => p.trim()).filter(Boolean)
        : [],
      agenda: meetingForm.agenda,
      notes: '',
      outcome: '',
      nextAction: '',
      nextFollowup: '',
      })
    } catch (err) {
      setMeetingError(err.message || 'Could not schedule this meeting.')
      return
    }
    setMeetingForm(emptyMeeting)
    setMeetingDrawerOpen(false)
  }

  async function addProposal(e) {
    e.preventDefault()
    if (!proposalForm.service.trim()) return
    await proposalsApi.create({
      company: lead.company,
      leadId: lead.id,
      service: proposalForm.service,
      amount: proposalForm.amount,
      createdBy: employeeName(lead.assignedTo),
      date: proposalForm.date || todayISO(),
      status: proposalForm.status,
      items: [],
    })
    setProposalForm(emptyProposal)
    setProposalDrawerOpen(false)
  }

  async function completeFollowUp(followupId) {
    await followUpsApi.update(followupId, { status: 'Done' })
  }

  async function rescheduleFollowUp(followupId) {
    await followUpsApi.update(followupId, { status: 'Pending', bucket: 'upcoming', date: 'Tomorrow' })
  }

  async function deleteFollowUp(followupId) {
    if (!(await confirm({ title: 'Delete follow-up?', message: 'This cannot be undone.', confirmLabel: 'Delete', tone: 'danger' }))) return
    await followUpsApi.remove(followupId)
  }

  async function deleteMeeting(meetingId) {
    if (!(await confirm({ title: 'Delete meeting?', message: 'This cannot be undone.', confirmLabel: 'Delete', tone: 'danger' }))) return
    await meetingsApi.remove(meetingId)
  }

  async function deleteProposal(proposalId) {
    if (!(await confirm({ title: 'Delete proposal?', message: 'This cannot be undone.', confirmLabel: 'Delete', tone: 'danger' }))) return
    await proposalsApi.remove(proposalId)
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
              <Badge tone={statusTone(status)}>{status}</Badge>
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
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTab('followups')}>
              <FollowupsIcon /> Follow-up
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTab('meetings')}>
              <MeetingsIcon /> Meeting
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTab('proposals')}>
              <ProposalsIcon /> Proposal
            </button>
            {isLost ? (
              <button type="button" className="btn btn--ghost btn--sm" onClick={reopenLead}>
                <RefreshIcon /> Reopen Lead
              </button>
            ) : (
              <button type="button" className="btn btn--ghost btn--sm" onClick={markAsLost}>
                <FlagIcon /> Mark as Lost
              </button>
            )}
            {lead.convertedClientId ? (
              isManager && (
                <Link to="/clients" className="btn btn--ghost btn--sm">
                  <CheckCircleIcon /> Client
                </Link>
              )
            ) : status === 'Won' && isManager ? (
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setConvertOpen(true)}>
                <CheckCircleIcon /> Convert to Client
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {isLost ? (
        <div className="lead-details__lost-banner">
          <FlagIcon /> This lead was marked as <strong>Lost</strong>
        </div>
      ) : (
        <StageTracker stages={pipelineStages} currentIndex={stageIndex} onSelect={changeStage} />
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
                    {lead.address && <li><MapPinIcon /> {lead.address}</li>}
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
                          <div className="followup-item__actions">
                            {f.status !== 'Done' && (
                              <>
                                <button className="btn btn--ghost btn--sm" onClick={() => rescheduleFollowUp(f.id)}>
                                  Reschedule
                                </button>
                                <button className="btn btn--primary btn--sm" onClick={() => completeFollowUp(f.id)}>
                                  Complete
                                </button>
                              </>
                            )}
                            <button className="btn btn--ghost btn--sm" onClick={() => deleteFollowUp(f.id)}>
                              <TrashIcon /> Delete
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="lead-details__empty">No follow-ups scheduled yet. Use the buttons above to schedule one.</p>
                )}
              </>
            )}

            {tab === 'meetings' && (
              <>
                <div className="activity-composer">
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => setMeetingDrawerOpen(true)}
                  >
                    <PlusIcon /> Add Meeting
                  </button>
                </div>

                {leadMeetings.length > 0 ? (
                  <ul className="followup-list">
                    {leadMeetings.map((m) => (
                      <li className="followup-item" key={m.id}>
                        <span className="followup-item__icon">
                          <MeetingsIcon />
                        </span>
                        <div className="followup-item__body">
                          <div className="followup-item__top">
                            <p className="followup-item__type">{m.title}</p>
                            <Badge tone="outline">{m.type}</Badge>
                          </div>
                          <p className="followup-item__meta">
                            {m.date} · {m.startTime}–{m.endTime}
                            {m.participants.length > 0 ? ` · ${m.participants.join(', ')}` : ''}
                          </p>
                          {m.agenda && <p className="followup-item__notes">{m.agenda}</p>}
                        </div>
                        <div className="followup-item__actions">
                          <button className="btn btn--ghost btn--sm" onClick={() => deleteMeeting(m.id)}>
                            <TrashIcon /> Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="lead-details__empty">No meetings scheduled yet. Use the button above to schedule one.</p>
                )}
              </>
            )}

            {tab === 'proposals' && (
              <>
                <div className="activity-composer">
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => setProposalDrawerOpen(true)}
                  >
                    <PlusIcon /> Add Proposal
                  </button>
                </div>

                {leadProposals.length > 0 ? (
                  <ul className="followup-list">
                    {leadProposals.map((p) => (
                      <li className="followup-item" key={p.id}>
                        <span className="followup-item__icon">
                          <ProposalsIcon />
                        </span>
                        <div className="followup-item__body">
                          <div className="followup-item__top">
                            <p className="followup-item__type">{p.service}</p>
                            <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                          </div>
                          <p className="followup-item__meta">
                            {p.id} · {p.amount} · {p.date}
                          </p>
                        </div>
                        <div className="followup-item__actions">
                          <Link to={`/proposals/${p.id}`} className="btn btn--ghost btn--sm">
                            View
                          </Link>
                          <button className="btn btn--ghost btn--sm" onClick={() => deleteProposal(p.id)}>
                            <TrashIcon /> Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="lead-details__empty">No proposals sent yet. Use the button above to add one.</p>
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

      <Drawer
        open={meetingDrawerOpen}
        onClose={() => setMeetingDrawerOpen(false)}
        title="Schedule Meeting"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setMeetingDrawerOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-meeting-form" className="btn btn--primary btn--block">
              Schedule Meeting
            </button>
          </>
        }
      >
        <form id="add-meeting-form" onSubmit={addMeeting} noValidate>
          <div className="field">
            <label>Meeting Title</label>
            <input
              value={meetingForm.title}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Proposal Walkthrough"
              required
            />
          </div>
          <div className="field">
            <label>Meeting Type</label>
            <select
              value={meetingForm.type}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              {meetingTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={meetingForm.date}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Start Time</label>
            <input
              type="time"
              value={meetingForm.startTime}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, startTime: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>End Time</label>
            <input
              type="time"
              value={meetingForm.endTime}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Participants</label>
            <input
              value={meetingForm.participants}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, participants: e.target.value }))}
              placeholder="Comma-separated names"
            />
          </div>
          <div className="field">
            <label>Agenda</label>
            <textarea
              value={meetingForm.agenda}
              onChange={(e) => setMeetingForm((prev) => ({ ...prev, agenda: e.target.value }))}
              placeholder="What will this meeting cover?"
            />
          </div>
                  {meetingError && <p className="field__error">{meetingError}</p>}
        </form>
      </Drawer>

      <Drawer
        open={proposalDrawerOpen}
        onClose={() => setProposalDrawerOpen(false)}
        title="New Proposal"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setProposalDrawerOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-proposal-form" className="btn btn--primary btn--block">
              Add Proposal
            </button>
          </>
        }
      >
        <form id="add-proposal-form" onSubmit={addProposal} noValidate>
          <div className="field">
            <label>Service</label>
            <input
              value={proposalForm.service}
              onChange={(e) => setProposalForm((prev) => ({ ...prev, service: e.target.value }))}
              placeholder="e.g. ERP Implementation"
              required
            />
          </div>
          <div className="field">
            <label>Amount</label>
            <input
              value={proposalForm.amount}
              onChange={(e) => setProposalForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="e.g. ₹6,20,000"
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={proposalForm.date}
              onChange={(e) => setProposalForm((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={proposalForm.status}
              onChange={(e) => setProposalForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              {proposalStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </form>
      </Drawer>
      <ConvertToClientDrawer
        lead={lead}
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        onConverted={() => refresh()}
      />
    </div>
  )
}

export default LeadDetails
