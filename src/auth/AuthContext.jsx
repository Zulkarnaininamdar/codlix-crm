import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, ApiError, getToken, setToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [executives, setExecutives] = useState([])

  const loadExecutives = useCallback(async () => {
    try {
      setExecutives(await api('/executives'))
    } catch {
      setExecutives([])
    }
  }, [])

  useEffect(() => {
    if (!getToken()) {
      setAuthLoading(false)
      return
    }
    api('/auth/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setAuthLoading(false))
  }, [])

  useEffect(() => {
    if (user?.role === 'sales-manager') loadExecutives()
    else setExecutives([])
  }, [user, loadExecutives])

  async function login(username, password) {
    try {
      const data = await api('/auth/login', { method: 'POST', body: { username, password } })
      setToken(data.token)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : 'Could not reach the server.' }
    }
  }

  function logout() {
    api('/auth/logout', { method: 'POST' }).catch(() => {})
    setToken(null)
    setUser(null)
  }

  async function addExecutive(payload) {
    const created = await api('/executives', { method: 'POST', body: payload })
    await loadExecutives()
    return created
  }

  async function setExecutiveActive(username, active) {
    await api(`/executives/${encodeURIComponent(username)}`, { method: 'PATCH', body: { active } })
    await loadExecutives()
  }

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, logout, executives, addExecutive, setExecutiveActive }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
