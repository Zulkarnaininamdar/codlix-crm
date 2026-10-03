import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/common/Tabs.jsx'
import Badge from '../components/common/Badge.jsx'
import Drawer from '../components/common/Drawer.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { useCrm } from '../hooks/useCrm.js'
import { useLeads } from '../context/LeadsContext.jsx'
import {
  ArrowLeftIcon,
  FolderIcon,
  BuildingIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  TasksIcon,
  EmployeesIcon,
  TrendUpIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PlusIcon,
  NoteIcon,
  TrashIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/Button.css'
import '../components/common/DataTable.css'
import '../components/common/Form.css'
import './CompanyDetails.css'
import './ProjectDetails.css'

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'team', label: 'Team' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'files', label: 'Files' },
]

const priorities = ['Low', 'Medium', 'High', 'Urgent']

const emptyTask = { title: '', assignee: '', priority: 'Medium', dueDate: '' }

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function ProjectDetails() {
  const { id } = useParams()
  const { employees } = useLeads()
  const { items: projects, update: updateProject } = useCrm('projects')
  const { items: projectTasks, create: createTask } = useCrm('tasks', { parentId: id })
  const { items: companies } = useCrm('companies')
  const [tab, setTab] = useState('overview')
  const project = projects.find((p) => p.id === id)

  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const [taskForm, setTaskForm] = useState(emptyTask)

  const [teamDrawerOpen, setTeamDrawerOpen] = useState(false)
  const [teamMemberId, setTeamMemberId] = useState('')

  const [fileDrawerOpen, setFileDrawerOpen] = useState(false)
  const [fileName, setFileName] = useState('')

  if (!project) {
    return (
      <div className="company-details-page">
        <Link to="/projects" className="back-link"><ArrowLeftIcon /> Back to Projects</Link>
        <p className="company-details__not-found">Project not found.</p>
      </div>
    )
  }

  const teamIds = project.teamIds ?? []
  const files = project.files ?? []
  const baseTeam = employees.filter((e) => [project.manager, ...projectTasks.map((t) => t.assignee)].includes(e.name))
  const team = [...baseTeam, ...employees.filter((e) => teamIds.includes(e.id) && !baseTeam.some((b) => b.id === e.id))]
  const availableEmployees = employees.filter((e) => !team.some((m) => m.id === e.id))
  const relatedCompany = companies.find((c) => c.name === project.client)
  const completedTasks = projectTasks.filter((t) => t.status === 'Completed').length

  async function addTask(e) {
    e.preventDefault()
    if (!taskForm.title.trim() || !taskForm.assignee) return
    await createTask({
      title: taskForm.title,
      projectId: project.id,
      project: project.name,
      assignee: taskForm.assignee,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || '—',
      status: 'To Do',
      comments: 0,
    })
    setTaskForm(emptyTask)
    setTaskDrawerOpen(false)
  }

  async function addTeamMember(e) {
    e.preventDefault()
    if (!teamMemberId) return
    await updateProject(project.id, { teamIds: [...teamIds, teamMemberId] })
    setTeamMemberId('')
    setTeamDrawerOpen(false)
  }

  async function addFile(e) {
    e.preventDefault()
    if (!fileName.trim()) return
    const entry = { id: `file-${Date.now()}`, name: fileName.trim(), addedAt: new Date().toLocaleDateString('en-IN') }
    await updateProject(project.id, { files: [entry, ...files] })
    setFileName('')
    setFileDrawerOpen(false)
  }

  async function removeFile(fileId) {
    await updateProject(project.id, { files: files.filter((f) => f.id !== fileId) })
  }

  return (
    <div className="company-details-page">
      <Link to="/projects" className="back-link"><ArrowLeftIcon /> Back to Projects</Link>

      <header className="company-details__header">
        <div className="company-details__heading">
          <span className="company-details__avatar">{initials(project.name)}</span>
          <div>
            <div className="company-details__title-row">
              <h1>{project.name}</h1>
              <Badge tone={statusTone(project.status)}>{project.status}</Badge>
            </div>
            <div className="company-details__meta">
              <span><span className="company-details__meta-label">Client</span> {project.client}</span>
              <span><span className="company-details__meta-label">Manager</span> {project.manager}</span>
              <span><span className="company-details__meta-label">Timeline</span> {project.startDate} → {project.endDate}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="project-details__progress">
        <div className="project-details__progress-bar">
          <div style={{ width: `${project.progress}%` }} />
        </div>
        <span>Progress: {project.progress}%</span>
      </div>

      <div className="company-details__body">
        <div className="company-details__main">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <section className="company-details__card">
            {tab === 'overview' && (
              <div className="info-grid">
                <div className="info-block">
                  <h4>Timeline</h4>
                  <ul>
                    <li><CalendarIcon /> Start: {project.startDate}</li>
                    <li><CalendarIcon /> End: {project.endDate}</li>
                  </ul>
                </div>
                <div className="info-block">
                  <h4>Delivery</h4>
                  <ul>
                    <li><UserIcon /> {project.manager}</li>
                    <li><FlagIcon /> {project.status}</li>
                  </ul>
                </div>

                <div className="info-tiles field--full">
                  <div className="info-tile">
                    <span className="info-tile__label"><TasksIcon /> Total Tasks</span>
                    <span className="info-tile__value">{projectTasks.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><CheckCircleIcon /> Completed</span>
                    <span className="info-tile__value">{completedTasks}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><EmployeesIcon /> Team Size</span>
                    <span className="info-tile__value">{team.length}</span>
                  </div>
                  <div className="info-tile">
                    <span className="info-tile__label"><TrendUpIcon /> Progress</span>
                    <span className="info-tile__value">{project.progress}%</span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'tasks' && (
              <>
                <div className="activity-composer">
                  <button type="button" className="btn btn--secondary btn--sm" onClick={() => setTaskDrawerOpen(true)}>
                    <PlusIcon /> Create Task
                  </button>
                </div>

                {projectTasks.length > 0 ? (
                  <table className="data-table">
                    <thead><tr><th>Task</th><th>Assignee</th><th>Priority</th><th>Due Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {projectTasks.map((t) => (
                        <tr key={t.id}>
                          <td className="data-table__primary">{t.title}</td>
                          <td className="data-table__muted">{t.assignee}</td>
                          <td className="data-table__muted">{t.priority}</td>
                          <td className="data-table__muted">{t.dueDate}</td>
                          <td><Badge tone={statusTone(t.status)}>{t.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="company-details__empty">No tasks linked to this project yet.</p>}
              </>
            )}

            {tab === 'team' && (
              <>
                <div className="activity-composer">
                  <button type="button" className="btn btn--secondary btn--sm" onClick={() => setTeamDrawerOpen(true)}>
                    <PlusIcon /> Add Team Member
                  </button>
                </div>

                {team.length > 0 ? (
                  <ul className="simple-list">
                    {team.map((e) => (
                      <li key={e.id}>
                        <div className="data-table__avatar">{initials(e.name)}</div>
                        <div>
                          <p className="data-table__primary">{e.name}</p>
                          <p className="data-table__secondary">{e.role}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="company-details__empty">No team members assigned yet.</p>}
              </>
            )}

            {tab === 'timeline' && (
              <ul className="timeline">
                <li className="timeline__item">
                  <span className="timeline__icon"><CalendarIcon /></span>
                  <div>
                    <p className="timeline__date">Started</p>
                    <p className="timeline__text">Project started on {project.startDate}.</p>
                  </div>
                </li>
                <li className="timeline__item">
                  <span className="timeline__icon"><TrendUpIcon /></span>
                  <div>
                    <p className="timeline__date">In Progress</p>
                    <p className="timeline__text">Currently at {project.progress}% completion.</p>
                  </div>
                </li>
                <li className="timeline__item">
                  <span className="timeline__icon timeline__icon--system"><FlagIcon /></span>
                  <div>
                    <p className="timeline__date">Target</p>
                    <p className="timeline__text">Target delivery: {project.endDate}.</p>
                  </div>
                </li>
              </ul>
            )}

            {tab === 'files' && (
              <>
                <div className="activity-composer">
                  <button type="button" className="btn btn--secondary btn--sm" onClick={() => setFileDrawerOpen(true)}>
                    <PlusIcon /> Add File
                  </button>
                </div>

                {files.length > 0 ? (
                  <ul className="file-list">
                    {files.map((f) => (
                      <li className="file-list__item" key={f.id}>
                        <span className="file-list__icon"><NoteIcon /></span>
                        <div className="file-list__body">
                          <p className="data-table__primary">{f.name}</p>
                          <p className="data-table__secondary">Added {f.addedAt}</p>
                        </div>
                        <button
                          type="button"
                          className="file-list__remove"
                          onClick={() => removeFile(f.id)}
                          aria-label={`Remove ${f.name}`}
                        >
                          <TrashIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="company-details__empty">
                    <FolderIcon style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle' }} />
                    No files uploaded yet.
                  </p>
                )}
              </>
            )}
          </section>
        </div>

        <aside className="company-details__rail">
          <section className="company-details__card">
            <h3>Project Snapshot</h3>
            <ul className="kv-list">
              <li>
                <span className="kv-label"><FlagIcon /> Status</span>
                <p>{project.status}</p>
              </li>
              <li>
                <span className="kv-label"><UserIcon /> Manager</span>
                <p>{project.manager}</p>
              </li>
              <li>
                <span className="kv-label"><CalendarIcon /> Start Date</span>
                <p>{project.startDate}</p>
              </li>
              <li>
                <span className="kv-label"><CalendarIcon /> End Date</span>
                <p>{project.endDate}</p>
              </li>
              <li>
                <span className="kv-label"><TasksIcon /> Total Tasks</span>
                <p>{projectTasks.length}</p>
              </li>
              <li>
                <span className="kv-label"><EmployeesIcon /> Team Size</span>
                <p>{team.length}</p>
              </li>
            </ul>
          </section>

          {relatedCompany && (
            <section className="company-details__card">
              <h3>Related</h3>
              <Link to={`/companies/${relatedCompany.id}`} className="related-company-card">
                <span className="related-company-card__icon"><BuildingIcon /></span>
                <div>
                  <p className="data-table__primary">{relatedCompany.name}</p>
                  <p className="data-table__secondary">View company profile</p>
                </div>
                <ChevronRightIcon className="related-company-card__chevron" />
              </Link>
            </section>
          )}
        </aside>
      </div>

      <Drawer
        open={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        title="Create Task"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setTaskDrawerOpen(false)}>Cancel</button>
            <button type="submit" form="create-task-form" className="btn btn--primary btn--block">Create Task</button>
          </>
        }
      >
        <form id="create-task-form" onSubmit={addTask} noValidate>
          <div className="field">
            <label>Task Title<span className="required">*</span></label>
            <input
              value={taskForm.title}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Set up staging environment"
            />
          </div>
          <div className="field">
            <label>Assignee<span className="required">*</span></label>
            <select
              value={taskForm.assignee}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, assignee: e.target.value }))}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>{emp.name} — {emp.role}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select
              value={taskForm.priority}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Due Date</label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
        </form>
      </Drawer>

      <Drawer
        open={teamDrawerOpen}
        onClose={() => setTeamDrawerOpen(false)}
        title="Add Team Member"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setTeamDrawerOpen(false)}>Cancel</button>
            <button type="submit" form="add-team-form" className="btn btn--primary btn--block">Add Member</button>
          </>
        }
      >
        <form id="add-team-form" onSubmit={addTeamMember} noValidate>
          <div className="field">
            <label>Employee<span className="required">*</span></label>
            <select value={teamMemberId} onChange={(e) => setTeamMemberId(e.target.value)}>
              <option value="">Select employee</option>
              {availableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} — {emp.role}</option>
              ))}
            </select>
            {availableEmployees.length === 0 && (
              <span className="field__error">All employees are already on this project.</span>
            )}
          </div>
        </form>
      </Drawer>

      <Drawer
        open={fileDrawerOpen}
        onClose={() => setFileDrawerOpen(false)}
        title="Add File"
        footer={
          <>
            <button className="btn btn--ghost btn--block" onClick={() => setFileDrawerOpen(false)}>Cancel</button>
            <button type="submit" form="add-file-form" className="btn btn--primary btn--block">Add File</button>
          </>
        }
      >
        <form id="add-file-form" onSubmit={addFile} noValidate>
          <div className="field">
            <label>File Name<span className="required">*</span></label>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Project Scope Document.pdf"
            />
          </div>
        </form>
      </Drawer>
    </div>
  )
}

export default ProjectDetails
