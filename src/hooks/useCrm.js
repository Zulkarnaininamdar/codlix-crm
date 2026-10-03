import { useCallback } from 'react'
import { api } from '../api/client.js'
import { useApi } from './useApi.js'

/**
 * CRUD for one sales module (companies, contacts, clients, proposals, projects, tasks,
 * follow-ups, meetings). Pass `parentId` to list only records linked to one parent,
 * e.g. the follow-ups of a lead.
 */
export function useCrm(entity, { parentId } = {}) {
  const query = parentId ? `?parentId=${encodeURIComponent(parentId)}` : ''
  const { data, error, loading, reload } = useApi(`/crm/${entity}${query}`)

  const create = useCallback(
    async (body) => {
      const created = await api(`/crm/${entity}`, { method: 'POST', body })
      await reload()
      return created
    },
    [entity, reload]
  )

  const update = useCallback(
    async (id, patch) => {
      const updated = await api(`/crm/${entity}/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch })
      await reload()
      return updated
    },
    [entity, reload]
  )

  const remove = useCallback(
    async (id) => {
      await api(`/crm/${entity}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      await reload()
    },
    [entity, reload]
  )

  return { items: data ?? [], error, loading, reload, create, update, remove }
}
