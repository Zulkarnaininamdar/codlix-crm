import { InstagramIcon, CheckCircleIcon } from '../icons/Icons.jsx'
import Badge from '../common/Badge.jsx'
import './InstagramAccountCard.css'

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function InstagramAccountCard({ account }) {
  return (
    <div className="ig-account-card">
      <div className="ig-account-card__avatar">{initials(account.name)}</div>

      <div className="ig-account-card__info">
        <div className="ig-account-card__row">
          <InstagramIcon className="ig-account-card__icon" />
          <span className="ig-account-card__username">@{account.username}</span>
          <Badge tone="dark">
            <CheckCircleIcon /> Connected
          </Badge>
        </div>
        <p className="ig-account-card__bio">{account.bio}</p>
      </div>

      <div className="ig-account-card__stats">
        <div>
          <p>{account.postsCount}</p>
          <span>Posts</span>
        </div>
        <div>
          <p>{account.followers.toLocaleString()}</p>
          <span>Followers</span>
        </div>
        <div>
          <p>{account.following.toLocaleString()}</p>
          <span>Following</span>
        </div>
      </div>
    </div>
  )
}

export default InstagramAccountCard
