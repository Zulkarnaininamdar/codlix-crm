import { useState } from 'react'
import Drawer from '../common/Drawer.jsx'
import { api, ApiError } from '../../api/client.js'
import { useLeads } from '../../context/LeadsContext.jsx'
import '../common/Form.css'
import './ConvertToClientDrawer.css'

const CLIENT_FIELDS = [
  { key: 'company', label: 'Company', required: true, full: true },
  { key: 'contactName', label: 'Contact Person' },
  { key: 'designation', label: 'Designation' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'industry', label: 'Industry' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'address', label: 'Address', full: true },
  { key: 'website', label: 'Website' },
]

/** Turns a failed conversion into a message the user can act on. */
function conversionError(err) {
  if (!(err instanceof ApiError)) return 'Could not reach the server. Check your connection and try again.'
  if (err.status === 401) return 'Your session has expired. Please sign in again.'
  if (err.status === 403) return 'Your role is not allowed to convert leads.'
  if (err.status === 404) return 'This lead no longer exists or is not assigned to you.'
  if (err.status === 409) return 'This lead is already a client. Refresh the page to see the Client link.'
  if (err.status === 422) return err.message
  if (err.status >= 500) return 'The server had a problem converting this lead. Please try again.'
  return err.message || 'Could not convert this lead.'
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function initialFrom(lead, employees, defaults) {
  const owner = employees.find((e) => e.id === lead.assignedTo)?.name ?? ''
  return {
    ...Object.fromEntries(CLIENT_FIELDS.map((f) => [f.key, lead[f.key] ?? ''])),
    projectName: defaults.projectName ?? '',
    manager: owner,
    startDate: todayISO(),
    endDate: '',
    amount: defaults.amount ?? lead.budget ?? '',
  }
}

/**
 * Converts a Won lead into a client and creates the client's first project.
 * `defaults` lets the caller pre-fill the project (e.g. the accepted proposal's service and amount).
 */
function ConvertToClientDrawer({ lead, open, onClose, onConverted, defaults = {} }) {
  const { employees } = useLeads()
  const [form, setForm] = useState(() => initialFrom(lead, employees, defaults))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function close() {
    setForm(initialFrom(lead, employees, defaults))
    setError('')
    onClose()
  }

  const notWon = lead.status !== 'Won'

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    if (notWon) {
      setError(`This lead is ${lead.status || 'not Won'} yet. Move it to Won before converting.`)
      return
    }
    if (!form.company.trim()) return setError('Company name is required.')
    if (!form.projectName.trim()) return setError('Project name is required.')
    if (!form.manager.trim()) return setError('Select a project manager.')
    if (!form.endDate) return setError('Project end date is required.')

    setSaving(true)
    setError('')
    const clientBody = {
      ...Object.fromEntries(CLIENT_FIELDS.map((f) => [f.key, form[f.key]])),
      revenue: form.amount,
    }

    let client
    try {
      client = await api(`/crm/leads/${encodeURIComponent(lead.id)}/convert`, { method: 'POST', body: clientBody })
    } catch (err) {
      setError(conversionError(err))
      setSaving(false)
      // The lead changed under us (already converted, or no longer visible): reload so the buttons are right.
      if (err instanceof ApiError && (err.status === 404 || err.status === 409)) onConverted?.(null)
      return
    }

    try {
      await api('/crm/projects', {
        method: 'POST',
        body: {
          name: form.projectName.trim(),
          client: client.company,
          manager: form.manager,
          startDate: form.startDate,
          endDate: form.endDate,
          progress: 0,
          status: 'Active',
          amount: form.amount,
        },
      })
    } catch (err) {
      setSaving(false)
      setError(`Client was created, but the project could not be saved (${err.message}). Add it from Projects.`)
      onConverted?.(client)
      return
    }

    setSaving(false)
    onConverted?.(client)
    close()
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Convert to Client"
      footer={
        <>
          <button className="btn btn--ghost btn--block" onClick={close} disabled={saving}>Cancel</button>
          <button type="submit" form="convert-client-form" className="btn btn--primary btn--block" disabled={saving || notWon}>
            {saving ? 'Converting…' : 'Convert to Client'}
          </button>
        </>
      }
    >
      <form id="convert-client-form" onSubmit={submit} noValidate>
        <p className="convert-client__note">
          {lead.company} is a Won deal. Confirm the client details and the first project below.
        </p>

        <h4 className="convert-client__section">Client details</h4>
        <div className="form-grid">
          {CLIENT_FIELDS.map((f) => (
            <div className={`field${f.full ? ' field--full' : ''}`} key={f.key}>
              <label>{f.label}{f.required && <span className="required">*</span>}</label>
              <input type={f.type ?? 'text'} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          ))}
        </div>

        <h4 className="convert-client__section">First project</h4>
        <div className="form-grid">
          <div className="field field--full">
            <label>Project Name<span className="required">*</span></label>
            <input value={form.projectName} onChange={(e) => set('projectName', e.target.value)} placeholder="e.g. Website Revamp" />
          </div>
          <div className="field field--full">
            <label>Project Manager<span className="required">*</span></label>
            <select value={form.manager} onChange={(e) => set('manager', e.target.value)}>
              <option value="">Select manager</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </div>
          <div className="field">
            <label>End Date<span className="required">*</span></label>
            <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
          </div>
          <div className="field field--full">
            <label>Project Amount</label>
            <input value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="e.g. ₹5.2L" />
          </div>
        </div>

        {error && <p className="convert-client__error" role="alert">{error}</p>}
      </form>
    </Drawer>
  )
}

export default ConvertToClientDrawer
