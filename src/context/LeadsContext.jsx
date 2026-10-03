import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'

const LeadsContext = createContext(null)

export function LeadsProvider({ children }) {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [employees, setEmployees] = useState([])
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    const [leadList, employeeList] = await Promise.all([api('/leads'), api('/employees')])
    setLeads(leadList)
    setEmployees(employeeList)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!user) {
      setLeads([])
      setEmployees([])
      setLoaded(false)
      return
    }
    refresh().catch(() => setLoaded(true))
  }, [user, refresh])

  async function addLead(payload) {
    const created = await api('/leads', { method: 'POST', body: payload })
    setLeads((prev) => [created, ...prev])
    return created
  }

  async function updateLead(id, patch) {
    const updated = await api(`/leads/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch })
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    return updated
  }

  async function removeLeads(ids) {
    await Promise.all(ids.map((id) => api(`/leads/${encodeURIComponent(id)}`, { method: 'DELETE' })))
    const idSet = new Set(ids)
    setLeads((prev) => prev.filter((l) => !idSet.has(l.id)))
  }

  return (
    <LeadsContext.Provider value={{ leads, employees, loaded, addLead, updateLead, removeLeads, refresh }}>
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  return useContext(LeadsContext)
}
