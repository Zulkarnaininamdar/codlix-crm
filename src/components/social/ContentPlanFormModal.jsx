import { useState } from 'react'
import Modal from '../common/Modal.jsx'

const emptyForm = {
  title: '',
  caption: '',
  hashtags: '',
  plannedDate: '',
  type: 'image',
  status: 'draft',
}

function ContentPlanFormModal({ open, onClose, onSubmit, initialDate }) {
  const [form, setForm] = useState(() => ({ ...emptyForm, plannedDate: initialDate || '' }))

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.plannedDate) return
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Content Plan" width="560px">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field field--full">
            <label>Title <span className="required">*</span></label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Product update teaser" />
          </div>
          <div className="field field--full">
            <label>Caption</label>
            <textarea value={form.caption} onChange={(e) => set('caption', e.target.value)} placeholder="Write the post caption..." />
          </div>
          <div className="field field--full">
            <label>Hashtags</label>
            <input value={form.hashtags} onChange={(e) => set('hashtags', e.target.value)} placeholder="#CRM #ProductUpdate" />
          </div>
          <div className="field">
            <label>Planned Date <span className="required">*</span></label>
            <input type="date" value={form.plannedDate} onChange={(e) => set('plannedDate', e.target.value)} />
          </div>
          <div className="field">
            <label>Post Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="image">Image</option>
              <option value="carousel">Carousel</option>
              <option value="reel">Reel</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">Save Plan</button>
        </div>
      </form>
    </Modal>
  )
}

export default ContentPlanFormModal
