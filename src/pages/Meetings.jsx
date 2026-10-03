import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import Tabs from '../components/common/Tabs.jsx'
import Modal from '../components/common/Modal.jsx'
import Badge from '../components/common/Badge.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  PlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SearchIcon,
  CalendarIcon,
  FollowupsIcon,
  UserIcon,
  ContactsIcon,
  GlobeIcon,
  PhoneIcon,
  MapPinIcon,
  NoteIcon,
  CheckCircleIcon,
  MeetingsIcon,
  TrashIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import '../components/common/Badge.css'
import './Meetings.css'
import { useConfirm } from '../components/common/ConfirmProvider.jsx'

const views = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'list', label: 'List' },
]

const meetingTypes = ['Video Call', 'Phone Call', 'In Person']
const today = new Date(2026, 8, 6)
const todayIso = toLocalISODate(today)
const MAX_VISIBLE_EVENTS = 3

const typeTone = { 'Video Call': 'medium', 'Phone Call': 'soft', 'In Person': 'dark' }
const typeIcon = { 'Video Call': GlobeIcon, 'Phone Call': PhoneIcon, 'In Person': MapPinIcon }

function toLocalISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function meetingStatus(m) {
  if (m.outcome) return 'Completed'
  return m.date < todayIso ? 'Missed' : 'Upcoming'
}

