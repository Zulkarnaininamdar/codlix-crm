import { useAuth } from '../auth/AuthContext.jsx'
import { useLeads } from '../context/LeadsContext.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import { statusTone } from '../components/common/statusTone.js'
import {
  UserIcon,
  BriefcaseIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  FlagIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import './Profile.css'

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="profile-field">
      <span className="profile-field__label">
        <Icon /> {label}
      </span>
      <p className="profile-field__value">{value || '—'}</p>
    </div>
  )
}

function Profile() {
  const { user } = useAuth()
  const { employees } = useLeads()
  const employee = employees.find((e) => e.id === user?.employeeId)

  const name = employee?.name || user?.name
  const role = employee?.role || user?.roleLabel
  const department = employee?.department || user?.department

  return (
    <div className="profile-page">
      <PageHeader title="My Profile" subtitle="Your account and work details" />

      <section className="profile-card profile-card--hero">
        <span className="profile-card__avatar">{initials(name)}</span>
        <div className="profile-card__identity">
          <h2>{name}</h2>
          <p>{role}</p>
        </div>
        {employee?.status && <Badge tone={statusTone(employee.status)}>{employee.status}</Badge>}
      </section>

      <section className="profile-card">
        <h3>Account</h3>
        <div className="profile-grid">
          <Field icon={UserIcon} label="Username" value={user?.username} />
          <Field icon={BriefcaseIcon} label="Role" value={role} />
          <Field icon={FlagIcon} label="Department" value={department} />
        </div>
      </section>

      <section className="profile-card">
        <h3>Contact &amp; Work</h3>
        <div className="profile-grid">
          <Field icon={MailIcon} label="Email" value={employee?.email} />
          <Field icon={PhoneIcon} label="Phone" value={employee?.phone} />
          <Field icon={MapPinIcon} label="Location" value={employee?.location} />
          <Field icon={CalendarIcon} label="Join Date" value={employee?.joinDate} />
          <Field icon={UserIcon} label="Reporting To" value={employee?.reportingTo} />
        </div>
      </section>
    </div>
  )
}

export default Profile
