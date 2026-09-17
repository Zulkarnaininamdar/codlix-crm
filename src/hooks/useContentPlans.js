import { useEffect, useState } from 'react'
import { defaultContentPlans } from '../data/socialMediaData.js'

const STORAGE_KEY = 'codlix-social-content-plans'

function loadPlans() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultContentPlans
  } catch {
    return defaultContentPlans
  }
}

export function useContentPlans() {
  const [contentPlans, setContentPlans] = useState(loadPlans)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentPlans))
  }, [contentPlans])

  function addPlan(plan) {
    const next = { id: `plan-${Date.now()}`, ...plan }
    setContentPlans((prev) => [next, ...prev].sort((a, b) => a.plannedDate.localeCompare(b.plannedDate)))
  }

  function deletePlan(id) {
    setContentPlans((prev) => prev.filter((p) => p.id !== id))
  }

  return { contentPlans, addPlan, deletePlan }
}
