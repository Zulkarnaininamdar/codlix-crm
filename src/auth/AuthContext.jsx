import { createContext, useContext, useEffect, useState } from 'react'
import { accounts } from '../data/accounts.js'

const STORAGE_KEY = 'codlix-auth-user'

const AuthContext = createContext(null)

function loadUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  function login(username, password) {
    const account = accounts.find((a) => a.username === username && a.password === password)
    if (!account) return null
    const safeUser = { username: account.username, role: account.role, name: account.name, roleLabel: account.roleLabel, department: account.department }
    setUser(safeUser)
    return safeUser
  }

  function logout() {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
