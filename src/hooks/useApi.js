import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'

/** Loads a GET endpoint once (and again whenever `reload` is called). */
export function useApi(path, { enabled = true } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(enabled)

  const reload = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      setData(await api(path))
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [path, enabled])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, error, loading, reload }
}
