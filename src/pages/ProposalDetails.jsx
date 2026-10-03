import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import { useLeads } from '../context/LeadsContext.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import ConvertToClientDrawer from '../components/crm/ConvertToClientDrawer.jsx'
import { ArrowLeftIcon, PlusIcon, SendIcon, TrashIcon } from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import './ProposalDetails.css'
import './ProposalNew.css'

const statusOptions = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired']

function currency(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function lineTotal(item) {
  const qty = Number(item.qty) || 0
  const price = Number(item.price) || 0
  const subtotal = qty * price
  const afterDiscount = subtotal - subtotal * ((Number(item.discount) || 0) / 100)
  return afterDiscount + afterDiscount * ((Number(item.tax) || 0) / 100)
}

let itemSeq = 0
function newItem(item = {}) {
  itemSeq += 1
  return {
    key: `item-${itemSeq}`,
    service: item.service ?? '',
    qty: item.qty ?? 1,
    price: item.price ?? '',
    discount: item.discount ?? 0,
    tax: item.tax ?? 18,
  }
}

function ProposalDetails() {
  const { id } = useParams()
  const { items: proposals, update } = useCrm('proposals')
  const { leads, loaded: leadsLoaded, refresh: refreshLeads } = useLeads()
  const { user } = useAuth()
  const isManager = user?.role === 'sales-manager'
  const [notice, setNotice] = useState(null)
  const [convertOpen, setConvertOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ service: '', items: [] })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const proposal = proposals.find((p) => p.id === id)
  const status = proposal?.status
  const lead = proposal
    ? leads.find((l) => l.company?.trim().toLowerCase() === proposal.company.trim().toLowerCase())
    : undefined

  function changeStatus(next) {
    update(id, { status: next })
  }
  const availableStatuses = statusOptions.includes(status) ? statusOptions : [status, ...statusOptions]

  function handleConvertClick() {
    if (!leadsLoaded) {
      setNotice({ type: 'info', text: 'Loading lead details. Try again in a moment.' })
    } else if (!lead) {
      setNotice({ type: 'error', text: `No lead found for ${proposal.company}. Add the lead before converting this proposal.` })
    } else if (lead.convertedClientId) {
      setNotice({ type: 'info', text: `${proposal.company} is already a client.` })
    } else if (lead.status !== 'Won') {
      setNotice({
        type: 'warning',
        text: `${proposal.company} is still at the "${lead.status}" stage. A client can only be created after the lead is marked Won.`,
      })
    } else {
      setNotice(null)
      setConvertOpen(true)
    }
  }

  function handleConverted(client) {
    refreshLeads()
    if (client) {
      setNotice({ type: 'success', text: `${client.company} is now a client and its first project has been created.` })
      setConvertOpen(false)
    }
  }

  function startEdit() {
    const existing = (proposal.items ?? []).map((item) => newItem(item))
    setDraft({ service: proposal.service ?? '', items: existing.length ? existing : [newItem()] })
    setSaveError('')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setSaveError('')
  }

  function updateDraftItem(key, field, value) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    }))
  }

  function addDraftItem() {
    setDraft((prev) => ({ ...prev, items: [...prev.items, newItem()] }))
  }

  function removeDraftItem(key) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((item) => item.key !== key) : prev.items,
    }))
  }

  async function saveEdit() {
    if (!draft.service.trim()) return setSaveError('Proposal title is required.')
    if (draft.items.length === 0) return setSaveError('Add at least one line item.')
    if (draft.items.some((item) => !item.service.trim() || !(Number(item.price) > 0))) {
      return setSaveError('Every line item needs a description and a price.')
    }

    const items = draft.items.map(({ key: _key, ...item }) => ({
      service: item.service.trim(),
      qty: Number(item.qty) || 1,
      price: Number(item.price),
      discount: Number(item.discount) || 0,
      tax: Number(item.tax) || 0,
    }))
    const total = items.reduce((sum, item) => sum + lineTotal(item), 0)

    setSaving(true)
    setSaveError('')
    try {
      await update(id, { service: draft.service.trim(), items, amount: currency(total) })
      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Could not save the proposal.')
    } finally {
      setSaving(false)
    }
  }

  if (!proposal) {
    return (
      <div className="proposal-details-page">
        <Link to="/proposals" className="back-link"><ArrowLeftIcon /> Back to Proposals</Link>
        <p className="proposal-details__empty">Proposal not found.</p>
      </div>
    )
  }

  const rows = (proposal.items ?? []).map((item) => ({ ...item, withTax: lineTotal(item) }))
  const grandTotal = rows.reduce((sum, r) => sum + r.withTax, 0)
  const draftTotal = draft.items.reduce((sum, item) => sum + lineTotal(item), 0)
  const isLocked = status === 'Accepted'

  return (
    <div className="proposal-details-page">
      <Link to="/proposals" className="back-link"><ArrowLeftIcon /> Back to Proposals</Link>

      <header className="proposal-details__header">
        <div>
          <h1>Proposal #{proposal.id}</h1>
          <p>{proposal.company} — {proposal.service}</p>
        </div>
        <div className="proposal-details__status">
          <Badge tone={statusTone(status)}>{status}</Badge>
          <select
            className="proposal-status-select"
            value={status}
            onChange={(e) => changeStatus(e.target.value)}
            aria-label="Change proposal status"
          >
            {availableStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="proposal-details__card">
        <div className="proposal-details__meta">
          <div><span className="kv-label">Client</span><p>{proposal.company}</p></div>
          <div><span className="kv-label">Created By</span><p>{proposal.createdBy}</p></div>
          <div><span className="kv-label">Date</span><p>{proposal.date}</p></div>
        </div>

        <div className="proposal-details__section-head">
          <h3 className="proposal-details__section-title">Services</h3>
          {editing ? (
            <div className="proposal-details__edit-actions">
              <button className="btn btn--ghost btn--sm" onClick={cancelEdit} disabled={saving}>Cancel</button>
              <button className="btn btn--primary btn--sm" onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button className="btn btn--ghost btn--sm" onClick={startEdit} disabled={isLocked}>
              Edit Proposal
            </button>
          )}
        </div>
        {isLocked && !editing && (
          <p className="proposal-details__lock-note">Accepted proposals are locked. Change the status to edit.</p>
        )}

        {editing ? (
          <>
            <div className="field proposal-details__title-field">
              <label>Proposal Title</label>
              <input value={draft.service} onChange={(e) => setDraft((prev) => ({ ...prev, service: e.target.value }))} />
            </div>

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
                  {draft.items.map((item) => (
                    <tr key={item.key}>
                      <td>
                        <input
                          className="line-items-table__input"
                          value={item.service}
                          onChange={(e) => updateDraftItem(item.key, 'service', e.target.value)}
                          placeholder="e.g. iOS + Android App"
                        />
                      </td>
                      <td>
                        <input
                          className="line-items-table__input is-num"
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateDraftItem(item.key, 'qty', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="line-items-table__input is-num"
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateDraftItem(item.key, 'price', e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td>
                        <input
                          className="line-items-table__input is-num"
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateDraftItem(item.key, 'discount', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="line-items-table__input is-num"
                          type="number"
                          min="0"
                          max="100"
                          value={item.tax}
                          onChange={(e) => updateDraftItem(item.key, 'tax', e.target.value)}
                        />
                      </td>
                      <td className="data-table__strong is-num">{currency(lineTotal(item))}</td>
                      <td>
                        <button
                          type="button"
                          className="line-items-table__remove"
                          onClick={() => removeDraftItem(item.key)}
                          disabled={draft.items.length === 1}
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

            <button type="button" className="btn btn--ghost btn--sm line-items__add" onClick={addDraftItem}>
              <PlusIcon /> Add Line Item
            </button>
            {saveError && <p className="field__error">{saveError}</p>}

            <div className="proposal-details__total">
              <span>Grand Total</span>
              <strong>{currency(draftTotal)}</strong>
            </div>
          </>
        ) : (
          <>
            <div className="data-table-wrap__scroll">
              <table className="data-table proposal-line-items">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="data-table__empty">
                        No line items yet. Click Edit Proposal to add services and prices.
                      </td>
                    </tr>
                  )}
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="data-table__primary">{row.service}</td>
                      <td className="data-table__muted">{row.qty}</td>
                      <td className="data-table__muted">{currency(row.price)}</td>
                      <td className="data-table__muted">{row.discount}%</td>
                      <td className="data-table__muted">{row.tax}%</td>
                      <td className="data-table__strong">{currency(row.withTax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="proposal-details__total">
              <span>Grand Total</span>
              <strong>{currency(grandTotal)}</strong>
            </div>
          </>
        )}

        {(status === 'Accepted' || status === 'Draft') && !editing && (
          <div className="proposal-details__actions">
            {notice && (
              <p className={`proposal-convert-notice proposal-convert-notice--${notice.type}`} role="status">
                {notice.text}
              </p>
            )}
            {status === 'Accepted' ? (
              lead?.convertedClientId ? (
                isManager && <Link to="/clients" className="btn btn--dark">View Client</Link>
              ) : isManager ? (
                <button className="btn btn--dark" onClick={handleConvertClick}>Convert to Client</button>
              ) : (
                <p className="proposal-details__lock-note">Only a sales manager can convert this proposal to a client.</p>
              )
            ) : (
              <button className="btn btn--primary" onClick={() => changeStatus('Sent')}>
                <SendIcon /> Send Proposal
              </button>
            )}
          </div>
        )}
      </div>

      {lead && (
        <ConvertToClientDrawer
          lead={lead}
          open={convertOpen}
          onClose={() => setConvertOpen(false)}
          onConverted={handleConverted}
          defaults={{ projectName: proposal.service, amount: proposal.amount }}
        />
      )}
    </div>
  )
}

export default ProposalDetails
