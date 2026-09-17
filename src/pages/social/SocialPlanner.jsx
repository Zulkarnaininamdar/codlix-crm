import { useState } from 'react'
import ContentPlanCard from '../../components/social/ContentPlanCard.jsx'
import ContentPlanFormModal from '../../components/social/ContentPlanFormModal.jsx'
import { useContentPlans } from '../../hooks/useContentPlans.js'
import { PlusIcon } from '../../components/icons/Icons.jsx'

function SocialPlanner() {
  const { contentPlans, addPlan, deletePlan } = useContentPlans()
  const [addOpen, setAddOpen] = useState(false)

  function handleAdd(plan) {
    addPlan(plan)
    setAddOpen(false)
  }

  return (
    <div className="social-page__section">
      <div className="social-page__planner-head">
        <div>
          <h2>Content Plans</h2>
          <p>Draft, schedule and track upcoming Instagram posts</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAddOpen(true)}>
          <PlusIcon /> New Plan
        </button>
      </div>

      {contentPlans.length > 0 ? (
        <div className="social-page__planner-list">
          {contentPlans.map((plan) => (
            <ContentPlanCard key={plan.id} plan={plan} onDelete={deletePlan} />
          ))}
        </div>
      ) : (
        <p className="social-page__empty">No content plans yet. Create one to get started.</p>
      )}

      <ContentPlanFormModal key={addOpen ? 'open' : 'closed'} open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
    </div>
  )
}

export default SocialPlanner
