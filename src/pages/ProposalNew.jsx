import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { companies, employees, proposals } from '../data/mockData.js'
import {
  ArrowLeftIcon,
  BuildingIcon,
  ProposalsIcon,
  ListViewIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/Form.css'
import '../components/common/DataTable.css'
import './ProposalNew.css'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function currency(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function nextProposalId() {
  const year = new Date().getFullYear()
  const seq = proposals.filter((p) => p.id.includes(String(year))).length + 1
  return `CT-${year}-${String(seq).padStart(3, '0')}`
}

let itemSeq = 0
function emptyItem() {
  itemSeq += 1
  return { key: `item-${itemSeq}`, service: '', qty: 1, price: '', discount: 0, tax: 18 }
}

const initialForm = {
  company: '',
  service: '',
  createdBy: employees[0]?.name ?? '',
  date: todayISO(),
}

const requiredFields = [
  { key: 'company', label: 'Client company' },
  { key: 'service', label: 'Proposal title' },
  { key: 'createdBy', label: 'Created by' },
]

function ProposalNew() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([emptyItem()])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const proposalId = useMemo(() => nextProposalId(), [])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateItem(key, field, value) {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeItem(key) {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.key !== key) : prev))
  }

  const rows = items.map((item) => {
    const qty = Number(item.qty) || 0
    const price = Number(item.price) || 0
    const subtotal = qty * price
    const afterDiscount = subtotal - subtotal * ((Number(item.discount) || 0) / 100)
    const withTax = afterDiscount + afterDiscount * ((Number(item.tax) || 0) / 100)
    return { ...item, withTax }
  })
  const grandTotal = rows.reduce((sum, r) => sum + r.withTax, 0)
  const validItemCount = items.filter((i) => i.service.trim() && Number(i.price) > 0).length

  const completedCount = requiredFields.filter((f) => form[f.key].trim()).length + (validItemCount > 0 ? 1 : 0)
  const totalRequired = requiredFields.length + 1
  const progress = Math.round((completedCount / totalRequired) * 100)

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.company.trim()) nextErrors.company = 'Select a client company.'
    if (!form.service.trim()) nextErrors.service = 'Give this proposal a title.'
    if (!form.createdBy.trim()) nextErrors.createdBy = 'Select who is creating this proposal.'
    if (validItemCount === 0) nextErrors.items = 'Add at least one line item with a service and price.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate('/proposals')
    }, 900)
  }

  return (
    <div className="proposal-new-page">
      <Link to="/proposals" className="back-link">
        <ArrowLeftIcon /> Back to Proposals
      </Link>

      <PageHeader title="Create Proposal" subtitle="Build a line-item quote and send it for approval" />

      <div className="proposal-new__progress">
        <div className="proposal-new__progress-track">
          <div className="proposal-new__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="proposal-new__progress-label">
          {completedCount} of {totalRequired} required sections completed
        </span>
      </div>

      <div className="proposal-new__layout">
        <form id="proposal-form" className="proposal-new__form" onSubmit={handleSubmit} noValidate>
          <div className="form-card">
            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><BuildingIcon /></span>
                Proposal Details
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label>Client Company<span className="required">*</span></label>
                  <select value={form.company} onChange={(e) => set('company', e.target.value)}>
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.company && <span className="field__error">{errors.company}</span>}
                </div>
                <div className="field">
                  <label>Proposal Title<span className="required">*</span></label>
                  <input value={form.service} onChange={(e) => set('service', e.target.value)} placeholder="e.g. Mobile App Development" />
                  {errors.service && <span className="field__error">{errors.service}</span>}
                </div>
                <div className="field">
                  <label>Created By<span className="required">*</span></label>
                  <select value={form.createdBy} onChange={(e) => set('createdBy', e.target.value)}>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>{emp.name} — {emp.role}</option>
                    ))}
                  </select>
                  {errors.createdBy && <span className="field__error">{errors.createdBy}</span>}
                </div>
                <div className="field">
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><ListViewIcon /></span>
                Line Items
              </h3>

              <div className="line-items-wrap">
                <table className="data-table line-items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="is-num">Qty</th>
                      <th className="is-num">Price</th>
                      <th className="is-num">Discount %</th>
                      <th className="is-num">Tax %</th>
                      <th className="is-num">Total</th>
                      <th className="line-items-table__action-col" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.key}>
                        <td>
                          <input
                            className="line-items-table__input"
                            value={row.service}
                            onChange={(e) => updateItem(row.key, 'service', e.target.value)}
                            placeholder="e.g. iOS + Android App"
                          />
                        </td>
                        <td>
                          <input
                            className="line-items-table__input is-num"
                            type="number"
                            min="1"
                            value={row.qty}
                            onChange={(e) => updateItem(row.key, 'qty', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="line-items-table__input is-num"
                            type="number"
                            min="0"
                            value={row.price}
                            onChange={(e) => updateItem(row.key, 'price', e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <input
                            className="line-items-table__input is-num"
                            type="number"
                            min="0"
                            max="100"
                            value={row.discount}
                            onChange={(e) => updateItem(row.key, 'discount', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="line-items-table__input is-num"
                            type="number"
                            min="0"
                            max="100"
                            value={row.tax}
                            onChange={(e) => updateItem(row.key, 'tax', e.target.value)}
                          />
                        </td>
                        <td className="data-table__strong is-num">{currency(row.withTax)}</td>
                        <td>
                          <button
                            type="button"
                            className="line-items-table__remove"
                            onClick={() => removeItem(row.key)}
                            disabled={items.length === 1}
                            aria-label="Remove line item"
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.items && <span className="field__error">{errors.items}</span>}

              <button type="button" className="btn btn--ghost btn--sm line-items__add" onClick={addItem}>
                <PlusIcon /> Add Line Item
              </button>

              <div className="proposal-new__total">
                <span>Grand Total</span>
                <strong>{currency(grandTotal)}</strong>
              </div>
            </div>
          </div>

          <div className="form-actions proposal-new__mobile-actions">
            <Link to="/proposals" className="btn btn--ghost">Cancel</Link>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Proposal'}
            </button>
          </div>
        </form>

        <aside className="proposal-new__side">
          <div className="proposal-preview-card">
            <span className="proposal-preview-card__label">Live Preview</span>
            <div className="proposal-preview-card__icon"><ProposalsIcon /></div>
            <h4 className="proposal-preview-card__id">{proposalId}</h4>
            <p className="proposal-preview-card__title">{form.service || 'Untitled proposal'}</p>

            <div className="proposal-preview-card__badges">
              <Badge tone={statusTone('draft')}>Draft</Badge>
              {form.company && <Badge tone="outline">{form.company}</Badge>}
            </div>

            <dl className="proposal-preview-card__meta">
              <div>
                <dt>Line items</dt>
                <dd>{validItemCount}</dd>
              </div>
              <div>
                <dt>Created by</dt>
                <dd>{form.createdBy || '—'}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{form.date}</dd>
              </div>
            </dl>

            <div className="proposal-preview-card__grand-total">
              <span>Grand Total</span>
              <strong>{currency(grandTotal)}</strong>
            </div>
          </div>

          <div className="lead-checklist-card">
            <h4>Required sections</h4>
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
              <li className={validItemCount > 0 ? 'is-done' : ''}>
                <CheckCircleIcon />
                At least one line item
              </li>
            </ul>
          </div>

          <div className="proposal-new__side-actions">
            <button form="proposal-form" type="submit" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Saving…' : 'Save Proposal'}
            </button>
            <Link to="/proposals" className="btn btn--ghost btn--block">Cancel</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProposalNew
