import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { employees } from '../data/mockData.js'
import {
  ArrowLeftIcon,
  BuildingIcon,
  ContactsIcon,
  SalesIcon,
  EmployeesIcon,
  NoteIcon,
  CheckCircleIcon,
  GlobeIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  LinkedinIcon,
  BudgetIcon,
  CalendarIcon,
  UserIcon,
  BriefcaseIcon,
  TrendUpIcon,
  ProposalsIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/Form.css'
import './LeadNew.css'

const sources = ['LinkedIn', 'Cold Email', 'Referral', 'Website', 'WhatsApp', 'Other']
const priorities = ['Low', 'Medium', 'High', 'Urgent']

const initialForm = {
  companyName: '',
  website: '',
  industry: '',
  country: '',
  city: '',
  contactPerson: '',
  designation: '',
  phone: '',
  email: '',
  linkedin: '',
  leadSource: '',
  service: '',
  priority: 'Medium',
  budget: '',
  closingDate: '',
  assignedTo: '',
  notes: '',
}

const requiredFields = [
  { key: 'companyName', label: 'Company name' },
  { key: 'contactPerson', label: 'Contact person' },
  { key: 'phone', label: 'Phone number' },
  { key: 'leadSource', label: 'Lead source' },
  { key: 'assignedTo', label: 'Assigned employee' },
]

function initials(name) {
  const trimmed = name.trim()
  if (!trimmed) return '—'
  return trimmed.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function LeadNew() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const completedCount = useMemo(
    () => requiredFields.filter((f) => form[f.key].trim()).length,
    [form]
  )
  const progress = Math.round((completedCount / requiredFields.length) * 100)
  const assignedEmployee = employees.find((e) => e.id === form.assignedTo)

  function handleSubmit(e) {
    e.preventDefault()
    const required = {
      companyName: 'Company name is required.',
      contactPerson: 'Contact person is required.',
      phone: 'Phone number is required.',
      leadSource: 'Lead source is required.',
      assignedTo: 'Please assign this lead to an employee.',
    }
    const nextErrors = {}
    Object.entries(required).forEach(([key, message]) => {
      if (!form[key].trim()) nextErrors[key] = message
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate('/leads')
    }, 900)
  }

  return (
    <div className="lead-new-page">
      <Link to="/leads" className="back-link">
        <ArrowLeftIcon /> Back to Leads
      </Link>

      <PageHeader title="Add New Lead" subtitle="Capture the details below to add this lead to your pipeline" />

      <div className="lead-new__progress">
        <div className="lead-new__progress-track">
          <div className="lead-new__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="lead-new__progress-label">
          {completedCount} of {requiredFields.length} required fields completed
        </span>
      </div>

      <div className="lead-new__layout">
        <form id="lead-form" className="lead-new__form" onSubmit={handleSubmit} noValidate>
          <div className="form-card">
            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><BuildingIcon /></span>
                Company Details
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label>Company Name<span className="required">*</span></label>
                  <div className="lead-field__control">
                    <BuildingIcon className="lead-field__icon" />
                    <input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="e.g. ABC Trading LLC" />
                  </div>
                  {errors.companyName && <span className="field__error">{errors.companyName}</span>}
                </div>
                <div className="field">
                  <label>Website</label>
                  <div className="lead-field__control">
                    <GlobeIcon className="lead-field__icon" />
                    <input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="e.g. abctrading.ae" />
                  </div>
                </div>
                <div className="field">
                  <label>Industry</label>
                  <div className="lead-field__control">
                    <BriefcaseIcon className="lead-field__icon" />
                    <input value={form.industry} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. Trading & Distribution" />
                  </div>
                </div>
                <div className="field">
                  <label>Country</label>
                  <div className="lead-field__control">
                    <MapPinIcon className="lead-field__icon" />
                    <input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="e.g. UAE" />
                  </div>
                </div>
                <div className="field">
                  <label>City</label>
                  <div className="lead-field__control">
                    <MapPinIcon className="lead-field__icon" />
                    <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. Dubai" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><ContactsIcon /></span>
                Contact Person
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label>Contact Person<span className="required">*</span></label>
                  <div className="lead-field__control">
                    <UserIcon className="lead-field__icon" />
                    <input value={form.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} placeholder="e.g. Ahmed Al Farsi" />
                  </div>
                  {errors.contactPerson && <span className="field__error">{errors.contactPerson}</span>}
                </div>
                <div className="field">
                  <label>Designation</label>
                  <div className="lead-field__control">
                    <BriefcaseIcon className="lead-field__icon" />
                    <input value={form.designation} onChange={(e) => set('designation', e.target.value)} placeholder="e.g. Operations Manager" />
                  </div>
                </div>
                <div className="field">
                  <label>Phone<span className="required">*</span></label>
                  <div className="lead-field__control">
                    <PhoneIcon className="lead-field__icon" />
                    <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="e.g. +971 55 123 4567" />
                  </div>
                  {errors.phone && <span className="field__error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label>Email</label>
                  <div className="lead-field__control">
                    <MailIcon className="lead-field__icon" />
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="e.g. ahmed@abctrading.ae" />
                  </div>
                </div>
                <div className="field field--full">
                  <label>LinkedIn</label>
                  <div className="lead-field__control">
                    <LinkedinIcon className="lead-field__icon" />
                    <input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="e.g. linkedin.com/in/ahmedalfarsi" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><SalesIcon /></span>
                Sales Details
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label>Lead Source<span className="required">*</span></label>
                  <div className="lead-field__control">
                    <TrendUpIcon className="lead-field__icon" />
                    <select value={form.leadSource} onChange={(e) => set('leadSource', e.target.value)}>
                      <option value="">Select source</option>
                      {sources.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {errors.leadSource && <span className="field__error">{errors.leadSource}</span>}
                </div>
                <div className="field">
                  <label>Service Interested</label>
                  <div className="lead-field__control">
                    <ProposalsIcon className="lead-field__icon" />
                    <input value={form.service} onChange={(e) => set('service', e.target.value)} placeholder="e.g. ERP Implementation" />
                  </div>
                </div>
                <div className="field field--full">
                  <label>Priority</label>
                  <div className="priority-picker">
                    {priorities.map((p) => (
                      <button
                        type="button"
                        key={p}
                        className={`priority-pill priority-pill--${p.toLowerCase()}${form.priority === p ? ' is-active' : ''}`}
                        onClick={() => set('priority', p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>Expected Budget</label>
                  <div className="lead-field__control">
                    <BudgetIcon className="lead-field__icon" />
                    <input value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="e.g. ₹8L – ₹12L" />
                  </div>
                </div>
                <div className="field">
                  <label>Expected Closing Date</label>
                  <div className="lead-field__control">
                    <CalendarIcon className="lead-field__icon" />
                    <input type="date" value={form.closingDate} onChange={(e) => set('closingDate', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><EmployeesIcon /></span>
                Assignment
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label>Assigned Employee<span className="required">*</span></label>
                  <div className="lead-field__control">
                    <UserIcon className="lead-field__icon" />
                    <select value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)}>
                      <option value="">Select employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.name} — {emp.role}</option>
                      ))}
                    </select>
                  </div>
                  {errors.assignedTo && <span className="field__error">{errors.assignedTo}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><NoteIcon /></span>
                Notes
              </h3>
              <div className="field">
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Any additional context about this lead..."
                />
              </div>
            </div>
          </div>

          <div className="form-actions lead-new__mobile-actions">
            <Link to="/leads" className="btn btn--ghost">Cancel</Link>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Lead'}
            </button>
          </div>
        </form>

        <aside className="lead-new__side">
          <div className="lead-preview-card">
            <span className="lead-preview-card__label">Live Preview</span>
            <div className="lead-preview-card__avatar">{initials(form.companyName)}</div>
            <h4 className="lead-preview-card__name">{form.companyName || 'New Company'}</h4>
            <p className="lead-preview-card__contact">
              {form.contactPerson || 'Contact person'}
              {form.designation && ` · ${form.designation}`}
            </p>

            <div className="lead-preview-card__badges">
              <Badge tone={statusTone(form.priority)}>{form.priority} priority</Badge>
              {form.leadSource && <Badge tone="outline">{form.leadSource}</Badge>}
            </div>

            <dl className="lead-preview-card__meta">
              <div>
                <dt>Phone</dt>
                <dd>{form.phone || '—'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{form.email || '—'}</dd>
              </div>
              <div>
                <dt>Assigned to</dt>
                <dd>{assignedEmployee ? assignedEmployee.name : 'Unassigned'}</dd>
              </div>
            </dl>
          </div>

          <div className="lead-checklist-card">
            <h4>Required details</h4>
            <ul>
              {requiredFields.map((f) => {
                const done = Boolean(form[f.key].trim())
                return (
                  <li key={f.key} className={done ? 'is-done' : ''}>
                    <CheckCircleIcon />
                    {f.label}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="lead-new__side-actions">
            <button form="lead-form" type="submit" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Saving…' : 'Save Lead'}
            </button>
            <Link to="/leads" className="btn btn--ghost btn--block">Cancel</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default LeadNew
