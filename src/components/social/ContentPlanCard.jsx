import Badge from '../common/Badge.jsx'
import { statusTone } from '../common/statusTone.js'
import { CalendarIcon, TrashIcon } from '../icons/Icons.jsx'
import './ContentPlanCard.css'

const typeLabels = {
  image: 'Image',
  carousel: 'Carousel',
  reel: 'Reel',
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ContentPlanCard({ plan, onDelete }) {
  return (
    <div className="plan-card">
      <div className="plan-card__main">
        <div className="plan-card__head">
          <p className="plan-card__title">{plan.title}</p>
          <Badge tone={statusTone(plan.status)}>{plan.status}</Badge>
        </div>
        <p className="plan-card__caption">{plan.caption}</p>
        {plan.hashtags && <p className="plan-card__hashtags">{plan.hashtags}</p>}
      </div>

      <div className="plan-card__side">
        <span className="plan-card__date"><CalendarIcon /> {formatDate(plan.plannedDate)}</span>
        <span className="plan-card__type">{typeLabels[plan.type] ?? plan.type}</span>
        <button type="button" className="plan-card__delete" onClick={() => onDelete(plan.id)} aria-label="Delete plan">
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

export default ContentPlanCard
