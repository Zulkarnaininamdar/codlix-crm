import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  ArrowLeftIcon,
  ProjectsIcon,
  CheckCircleIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/Form.css'
import './LeadNew.css'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function nextProjectId() {
  return 'Assigned on save'
}

function initials(name) {
  const trimmed = name.trim()
  if (!trimmed) return '—'
  return trimmed.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

const initialForm = {
  name: '',
  client: '',
  manager: '',
  startDate: todayISO(),
  endDate: '',
}

const requiredFields = [
  { key: 'name', label: 'Project name' },
  { key: 'client', label: 'Client company' },
  { key: 'manager', label: 'Project manager' },
  { key: 'endDate', label: 'End date' },
]

function ProjectNew() {
  const navigate = useNavigate()
  const { employees } = useLeads()
  const { items: companies } = useCrm('companies')
  const { create: saveProject } = useCrm('projects')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const projectId = useMemo(() => nextProjectId(), [])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const completedCount = requiredFields.filter((f) => form[f.key].trim()).length
  const progress = Math.round((completedCount / requiredFields.length) * 100)

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Project name is required.'
    if (!form.client.trim()) nextErrors.client = 'Select a client company.'
    if (!form.manager.trim()) nextErrors.manager = 'Select a project manager.'
    if (!form.endDate.trim()) nextErrors.endDate = 'Expected end date is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setSubmitError('')
    try {
      await saveProject({
        name: form.name,
        client: form.client,
        manager: form.manager,
        startDate: form.startDate,
        endDate: form.endDate,
        progress: 0,
        status: 'Active',
      })
      navigate('/projects')
    } catch (err) {
      setSubmitError(err.message || 'Could not save the project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="lead-new-page">
      <Link to="/projects" className="back-link">
        <ArrowLeftIcon /> Back to Projects
      </Link>

      <PageHeader title="Create New Project" subtitle="Set up a new delivery engagement for your team" />

      <div className="lead-new__progress">
        <div className="lead-new__progress-track">
          <div className="lead-new__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="lead-new__progress-label">
          {completedCount} of {requiredFields.length} required fields completed
        </span>
      </div>

      <div className="lead-new__layout">
        <form id="project-form" className="lead-new__form" onSubmit={handleSubmit} noValidate>
          <div className="form-card">
            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><ProjectsIcon /></span>
                Project Details
              </h3>
              <div className="form-grid">
                <div className="field field--full">
                  <label>Project Name<span className="required">*</span></label>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Website Revamp" />
                  {errors.name && <span className="field__error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label>Client Company<span className="required">*</span></label>
                  <select value={form.client} onChange={(e) => set('client', e.target.value)}>
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.client && <span className="field__error">{errors.client}</span>}
                </div>
                <div className="field">
                  <label>Project Manager<span className="required">*</span></label>
                  <select value={form.manager} onChange={(e) => set('manager', e.target.value)}>
                    <option value="">Select manager</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>{emp.name} — {emp.role}</option>
                    ))}
                  </select>
                  {errors.manager && <span className="field__error">{errors.manager}</span>}
                </div>
                <div className="field">
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
                </div>
                <div className="field">
                  <label>Expected End Date<span className="required">*</span></label>
                  <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
                  {errors.endDate && <span className="field__error">{errors.endDate}</span>}
                </div>
              </div>
            </div>
          </div>

          {submitError && <p className="field__error">{submitError}</p>}

          <div className="form-actions lead-new__mobile-actions">
            <Link to="/projects" className="btn btn--ghost">Cancel</Link>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Create Project'}
            </button>
          </div>
        </form>

        <aside className="lead-new__side">
          <div className="lead-preview-card">
            <span className="lead-preview-card__label">Live Preview</span>
            <div className="lead-preview-card__avatar">{initials(form.name)}</div>
            <h4 className="lead-preview-card__name">{form.name || 'New Project'}</h4>
            <p className="lead-preview-card__contact">{form.client || 'Client company'}</p>

            <div className="lead-preview-card__badges">
              <Badge tone={statusTone('active')}>Active</Badge>
            </div>

            <dl className="lead-preview-card__meta">
              <div>
                <dt>Project ID</dt>
                <dd>{projectId}</dd>
              </div>
              <div>
                <dt>Manager</dt>
                <dd>{form.manager || '—'}</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>{form.startDate} → {form.endDate || '—'}</dd>
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
            <button form="project-form" type="submit" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Saving…' : 'Create Project'}
            </button>
            <Link to="/projects" className="btn btn--ghost btn--block">Cancel</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProjectNew
