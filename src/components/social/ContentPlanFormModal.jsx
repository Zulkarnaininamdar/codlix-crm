import { useState } from 'react'
import Modal from '../common/Modal.jsx'

const emptyForm = {
  caption: '',
  mediaType: 'IMAGE',
  mediaUrl: '',
  scheduledAt: '',
}

/** `initialDate` is YYYY-MM-DD from the calendar; posts default to 10:00 on that day. */
function ContentPlanFormModal({ open, onClose, onSubmit, initialDate }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    scheduledAt: initialDate ? `${initialDate}T10:00` : '',
  }))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const mediaUrl = form.mediaUrl.trim()
    if (!mediaUrl.startsWith('https://')) {
      setError('Media URL must be a public https:// link to the image or video.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        caption: form.caption,
        mediaType: form.mediaType,
        mediaUrl,
        // Empty time means "publish as soon as the worker picks it up".
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
      })
    } catch (err) {
      setError(err.message || 'Could not schedule this post.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule Instagram Post" width="560px">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field field--full">
            <label>Caption</label>
            <textarea
              value={form.caption}
              onChange={(e) => set('caption', e.target.value)}
              placeholder="Write the caption and hashtags..."
            />
          </div>
          <div className="field">
            <label>Post Type</label>
            <select value={form.mediaType} onChange={(e) => set('mediaType', e.target.value)}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Reel (video)</option>
            </select>
          </div>
          <div className="field">
            <label>Publish At</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => set('scheduledAt', e.target.value)}
            />
          </div>
          <div className="field field--full">
            <label>Media URL <span className="required">*</span></label>
            <input
              value={form.mediaUrl}
              onChange={(e) => set('mediaUrl', e.target.value)}
              placeholder="https://your-cdn.example.com/post.jpg"
            />
          </div>
        </div>

        {error && <p className="field__error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Scheduling…' : form.scheduledAt ? 'Schedule Post' : 'Publish Now'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ContentPlanFormModal
