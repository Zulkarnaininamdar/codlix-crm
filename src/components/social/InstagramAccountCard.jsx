import { InstagramIcon, CheckCircleIcon } from '../icons/Icons.jsx'
import Badge from '../common/Badge.jsx'
import './InstagramAccountCard.css'

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function formatSynced(iso) {
  if (!iso) return 'Not synced yet'
  return `Last synced ${new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
}

function InstagramAccountCard({ account, onSync, onDisconnect, syncing }) {
  return (
    <div className="ig-account-card">
      {account.profilePictureUrl ? (
        <img className="ig-account-card__photo" src={account.profilePictureUrl} alt="" />
      ) : (
        <div className="ig-account-card__avatar">{initials(account.name)}</div>
      )}

      <div className="ig-account-card__info">
        <div className="ig-account-card__row">
          <InstagramIcon className="ig-account-card__icon" />
          <span className="ig-account-card__username">@{account.username}</span>
          <Badge tone="dark">
            <CheckCircleIcon /> Connected
          </Badge>
        </div>
        {account.biography && <p className="ig-account-card__bio">{account.biography}</p>}
        <p className="ig-account-card__synced">{formatSynced(account.lastSyncedAt)}</p>
      </div>

      <div className="ig-account-card__stats">
        <div>
          <p>{account.postsCount.toLocaleString()}</p>
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

      <div className="ig-account-card__actions">
        <button type="button" className="btn btn--secondary btn--sm" onClick={onSync} disabled={syncing}>
          {syncing ? 'Syncing…' : 'Sync now'}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onDisconnect}>
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default InstagramAccountCard
