import { useMemo, useState } from 'react'
import Modal from '../../components/common/Modal.jsx'
import ContentPlanCard from '../../components/social/ContentPlanCard.jsx'
import ContentPlanFormModal from '../../components/social/ContentPlanFormModal.jsx'
import { useContentPlans } from '../../hooks/useContentPlans.js'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../../components/icons/Icons.jsx'

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) {
  return String(n).padStart(2, '0')
}

function dateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

function buildGrid(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i
    const cellMonth = month === 0 ? 11 : month - 1
    const cellYear = month === 0 ? year - 1 : year
    cells.push({ day, month: cellMonth, year: cellYear, muted: true })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, month, year, muted: false })
  }

  let nextDay = 1
  while (cells.length < 42) {
    const cellMonth = month === 11 ? 0 : month + 1
    const cellYear = month === 11 ? year + 1 : year
    cells.push({ day: nextDay, month: cellMonth, year: cellYear, muted: true })
    nextDay += 1
  }

  return cells
}

function SocialCalendar() {
  const { contentPlans, addPlan, deletePlan } = useContentPlans()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [pendingDate, setPendingDate] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const plansByDate = useMemo(() => {
    const map = {}
    contentPlans.forEach((plan) => {
      if (!map[plan.plannedDate]) map[plan.plannedDate] = []
      map[plan.plannedDate].push(plan)
    })
    return map
  }, [contentPlans])

  const cells = useMemo(() => buildGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  function goToToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  function handleAdd(plan) {
    addPlan(plan)
    setPendingDate(null)
  }

  function handleDelete(id) {
    deletePlan(id)
    setSelectedPlan(null)
  }

  return (
    <div className="social-page__section">
      <div className="social-calendar">
        <div className="social-calendar__head">
          <h2 className="social-calendar__title">{monthLabel}</h2>
          <div className="social-calendar__nav">
            <button type="button" className="btn btn--secondary btn--sm" onClick={goToToday}>Today</button>
            <button type="button" className="social-calendar__nav-btn" onClick={goToPrevMonth} aria-label="Previous month">
              <ChevronLeftIcon />
            </button>
            <button type="button" className="social-calendar__nav-btn" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="social-calendar__grid">
          {weekdayLabels.map((label) => (
            <div className="social-calendar__weekday" key={label}>{label}</div>
          ))}

          {cells.map((cell) => {
            const key = dateKey(cell.year, cell.month, cell.day)
            const plans = plansByDate[key] ?? []
            const isToday = key === todayKey

            return (
              <div
                key={key}
                className={`social-calendar__cell${cell.muted ? ' social-calendar__cell--muted' : ''}${isToday ? ' social-calendar__cell--today' : ''}`}
              >
                <div className="social-calendar__cell-head">
                  <span className="social-calendar__day-num">{cell.day}</span>
                  <button
                    type="button"
                    className="social-calendar__add"
                    onClick={() => setPendingDate(key)}
                    aria-label={`Add plan on ${key}`}
                  >
                    <PlusIcon />
                  </button>
                </div>

                <div className="social-calendar__plans">
                  {plans.map((plan) => (
                    <button
                      type="button"
                      key={plan.id}
                      className={`social-calendar__plan social-calendar__plan--${plan.status}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.title}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ContentPlanFormModal
        key={pendingDate ?? 'closed'}
        open={!!pendingDate}
        onClose={() => setPendingDate(null)}
        onSubmit={handleAdd}
        initialDate={pendingDate}
      />

      <Modal open={!!selectedPlan} onClose={() => setSelectedPlan(null)} title="Content Plan" width="520px">
        {selectedPlan && <ContentPlanCard plan={selectedPlan} onDelete={handleDelete} />}
      </Modal>
    </div>
  )
}

export default SocialCalendar
