import { useId, useState } from 'react'
import './LeadPipeline.css'
import './ChartTooltip.css'

const stages = [
  { label: 'New', value: 1245 },
  { label: 'Contacted', value: 380 },
  { label: 'Qualified', value: 42 },
  { label: 'Meeting', value: 18 },
  { label: 'Proposal', value: 9 },
  { label: 'Won', value: 4 },
]

const VB_W = 1200
const VB_H = 132
const CENTER_Y = VB_H / 2
const MIN_HALF_H = 9
const MAX_HALF_H = 58

// boundary volumes: entry point of every stage, plus a tapered tip after "Won"
const boundaryValues = [...stages.map((s) => s.value), stages[stages.length - 1].value * 0.55]

const scaled = boundaryValues.map((v) => Math.cbrt(v))
const maxScaled = Math.max(...scaled)
const halfHeights = scaled.map((v) => {
  const t = Math.max(v / maxScaled, 0.13)
  return MIN_HALF_H + (MAX_HALF_H - MIN_HALF_H) * t
})

const boundaryX = boundaryValues.map((_, i) => (i / (boundaryValues.length - 1)) * VB_W)

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function curveSegments(points) {
  let d = ''
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const xMid = (x0 + x1) / 2
    d += ` C ${xMid} ${y0}, ${xMid} ${y1}, ${x1} ${y1}`
  }
  return d
}

const topPoints = boundaryX.map((x, i) => [x, CENTER_Y - halfHeights[i]])
const bottomPointsRev = boundaryX
  .map((x, i) => [x, CENTER_Y + halfHeights[i]])
  .slice()
  .reverse()

const funnelPath =
  `M ${topPoints[0][0]} ${topPoints[0][1]}` +
  curveSegments(topPoints) +
  ` L ${bottomPointsRev[0][0]} ${bottomPointsRev[0][1]}` +
  curveSegments(bottomPointsRev) +
  ' Z'

function LeadPipeline() {
  const gradientId = useId()
  const [hovered, setHovered] = useState(null)

  return (
    <div className="lead-pipeline">
      <div className="lead-pipeline__flow">
        <svg className="lead-pipeline__svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a7bf6" />
              <stop offset="45%" stopColor="#6448F4" />
              <stop offset="80%" stopColor="#3d2ba8" />
              <stop offset="100%" stopColor="#121214" />
            </linearGradient>
          </defs>
          <path d={funnelPath} fill={`url(#${gradientId})`} />
          {boundaryX.slice(1, -1).map((x, i) => (
            <line
              key={i}
              x1={x}
              x2={x}
              y1={CENTER_Y - halfHeights[i + 1]}
              y2={CENTER_Y + halfHeights[i + 1]}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
            />
          ))}
          {hovered !== null && (
            <rect
              x={boundaryX[hovered]}
              y="0"
              width={boundaryX[hovered + 1] - boundaryX[hovered]}
              height={VB_H}
              fill="rgba(255,255,255,0.16)"
              pointerEvents="none"
            />
          )}
          {stages.map((stage, i) => (
            <rect
              key={stage.label}
              x={boundaryX[i]}
              y="0"
              width={boundaryX[i + 1] - boundaryX[i]}
              height={VB_H}
              fill="transparent"
              className="lead-pipeline__hit"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {hovered !== null && (
          <div
            className="chart-tooltip lead-pipeline__tooltip"
            style={{
              left: `${clamp(((boundaryX[hovered] + boundaryX[hovered + 1]) / 2 / VB_W) * 100, 14, 86)}%`,
            }}
          >
            <p className="chart-tooltip__label">{stages[hovered].label}</p>
            <p className="chart-tooltip__row">
              <span className="chart-tooltip__dot" />
              {stages[hovered].value.toLocaleString()} leads
            </p>
            {hovered > 0 && (
              <p className="chart-tooltip__row">
                <span className="chart-tooltip__dot" />
                {((stages[hovered].value / stages[hovered - 1].value) * 100).toFixed(1)}% from {stages[hovered - 1].label}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="lead-pipeline__conversions">
        {stages.slice(1).map((stage, i) => {
          const prev = stages[i].value
          const rate = ((stage.value / prev) * 100).toFixed(1)
          const left = ((i + 1) / stages.length) * 100
          return (
            <span key={stage.label} className="lead-pipeline__conversion" style={{ left: `${left}%` }}>
              {rate}%
            </span>
          )
        })}
      </div>

      <div className="lead-pipeline__labels">
        {stages.map((stage, i) => (
          <div
            className={`lead-pipeline__label-col${hovered === i ? ' is-active' : ''}`}
            key={stage.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="lead-pipeline__value">{stage.value.toLocaleString()}</span>
            <span className="lead-pipeline__label">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeadPipeline
