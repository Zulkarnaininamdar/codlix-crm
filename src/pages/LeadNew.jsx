import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  ArrowLeftIcon,
  BuildingIcon,
  ContactsIcon,
  SalesIcon,
  NoteIcon,
  CheckCircleIcon,
  GlobeIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  WhatsappIcon,
  LinkedinIcon,
  BudgetIcon,
  CalendarIcon,
  UserIcon,
  BriefcaseIcon,
  TrendUpIcon,
  ProposalsIcon,
  InstagramIcon,
  FacebookIcon,
  StarIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/Form.css'
import './LeadNew.css'

const sources = ['LinkedIn', 'Cold Email', 'Referral', 'Website', 'WhatsApp', 'Other']
const priorities = ['Low', 'Medium', 'High', 'Urgent']
const socialPerformanceLevels = ['Not Active', 'Poor', 'Average', 'Good', 'Excellent']

const initialForm = {
  companyName: '',
  industry: '',
  country: '',
  city: '',
  address: '',
  contactPerson: '',
  designation: '',
  phone: '',
  whatsapp: '',
  email: '',
  linkedin: '',
  leadSource: '',
  service: '',
  priority: 'Medium',
  budget: '',
  closingDate: '',
  hasWebsite: '',
  websiteUrl: '',
  hasInstagram: '',
  instagramHandle: '',
  hasFacebook: '',
  facebookPage: '',
  socialPerformance: '',
  googleReviews: '',
  assignedTo: '',
  notes: '',
}

const requiredFields = [
  { key: 'companyName', label: 'Company name' },
  { key: 'contactPerson', label: 'Contact person' },
  { key: 'phone', label: 'Phone number' },
  { key: 'leadSource', label: 'Lead source' },
]

function initials(name) {
  const trimmed = name.trim()
  if (!trimmed) return '—'
  return trimmed.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function LeadNew() {
  const navigate = useNavigate()
  const { user, executives } = useAuth()
  const { addLead } = useLeads()
  const isManager = user?.role === 'sales-manager'
  const salesExecutives = useMemo(() => executives.filter((e) => e.active), [executives])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const completedCount = useMemo(
    () => requiredFields.filter((f) => form[f.key].trim()).length,
    [form]
  )
  const progress = Math.round((completedCount / requiredFields.length) * 100)

  async function handleSubmit(e) {
    e.preventDefault()
    const required = {
      companyName: 'Company name is required.',
      contactPerson: 'Contact person is required.',
      phone: 'Phone number is required.',
      leadSource: 'Lead source is required.',
    }
    const nextErrors = {}
    Object.entries(required).forEach(([key, message]) => {
      if (!form[key].trim()) nextErrors[key] = message
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setSubmitError('')
    try {
      await addLead({
        company: form.companyName,
        website: form.hasWebsite === 'Yes' ? form.websiteUrl : '',
        industry: form.industry,
        country: form.country,
        city: form.city,
        address: form.address,
        contactName: form.contactPerson,
        designation: form.designation,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        linkedin: form.linkedin,
        source: form.leadSource,
        service: form.service,
        priority: form.priority,
        budget: form.budget,
        closingDate: form.closingDate,
        hasInstagram: form.hasInstagram === 'Yes',
        instagramHandle: form.instagramHandle,
        hasFacebook: form.hasFacebook === 'Yes',
        facebookPage: form.facebookPage,
        socialPerformance: form.socialPerformance,
        googleReviews: form.googleReviews,
        status: 'New',
        notes: form.notes,
        assignedTo: isManager ? form.assignedTo : undefined,
      })
      navigate('/leads')
    } catch (err) {
      setSubmitError(err.message || 'Could not save the lead.')
    } finally {
      setSaving(false)
    }
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
                <div className="field field--full">
                  <label>Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="Street, building, area, landmark"
                  />
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
                  <label>WhatsApp Number</label>
                  <div className="lead-field__control">
                    <WhatsappIcon className="lead-field__icon" />
                    <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="e.g. +971 55 123 4567" />
                  </div>
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
                {isManager && (
                  <div className="field">
                    <label>Assigned Employee</label>
                    <div className="lead-field__control">
                      <UserIcon className="lead-field__icon" />
                      <select value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)}>
                        <option value="">Unassigned</option>
                        {salesExecutives.map((exec) => (
                          <option key={exec.username} value={exec.employeeId}>{exec.name}</option>
                        ))}
                        {user?.employeeId && <option value={user.employeeId}>{user.name} (me)</option>}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">
                <span className="form-section__title-icon"><GlobeIcon /></span>
                Digital Presence
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label>Has Website?</label>
                  <div className="toggle-pill-group">
                    {['Yes', 'No'].map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={`toggle-pill${form.hasWebsite === v ? ' is-active' : ''}`}
                        onClick={() => set('hasWebsite', v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                {form.hasWebsite === 'Yes' && (
                  <div className="field">
                    <label>Website URL</label>
                    <div className="lead-field__control">
                      <GlobeIcon className="lead-field__icon" />
                      <input value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} placeholder="e.g. abctrading.ae" />
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Has Instagram?</label>
                  <div className="toggle-pill-group">
                    {['Yes', 'No'].map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={`toggle-pill${form.hasInstagram === v ? ' is-active' : ''}`}
                        onClick={() => set('hasInstagram', v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                {form.hasInstagram === 'Yes' && (
                  <div className="field">
                    <label>Instagram Handle</label>
                    <div className="lead-field__control">
                      <InstagramIcon className="lead-field__icon" />
                      <input value={form.instagramHandle} onChange={(e) => set('instagramHandle', e.target.value)} placeholder="e.g. @abctrading" />
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Has Facebook?</label>
                  <div className="toggle-pill-group">
                    {['Yes', 'No'].map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={`toggle-pill${form.hasFacebook === v ? ' is-active' : ''}`}
                        onClick={() => set('hasFacebook', v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                {form.hasFacebook === 'Yes' && (
                  <div className="field">
                    <label>Facebook Page</label>
                    <div className="lead-field__control">
                      <FacebookIcon className="lead-field__icon" />
                      <input value={form.facebookPage} onChange={(e) => set('facebookPage', e.target.value)} placeholder="e.g. facebook.com/abctrading" />
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Social Media Performance</label>
                  <div className="lead-field__control">
                    <TrendUpIcon className="lead-field__icon" />
                    <select value={form.socialPerformance} onChange={(e) => set('socialPerformance', e.target.value)}>
                      <option value="">Select performance</option>
                      {socialPerformanceLevels.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Google Reviews</label>
                  <div className="lead-field__control">
                    <StarIcon className="lead-field__icon" />
                    <input
                      type="number"
                      min="0"
                      value={form.googleReviews}
                      onChange={(e) => set('googleReviews', e.target.value)}
                      placeholder="e.g. 125"
                    />
                  </div>
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

          {submitError && <span className="field__error">{submitError}</span>}

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
                <dt>WhatsApp</dt>
                <dd>{form.whatsapp || '—'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{form.email || '—'}</dd>
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