function startOfWeek(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

const emptyForm = {
  title: '',
  lead: '',
  date: todayIso,
  startTime: '',
  endTime: '',
  type: 'Video Call',
  link: '',
  participants: '',
  agenda: '',
  notes: '',
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

function Meetings() {
  const confirm = useConfirm()
  const { leads } = useLeads()
  const { items: meetings, create, update, remove } = useCrm('meetings')
  const [view, setView] = useState('calendar')
  const [newOpen, setNewOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [selected, setSelected] = useState(null)
  const [dayView, setDayView] = useState(null)
  const [outcome, setOutcome] = useState({ outcome: '', nextAction: '', nextFollowup: '' })
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const days = useMemo(() => buildCalendarDays(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const stats = useMemo(() => {
    const weekStart = startOfWeek(today)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return {
      today: meetings.filter((m) => m.date === todayIso).length,
      week: meetings.filter((m) => {
        const d = parseISODate(m.date)
        return d >= weekStart && d <= weekEnd
      }).length,
      upcoming: meetings.filter((m) => meetingStatus(m) === 'Upcoming').length,
      completed: meetings.filter((m) => meetingStatus(m) === 'Completed').length,
    }
  }, [meetings])

  const filteredMeetings = useMemo(() => {
    const q = search.trim().toLowerCase()
    return meetings.filter((m) => {
      const matchesSearch = !q || m.title.toLowerCase().includes(q) || m.lead.toLowerCase().includes(q)
      const matchesType = !typeFilter || m.type === typeFilter
      const matchesStatus = !statusFilter || meetingStatus(m) === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [meetings, search, typeFilter, statusFilter])

  const sortedMeetings = useMemo(
    () => [...filteredMeetings].sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    [filteredMeetings]
  )

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function meetingsOn(date) {
    if (!date) return []
    const iso = toLocalISODate(date)
    return filteredMeetings.filter((m) => m.date === iso)
  }

  function openMeeting(m) {
    setDayView(null)
    setSelected(m)
    setOutcome({ outcome: m.outcome, nextAction: m.nextAction, nextFollowup: m.nextFollowup })
  }

  async function deleteMeeting(id) {
    if (!(await confirm({ title: 'Delete meeting?', message: 'This cannot be undone.', confirmLabel: 'Delete', tone: 'danger' }))) return
    await remove(id)
    setSelected(null)
  }

  async function saveOutcome() {
    await update(selected.id, outcome)
    setSelected(null)
  }

  async function createMeeting(e) {
    e.preventDefault()
    if (!form.title.trim()) return setFormError('Meeting title is required.')
    if (!form.lead.trim()) return setFormError('Select the lead or company this meeting is for.')
    if (!form.date) return setFormError('Pick a date for the meeting.')
    setFormError('')
    const linkedLead = leads.find((l) => l.company === form.lead)
    try {
      await create({
        ...form,
        leadId: linkedLead?.id,
        participants: form.participants.split(',').map((p) => p.trim()).filter(Boolean),
        outcome: '',
        nextAction: '',
        nextFollowup: '',
      })
    } catch (err) {
      setFormError(err.message || 'Could not schedule this meeting.')
      return
    }
    setForm(emptyForm)
    setNewOpen(false)
  }

  function shiftMonth(delta) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1))
  }

  function goToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const SelectedTypeIcon = selected ? typeIcon[selected.type] : null

  return (
    <div className="meetings-page">
      <PageHeader title="Meetings" subtitle="Schedule and track every client meeting">
        <button className="btn btn--primary" onClick={() => setNewOpen(true)}>
          <PlusIcon /> New Meeting
        </button>
      </PageHeader>

      <div className="meetings-stats">
        <KpiCard label="Today" value={stats.today} icon={MeetingsIcon} accent="#2a78d6" />
        <KpiCard label="This Week" value={stats.week} icon={CalendarIcon} accent="#eb6834" />
        <KpiCard label="Upcoming" value={stats.upcoming} icon={FollowupsIcon} accent="#eda100" />
        <KpiCard label="Completed" value={stats.completed} icon={CheckCircleIcon} accent="#1baf7a" />
      </div>

      <div className="meetings-toolbar">
        <Tabs tabs={views} active={view} onChange={setView} />
        <div className="meetings-toolbar__filters">
          <div className="meetings-search">
            <SearchIcon className="meetings-search__icon" />
            <input
              type="text"
              placeholder="Search by meeting or lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="meetings-filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {meetingTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className="meetings-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="calendar">
          <div className="calendar__head">
            <div className="calendar__head-nav">
              <button className="calendar__nav-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                <ChevronLeftIcon />
              </button>
              <h3>{monthLabel}</h3>
              <button className="calendar__nav-btn" onClick={() => shiftMonth(1)} aria-label="Next month">
                <ChevronRightIcon />
              </button>
              <button className="btn btn--ghost btn--sm" onClick={goToday}>Today</button>
            </div>
            <div className="calendar__legend">
              {meetingTypes.map((t) => (
                <span key={t} className="calendar__legend-item">
                  <i className={`calendar__legend-dot calendar__legend-dot--${typeTone[t]}`} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="calendar__weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="calendar__grid">
            {days.map((date, i) => {
              const dayMeetings = meetingsOn(date)
              const visible = dayMeetings.slice(0, MAX_VISIBLE_EVENTS)
              const overflow = dayMeetings.length - visible.length
              const isToday = date && date.toDateString() === today.toDateString()
              const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6)
              return (
                <div
                  key={i}
                  className={`calendar__cell${!date ? ' is-empty' : ''}${isToday ? ' is-today' : ''}${isWeekend && date ? ' is-weekend' : ''}`}
                >
                  {date && (
                    <>
                      <div className="calendar__date-row">
                        <span className="calendar__date">{date.getDate()}</span>
                        {isToday && <span className="calendar__today-pill">Today</span>}
                      </div>
                      <div className="calendar__events">
                        {visible.map((m) => (
                          <button
                            key={m.id}
                            className={`calendar__event calendar__event--${typeTone[m.type]}`}
                            onClick={() => openMeeting(m)}
                          >
                            <span className="calendar__event-time">{m.startTime}</span> {m.title}
                          </button>
                        ))}
                        {overflow > 0 && (
                          <button className="calendar__more" onClick={() => setDayView(toLocalISODate(date))}>
                            +{overflow} more
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="data-table-wrap">
          <div className="data-table-wrap__toolbar">
            <div className="data-table-wrap__toolbar-title">
              <h3>All Meetings</h3>
              <span>{filteredMeetings.length} of {meetings.length} scheduled</span>
            </div>
          </div>

          <div className="data-table-wrap__scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Lead</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedMeetings.map((m) => {
                  const TypeIcon = typeIcon[m.type]
                  const status = meetingStatus(m)
                  return (
                    <tr key={m.id} className="is-clickable" onClick={() => openMeeting(m)}>
                      <td><p className="data-table__primary">{m.title}</p></td>
                      <td className="data-table__muted">{m.lead}</td>
                      <td className="data-table__muted">{m.date}</td>
                      <td className="data-table__muted">{m.startTime} – {m.endTime}</td>
                      <td className="data-table__muted">
                        <span className="data-table__type">
                          <TypeIcon /> {m.type}
                        </span>
                      </td>
                      <td><Badge tone={statusTone(status)}>{status}</Badge></td>
                      <td>
                        <button className="data-table__link" onClick={(e) => { e.stopPropagation(); openMeeting(m) }}>View</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {sortedMeetings.length === 0 && (
              <div className="data-table__empty">No meetings match your search or filters.</div>
            )}
          </div>
        </div>
      )}

      <Modal
        open={!!dayView}
        onClose={() => setDayView(null)}
        title={dayView ? parseISODate(dayView).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
        width="480px"
      >
        <div className="day-meetings-list">
          {dayView && filteredMeetings.filter((m) => m.date === dayView).map((m) => {
            const TypeIcon = typeIcon[m.type]
            return (
              <button key={m.id} className="day-meetings-item" onClick={() => openMeeting(m)}>
                <span className="day-meetings-item__time">{m.startTime}</span>
                <span className="day-meetings-item__main">
                  <span className="day-meetings-item__title">{m.title}</span>
                  <span className="day-meetings-item__lead">{m.lead}</span>
                </span>
                <span className={`day-meetings-item__type day-meetings-item__type--${typeTone[m.type]}`}>
                  <TypeIcon />
                </span>
              </button>
            )
          })}
        </div>
      </Modal>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New Meeting" width="620px">
        <form className="meeting-form" onSubmit={createMeeting}>
          <div className="form-grid">
            <div className="field field--full">
              <label>Meeting Title</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Proposal Walkthrough" />
            </div>
            <div className="field field--full">
              <label>Lead / Company</label>
              <select value={form.lead} onChange={(e) => set('lead', e.target.value)}>
                <option value="">Select lead</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.company}>{l.company}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className="field">
              <label>Meeting Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                {meetingTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} />
            </div>
            <div className="field">
              <label>End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
            </div>
            <div className="field field--full">
              <label>Meeting Link</label>
              <input value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="e.g. meet.codlixtech.in/..." />
            </div>
            <div className="field field--full">
              <label>Participants</label>
              <input value={form.participants} onChange={(e) => set('participants', e.target.value)} placeholder="Comma-separated names" />
            </div>
            <div className="field field--full">
              <label>Agenda</label>
              <textarea value={form.agenda} onChange={(e) => set('agenda', e.target.value)} placeholder="What will this meeting cover?" />
            </div>
            <div className="field field--full">
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional internal notes" />
            </div>
          </div>
          {formError && <p className="field__error">{formError}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setNewOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">Schedule Meeting</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} width="580px">
        {selected && (
          <>
            <div className="meeting-detail-badges">
              <Badge tone={typeTone[selected.type]}>{selected.type}</Badge>
              <Badge tone={statusTone(meetingStatus(selected))}>{meetingStatus(selected)}</Badge>
            </div>

            <div className="meeting-detail-grid">
              <div>
                <span className="kv-label"><ContactsIcon /> Lead</span>
                <p>{selected.lead}</p>
              </div>
              <div>
                <span className="kv-label"><CalendarIcon /> Date</span>
                <p>{selected.date}</p>
              </div>
              <div>
                <span className="kv-label"><FollowupsIcon /> Time</span>
                <p>{selected.startTime} – {selected.endTime}</p>
              </div>
              <div>
                <span className="kv-label">{SelectedTypeIcon && <SelectedTypeIcon />} Type</span>
                <p>{selected.type}</p>
              </div>
              {selected.link && (
                <div className="field--full">
                  <span className="kv-label"><GlobeIcon /> Meeting Link</span>
                  <a className="meeting-detail-link" href={`https://${selected.link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer">
                    {selected.link}
                  </a>
                </div>
              )}
              {selected.participants?.length > 0 && (
                <div className="field--full">
                  <span className="kv-label"><UserIcon /> Participants</span>
                  <div className="meeting-detail-chips">
                    {selected.participants.map((p) => (
                      <span key={p} className="meeting-detail-chip">{p}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="field--full">
                <span className="kv-label"><NoteIcon /> Agenda</span>
                <p>{selected.agenda || '—'}</p>
              </div>
            </div>

            <div className="meeting-outcome">
              <h4><ChevronRightIcon /> After Meeting</h4>
              <div className="field">
                <label>Meeting Outcome</label>
                <textarea
                  value={outcome.outcome}
                  onChange={(e) => setOutcome((p) => ({ ...p, outcome: e.target.value }))}
                  placeholder="How did the meeting go?"
                />
              </div>
              <div className="field">
                <label>Next Action</label>
                <input
                  value={outcome.nextAction}
                  onChange={(e) => setOutcome((p) => ({ ...p, nextAction: e.target.value }))}
                  placeholder="e.g. Prepare and send proposal"
                />
              </div>
              <div className="field">
                <label>Next Follow-up</label>
                <input
                  type="date"
                  value={outcome.nextFollowup}
                  onChange={(e) => setOutcome((p) => ({ ...p, nextFollowup: e.target.value }))}
                />
              </div>
              <div className="meeting-detail-actions">
                <button className="btn btn--ghost" onClick={() => deleteMeeting(selected.id)}>
                  <TrashIcon /> Delete Meeting
                </button>
                <button className="btn btn--primary btn--block" onClick={saveOutcome}>Save Outcome</button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Meetings
