import { useState } from 'react'
import ContentPlanCard from '../../components/social/ContentPlanCard.jsx'
import ContentPlanFormModal from '../../components/social/ContentPlanFormModal.jsx'
import { useScheduledPosts } from '../../hooks/useScheduledPosts.js'
import { PlusIcon } from '../../components/icons/Icons.jsx'

function SocialPlanner() {
  const { plans, error, loading, schedulePost, cancelPost } = useScheduledPosts()
  const [addOpen, setAddOpen] = useState(false)
  const [actionError, setActionError] = useState('')

  async function handleAdd(payload) {
    await schedulePost(payload)
    setAddOpen(false)
  }

  async function handleCancel(id) {
    setActionError('')
    try {
      await cancelPost(id)
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="social-page__section">
      <div className="social-page__planner-head">
        <div>
          <h2>Scheduled Posts</h2>
          <p>Schedule Instagram posts and reels. They publish automatically at the chosen time.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAddOpen(true)}>
          <PlusIcon /> New Post
        </button>
      </div>

      {actionError && <p className="field__error">{actionError}</p>}

      {loading && plans.length === 0 ? (
        <p className="social-page__empty">Loading scheduled posts…</p>
      ) : error ? (
        <p className="social-page__empty">Could not load scheduled posts. {error.message}</p>
      ) : plans.length > 0 ? (
        <div className="social-page__planner-list">
          {plans.map((plan) => (
            <ContentPlanCard key={plan.id} plan={plan} onDelete={handleCancel} />
          ))}
        </div>
      ) : (
        <p className="social-page__empty">No scheduled posts yet. Create one to get started.</p>
      )}

      <ContentPlanFormModal key={addOpen ? 'open' : 'closed'} open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
    </div>
  )
}

export default SocialPlanner
