function StageTracker({ stages, currentIndex, onSelect }) {
  return (
    <div className="stage-tracker">
      {stages.map((stage, i) => {
        const state = i < currentIndex ? 'is-done' : i === currentIndex ? 'is-current' : 'is-upcoming'
        return (
          <button
            type="button"
            key={stage}
            className={`stage-tracker__seg ${state}${onSelect ? ' is-clickable' : ''}`}
            style={{ zIndex: stages.length - i }}
            onClick={onSelect ? () => onSelect(stage) : undefined}
            disabled={!onSelect}
          >
            <span>{stage}</span>
          </button>
        )
      })}
    </div>
  )
}

export default StageTracker
