import './Badge.css'

// tone: 'neutral' | 'soft' | 'medium' | 'strong' | 'dark' | 'outline' | 'danger' | 'warning'
function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export default Badge
