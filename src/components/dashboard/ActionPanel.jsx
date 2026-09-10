import { Link } from 'react-router-dom'
import { FollowupsIcon, MeetingsIcon, ProposalsIcon } from '../icons/Icons.jsx'
import './ActionPanel.css'

const panels = [
  {
    title: "Today's Follow-ups",
    icon: FollowupsIcon,
    link: '/sales/follow-ups',
    items: [
      { primary: 'Aarav Shah', secondary: 'Call — discuss pricing' },
      { primary: 'Meera Nair', secondary: 'Email — send catalogue' },
      { primary: 'TechNova Pvt Ltd', secondary: 'Call — contract terms' },
    ],
  },
  {
    title: "Today's Meetings",
    icon: MeetingsIcon,
    link: '/sales/meetings',
    items: [
      { primary: 'Nexa Ltd', secondary: '11:00 AM — Proposal walkthrough' },
      { primary: 'Orbit Systems', secondary: '3:30 PM — Demo call' },
    ],
  },
  {
    title: 'Overdue Follow-ups',
    icon: FollowupsIcon,
    link: '/sales/follow-ups',
    items: [
      { primary: 'Kabir Malhotra', secondary: '2 days overdue', tag: true },
      { primary: 'Zenith Retail', secondary: '1 day overdue', tag: true },
    ],
  },
  {
    title: 'Pending Proposals',
    icon: ProposalsIcon,
    link: '/sales/proposals',
    items: [
      { primary: 'Vertex Solutions', secondary: 'Sent 3 days ago' },
      { primary: 'BluePeak Co.', secondary: 'Sent 5 days ago' },
      { primary: 'Alto Traders', secondary: 'Sent 6 days ago' },
    ],
  },
]

const VISIBLE_ITEMS = 2

function ActionPanel() {
  return (
    <div className="action-panel">
      {panels.map((panel) => {
        const Icon = panel.icon
        const visibleItems = panel.items.slice(0, VISIBLE_ITEMS)
        return (
          <section className="action-card" key={panel.title}>
            <header className="action-card__head">
              <span className="action-card__icon">
                <Icon />
              </span>
              <h3>{panel.title}</h3>
              <span className="action-card__count">{panel.items.length}</span>
            </header>
            <ul className="action-card__list">
              {visibleItems.map((item) => (
                <li key={item.primary}>
                  <span className="action-card__primary">{item.primary}</span>
                  <span className={`action-card__secondary${item.tag ? ' is-overdue' : ''}`}>
                    {item.secondary}
                  </span>
                </li>
              ))}
            </ul>
            <Link to={panel.link} className="action-card__more">
              View more
            </Link>
          </section>
        )
      })}
    </div>
  )
}

export default ActionPanel
