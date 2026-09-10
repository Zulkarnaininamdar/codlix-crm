import './Tabs.css'

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tabs__item${active === tab.value ? ' is-active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          {typeof tab.count === 'number' && <span className="tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}

export default Tabs
