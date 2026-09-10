function StageTracker({ stages, currentIndex }) {
  return (
    <div className="stage-tracker">
      {stages.map((stage, i) => {
        const state = i < currentIndex ? 'is-done' : i === currentIndex ? 'is-current' : 'is-upcoming'
        return (
          <div key={stage} className={`stage-tracker__seg ${state}`} style={{ zIndex: stages.length - i }}>
            <span>{stage}</span>
          </div>
        )
      })}
    </div>
  )
}

export default StageTracker
