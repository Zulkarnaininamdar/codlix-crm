import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import Modal from '../components/common/Modal.jsx'
import Drawer from '../components/common/Drawer.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import { useCrm } from '../hooks/useCrm.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  SearchIcon,
  PlusIcon,
  PhoneIcon,
  MailIcon,
  WhatsappIcon,
  MeetingsIcon,
  FollowupsIcon,
  CheckIcon,
  FlagIcon,
  CalendarIcon,
  CheckCircleIcon,
  TrashIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import './FollowUps.css'
import { useConfirm } from '../components/common/ConfirmProvider.jsx'

const tabs = [
  { value: 'today', label: "Today's Follow-ups" },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'done', label: 'History' },
]

const statTiles = [
  { bucket: 'overdue', label: 'Overdue', icon: FlagIcon, accent: '#e5484d' },
  { bucket: 'today', label: 'Due Today', icon: FollowupsIcon, accent: '#eda100' },
  { bucket: 'upcoming', label: 'Upcoming', icon: CalendarIcon, accent: '#2a78d6' },
  { bucket: 'done', label: 'Completed', icon: CheckCircleIcon, accent: '#1baf7a' },
]

const typeIcons = { Call: PhoneIcon, Email: MailIcon, WhatsApp: WhatsappIcon, Meeting: MeetingsIcon }
const followupTypes = ['Call', 'Email', 'WhatsApp', 'Meeting']
const emptyForm = { lead: '', type: 'Call', date: '', time: '', assignedTo: '', notes: '' }

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(dateISO) {
  if (!dateISO || dateISO === todayISO()) return 'Today'
  return new Date(dateISO).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function bucketFor(dateISO) {
  if (!dateISO || dateISO === todayISO()) return 'today'
  return dateISO < todayISO() ? 'overdue' : 'upcoming'
}

function rowTone(f) {
  if (f.status === 'Done') return 'dark'
  if (f.bucket === 'overdue') return 'danger'
  if (f.bucket === 'today') return 'warning'
  return 'soft'
}

function rowLabel(f) {
  if (f.status === 'Done') return 'Completed'
  if (f.bucket === 'overdue') return 'Overdue'
  if (f.bucket === 'today') return 'Due Today'
  return 'Upcoming'
}

function FollowUps() {
  const confirm = useConfirm()
  const { leads, employees } = useLeads()
  const { items, create, update, remove } = useCrm('follow-ups')
  const [activeTab, setActiveTab] = useState('today')
  const [search, setSearch] = useState('')
  const [assignee, setAssignee] = useState('')
  const [selected, setSelected] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const assignees = useMemo(() => [...new Set(items.map((f) => f.employee))].sort(), [items])

  const counts = useMemo(
    () => ({
      today: items.filter((f) => f.bucket === 'today').length,
      upcoming: items.filter((f) => f.bucket === 'upcoming').length,
      overdue: items.filter((f) => f.bucket === 'overdue').length,
      done: items.filter((f) => f.bucket === 'done').length,
    }),
    [items]
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((f) => {
      if (f.bucket !== activeTab) return false
      if (assignee && f.employee !== assignee) return false
      if (q && !`${f.lead} ${f.employee} ${f.notes ?? ''}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, activeTab, assignee, search])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function complete(id) {
    await update(id, { status: 'Done', bucket: 'done' })
    setSelected(null)
  }

  async function deleteFollowUp(id) {
    if (!(await confirm({ title: 'Delete follow-up?', message: 'This cannot be undone.', confirmLabel: 'Delete', tone: 'danger' }))) return
    await remove(id)
    setSelected(null)
  }

  async function reschedule(id) {
    await update(id, { bucket: 'upcoming', status: 'Pending' })
    setSelected(null)
  }

  async function addFollowUp(e) {
    e.preventDefault()
    if (!form.lead || !form.assignedTo) return
    const bucket = bucketFor(form.date)
    const linkedLead = leads.find((l) => l.company === form.lead)
    await create({
      leadId: linkedLead?.id,
      lead: form.lead,
      employee: form.assignedTo,
      type: form.type,
      dueDate: form.date,
      date: formatDate(form.date),
      time: form.time || '—',
      status: bucket === 'overdue' ? 'Overdue' : 'Pending',
      bucket,
      notes: form.notes,
    })
    setForm(emptyForm)
    setFormOpen(false)
    setActiveTab(bucket)
  }

  return (
    <div className="followups-page">
      <PageHeader title="Follow-ups" subtitle="Stay on top of every call, email and WhatsApp touchpoint">
        <button className="btn btn--primary" onClick={() => setFormOpen(true)}>
          <PlusIcon /> Add Follow-up
        </button>
      </PageHeader>

      <div className="followups-stats">
        {statTiles.map((tile) => (
          <KpiCard
            key={tile.bucket}
            label={tile.label}
            value={counts[tile.bucket]}
            icon={tile.icon}
            accent={tile.accent}
            active={activeTab === tile.bucket}
            onClick={() => setActiveTab(tile.bucket)}
          />
        ))}
      </div>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>{tabs.find((t) => t.value === activeTab)?.label}</h3>
            <span>{visible.length} follow-up{visible.length === 1 ? '' : 's'}</span>
          </div>
          <div className="followups-search">
            <SearchIcon className="followups-search__icon" />
            <input
              type="text"
              placeholder="Search by lead, employee or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="followups-assignee-filter"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">All assignees</option>
            {assignees.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Task</th>
                <th>Date &amp; Time</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((f) => {
                const Icon = typeIcons[f.type] ?? FollowupsIcon
                const leadRecord = leads.find((l) => l.company === f.lead)
                return (
                  <tr key={f.id} className="is-clickable" onClick={() => setSelected(f)}>
                    <td>
                      <p className="data-table__primary">{f.lead}</p>
                      {leadRecord && <p className="data-table__secondary">{leadRecord.contactName}</p>}
                    </td>
                    <td>
                      <span className="followups-task">
                        <Icon className="followups-task__icon" /> {f.type}
                      </span>
                      {f.notes && <p className="data-table__secondary followups-task__notes">{f.notes}</p>}
                    </td>
                    <td className="data-table__muted">{f.date} · {f.time}</td>
                    <td className="data-table__muted">{f.employee}</td>
                    <td><Badge tone={rowTone(f)}>{rowLabel(f)}</Badge></td>
                    <td>
                      {f.status !== 'Done' ? (
                        <button
                          type="button"
                          className="followups-mark-done"
                          onClick={(e) => {
                            e.stopPropagation()
                            complete(f.id)
                          }}
                        >
                          <CheckIcon /> Mark Done
                        </button>
                      ) : (
                        <span className="data-table__muted">—</span>
                      )}
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm followups-delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFollowUp(f.id)
                        }}
                      >
                        <TrashIcon /> Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {visible.length === 0 && <div className="data-table__empty">No follow-ups match this view.</div>}
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Follow-up Details"
        footer={
          selected && (
            <>
              <button className="btn btn--ghost" onClick={() => deleteFollowUp(selected.id)}>Delete</button>
              {selected.status !== 'Done' && (
                <>
                  <button className="btn btn--ghost" onClick={() => reschedule(selected.id)}>Reschedule</button>
                  <button className="btn btn--primary" onClick={() => complete(selected.id)}>Complete</button>
                </>
              )}
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="followup-detail-grid">
              <div>
                <span className="followup-detail-label">Lead</span>
                <p>{selected.lead}</p>
              </div>
              <div>
                <span className="followup-detail-label">Type</span>
                <p>{selected.type}</p>
              </div>
              <div>
                <span className="followup-detail-label">Date</span>
                <p>{selected.date} {selected.time}</p>
              </div>
              <div>
                <span className="followup-detail-label">Employee</span>
                <p>{selected.employee}</p>
              </div>
            </div>
            <div>
              <span className="followup-detail-label">Notes</span>
              <p className="followup-detail-notes">{selected.notes}</p>
            </div>
          </>
        )}
      </Modal>

      <Drawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add Follow-up"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setFormOpen(false)}>Cancel</button>
            <button type="submit" form="add-followup-form" className="btn btn--primary btn--block">
              Add Follow-up
            </button>
          </>
        }
      >
        <form id="add-followup-form" onSubmit={addFollowUp} noValidate>
          <div className="field">
            <label>Lead</label>
            <select value={form.lead} onChange={(e) => set('lead', e.target.value)} required>
              <option value="">Select lead</option>
              {leads.map((l) => (
                <option key={l.id} value={l.company}>{l.company}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {followupTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="field">
            <label>Time</label>
            <input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} />
          </div>
          <div className="field">
            <label>Assigned Employee</label>
            <select value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)} required>
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="What's this follow-up about?"
            />
          </div>
        </form>
      </Drawer>
    </div>
  )
}

export default FollowUps
