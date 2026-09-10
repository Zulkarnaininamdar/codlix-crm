const toneMap = {
  // leads / general pipeline
  new: 'neutral',
  contacted: 'soft',
  qualified: 'medium',
  meeting: 'medium',
  proposal: 'strong',
  negotiation: 'strong',
  won: 'dark',
  active: 'dark',
  completed: 'dark',
  // proposals
  draft: 'neutral',
  sent: 'soft',
  viewed: 'medium',
  accepted: 'dark',
  // negative / inactive outcomes
  lost: 'outline',
  rejected: 'outline',
  expired: 'outline',
  overdue: 'outline',
  cancelled: 'outline',
  // tasks
  todo: 'neutral',
  'to do': 'neutral',
  'in progress': 'soft',
  review: 'medium',
  // priority
  low: 'neutral',
  medium: 'soft',
  high: 'strong',
  urgent: 'dark',
  // follow-ups
  pending: 'soft',
  done: 'dark',
  // meetings
  upcoming: 'soft',
  scheduled: 'soft',
  missed: 'outline',
  // employees
  'on leave': 'soft',
  inactive: 'outline',
}

export function statusTone(status) {
  if (!status) return 'neutral'
  return toneMap[status.toLowerCase()] || 'neutral'
}
