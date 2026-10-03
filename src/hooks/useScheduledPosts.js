import { useCallback } from 'react'
import { api } from '../api/client.js'
import { useApi } from './useApi.js'

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Local calendar day (YYYY-MM-DD) for an ISO timestamp, so posts land on the day the manager sees. */
export function localDateKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Shape used by the planner cards and calendar. */
export function toPlan(post) {
  const firstLine = (post.caption || '').split('\n')[0].trim()
  return {
    id: post.id,
    title: firstLine.length > 40 ? `${firstLine.slice(0, 40)}…` : firstLine || 'Untitled post',
    caption: post.caption,
    plannedDate: localDateKey(post.scheduledAt),
    type: post.mediaType === 'VIDEO' ? 'reel' : 'image',
    status: post.status,
    error: post.error,
    mediaUrl: post.mediaUrl,
  }
}

export function useScheduledPosts() {
  const { data, error, loading, reload } = useApi('/social/schedule')

  const schedulePost = useCallback(
    async (payload) => {
      await api('/social/schedule', { method: 'POST', body: payload })
      await reload()
    },
    [reload]
  )

  const cancelPost = useCallback(
    async (id) => {
      await api(`/social/schedule/${id}`, { method: 'DELETE' })
      await reload()
    },
    [reload]
  )

  return {
    plans: (data ?? []).map(toPlan),
    error,
    loading,
    schedulePost,
    cancelPost,
    reload,
  }
}
