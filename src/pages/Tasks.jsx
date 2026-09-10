import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import Badge from '../components/common/Badge.jsx'
import Modal from '../components/common/Modal.jsx'
import { statusTone } from '../components/common/statusTone.js'
import { tasks as initialTasks, projects } from '../data/mockData.js'
import {
  ListViewIcon,
  KanbanIcon,
  FolderIcon,
  UserIcon,
  CalendarIcon,
  NoteIcon,
} from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import '../components/common/Button.css'
import '../components/common/Form.css'
import '../components/common/DataTable.css'
import './Tasks.css'

const columns = ['To Do', 'In Progress', 'Review', 'Completed']

const statusSlug = { 'To Do': 'todo', 'In Progress': 'progress', Review: 'review', Completed: 'done' }

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('timeline')

  function updateStatus(id, status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
  }

  const projectGroups = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks
        .filter((t) => t.project === project.name)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      const completedCount = projectTasks.filter((t) => t.status === 'Completed').length
      return { project, projectTasks, completedCount }
    })
  }, [tasks])

  return (
    <div className="tasks-page">
      <PageHeader title="Tasks" subtitle="Timeline of work across every active project">
        <div className="view-toggle">
          <button
            className={`view-toggle__btn${view === 'timeline' ? ' is-active' : ''}`}
            onClick={() => setView('timeline')}
          >
            <ListViewIcon /> Timeline
          </button>
          <button
            className={`view-toggle__btn${view === 'board' ? ' is-active' : ''}`}
            onClick={() => setView('board')}
          >
            <KanbanIcon /> Board
          </button>
        </div>
      </PageHeader>

      {view === 'timeline' ? (
        <div className="project-timeline-list">
          {projectGroups.map(({ project, projectTasks, completedCount }) => (
            <section className="project-timeline-card" key={project.id}>
              <header className="project-timeline-card__head">
                <div className="project-timeline-card__title">
                  <span className="project-timeline-card__icon"><FolderIcon /></span>
                  <div>
                    <h3>{project.name}</h3>
                    <p>
                      {project.client} <span className="project-timeline-card__dot">·</span> Managed by {project.manager}
                    </p>
                  </div>
                </div>
                <div className="project-timeline-card__meta">
                  <Badge tone={statusTone(project.status)}>{project.status}</Badge>
                  <span className="project-timeline-card__range">
                    <CalendarIcon /> {project.startDate} → {project.endDate}
                  </span>
                </div>
              </header>

              <div className="project-timeline-card__progress">
                <div className="project-timeline-card__progress-track">
                  <div style={{ width: `${project.progress}%` }} />
                </div>
                <span>
                  {project.progress}% complete · {completedCount}/{projectTasks.length} tasks done
                </span>
              </div>

              {projectTasks.length > 0 ? (
                <ul className="task-timeline">
                  {projectTasks.map((t) => (
                    <li className={`task-timeline__item is-${statusSlug[t.status]}`} key={t.id}>
                      <span className="task-timeline__dot" />
                      <button className="task-timeline__card" onClick={() => setSelected(t)}>
                        <div className="task-timeline__card-head">
                          <p className="task-timeline__title">{t.title}</p>
                          <Badge tone={statusTone(t.priority)}>{t.priority}</Badge>
                        </div>
                        <p className="task-timeline__range">{t.startDate} → {t.dueDate}</p>
                        <div className="task-timeline__foot">
                          <span className="task-timeline__assignee">
                            <span className="task-timeline__avatar">{initials(t.assignee)}</span>
                            {t.assignee}
                          </span>
                          <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                          {t.comments > 0 && (
                            <span className="task-timeline__comments"><NoteIcon /> {t.comments}</span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tasks-page__empty">No tasks linked to this project yet.</p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="kanban">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col)
            return (
              <div className="kanban__column" key={col}>
                <div className="kanban__column-head">
                  <span>{col}</span>
                  <span className="kanban__column-count">{colTasks.length}</span>
                </div>
                <div className="kanban__cards">
                  {colTasks.map((t) => (
                    <button className="kanban-card" key={t.id} onClick={() => setSelected(t)}>
                      <p className="kanban-card__title">{t.title}</p>
                      <div className="kanban-card__foot">
                        <Badge tone={statusTone(t.priority)}>{t.priority}</Badge>
                        <span className="kanban-card__due">{t.dueDate}</span>
                      </div>
                      <div className="kanban-card__meta">
                        <span className="kanban-card__avatar">{initials(t.assignee)}</span>
                        {t.comments > 0 && <span className="kanban-card__comments">{t.comments} comments</span>}
                      </div>
                    </button>
                  ))}
                  {colTasks.length === 0 && <p className="kanban__empty">No tasks here.</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <>
            <p className="task-detail__description">{selected.description}</p>
            <div className="task-detail-grid">
              <div><span className="kv-label"><FolderIcon /> Project</span><p>{selected.project}</p></div>
              <div><span className="kv-label"><UserIcon /> Assignee</span><p>{selected.assignee}</p></div>
              <div><span className="kv-label">Priority</span><p>{selected.priority}</p></div>
              <div><span className="kv-label"><CalendarIcon /> Start Date</span><p>{selected.startDate}</p></div>
              <div><span className="kv-label"><CalendarIcon /> Due Date</span><p>{selected.dueDate}</p></div>
              <div><span className="kv-label"><NoteIcon /> Comments</span><p>{selected.comments}</p></div>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)}>
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Tasks
