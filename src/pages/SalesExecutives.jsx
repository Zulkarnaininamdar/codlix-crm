import { useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import Drawer from '../components/common/Drawer.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { PlusIcon } from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import '../components/common/Badge.css'
import './SalesExecutives.css'

const emptyForm = { name: '', email: '', phone: '', username: '', password: '' }

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function SalesExecutives() {
  const { executives, addExecutive, setExecutiveActive } = useAuth()
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  async function submitExecutive(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      setError('Name, username and password are required.')
      return
    }
    setSaving(true)
    try {
      await addExecutive(form)
      setForm(emptyForm)
      setAddOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(exec) {
    await setExecutiveActive(exec.username, !exec.active)
  }

  return (
    <div className="sales-executives-page">
      <PageHeader title="Team" subtitle="Manage Sales Executive accounts and access">
        <button className="btn btn--primary" onClick={() => setAddOpen(true)}>
          <PlusIcon /> Add Sales Executive
        </button>
      </PageHeader>

      <div className="data-table-wrap">
        <div className="data-table-wrap__toolbar">
          <div className="data-table-wrap__toolbar-title">
            <h3>Sales Executives</h3>
            <span>{executives.length} account{executives.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="data-table-wrap__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Executive</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {executives.map((exec) => (
                <tr key={exec.username}>
                  <td>
                    <div className="data-table__who">
                      <span className="data-table__avatar">{initials(exec.name)}</span>
                      <div>
                        <p className="data-table__primary">{exec.name}</p>
                        {exec.email && <p className="data-table__secondary">{exec.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="data-table__muted">{exec.username}</td>
                  <td className="data-table__muted">{exec.phone || '—'}</td>
                  <td>
                    <Badge tone={statusTone(exec.active ? 'active' : 'inactive')}>
                      {exec.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn--sm ${exec.active ? 'btn--ghost' : 'btn--primary'}`}
                      onClick={() => toggleActive(exec)}
                    >
                      {exec.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {executives.length === 0 && (
            <div className="data-table__empty">No Sales Executive accounts yet.</div>
          )}
        </div>
      </div>

      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Sales Executive"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setAddOpen(false)}>Cancel</button>
            <button type="submit" form="add-executive-form" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Creating…' : 'Create Account'}
            </button>
          </>
        }
      >
        <form id="add-executive-form" onSubmit={submitExecutive} noValidate>
          <div className="field">
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Neha Kapoor" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@codlixtech.in" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98200 00000" />
          </div>
          <div className="field">
            <label>Username</label>
            <input value={form.username} onChange={(e) => set('username', e.target.value)} placeholder="e.g. neha" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Temporary password" />
          </div>
          {error && <span className="field__error">{error}</span>}
        </form>
      </Drawer>
    </div>
  )
}

export default SalesExecutives
