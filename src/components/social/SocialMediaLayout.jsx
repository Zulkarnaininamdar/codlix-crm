import { useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import PageHeader from '../common/PageHeader.jsx'
import InstagramAccountCard from './InstagramAccountCard.jsx'
import { api, ApiError } from '../../api/client.js'
import { useApi } from '../../hooks/useApi.js'
import { InstagramIcon } from '../icons/Icons.jsx'
import '../common/PageHeader.css'
import '../common/Button.css'
import '../common/Form.css'
import '../common/Modal.css'
import '../common/Badge.css'
import '../../pages/social/social.css'
import { useConfirm } from '../common/ConfirmProvider.jsx'

function errorText(err) {
  return err instanceof ApiError ? err.message : 'Could not reach the server.'
}

function ConnectCard({ onConnect, connecting, error }) {
  return (
    <div className="ig-connect-card">
      <span className="ig-connect-card__icon"><InstagramIcon /></span>
      <div>
        <h3>Connect your Instagram account</h3>
        <p>
          Works with Instagram Business and Creator accounts. You will be asked to approve access to your profile,
          insights and publishing. Your access token is stored encrypted on the server.
        </p>
        {error && <p className="field__error">{error}</p>}
      </div>
      <button type="button" className="btn btn--primary" onClick={onConnect} disabled={connecting}>
        {connecting ? 'Redirecting…' : 'Connect Instagram'}
      </button>
    </div>
  )
}

const callbackMessages = {
  connected: { tone: 'success', text: 'Instagram account connected.' },
  error: { tone: 'error', text: 'Instagram could not be connected.' },
}

function SocialMediaLayout() {
  const confirm = useConfirm()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = useApi('/social/instagram/status')
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [actionError, setActionError] = useState('')

  const callbackResult = searchParams.get('instagram')
  const callbackReason = searchParams.get('reason')

  function dismissCallbackResult() {
    setSearchParams({}, { replace: true })
  }

  async function connect() {
    setActionError('')
    setConnecting(true)
    try {
      const { url } = await api('/social/instagram/connect')
      window.location.assign(url)
    } catch (err) {
      setActionError(errorText(err))
      setConnecting(false)
    }
  }

  async function sync() {
    setActionError('')
    setSyncing(true)
    try {
      await api('/social/instagram/sync', { method: 'POST' })
      await status.reload()
    } catch (err) {
      setActionError(errorText(err))
    } finally {
      setSyncing(false)
    }
  }

  async function disconnect() {
    if (!(await confirm({ title: 'Disconnect Instagram?', message: 'Cached posts and insights will be removed from the dashboard.', confirmLabel: 'Disconnect', tone: 'danger' }))) return
    setActionError('')
    try {
      await api('/social/instagram', { method: 'DELETE' })
      await status.reload()
    } catch (err) {
      setActionError(errorText(err))
    }
  }

  const connected = status.data?.connected
  const callbackNotice = callbackMessages[callbackResult]

  return (
    <div className="social-page">
      <PageHeader title="Social Media" subtitle="Instagram performance, posts & content scheduling" />

      {callbackNotice && (
        <div className={`social-page__notice social-page__notice--${callbackNotice.tone}`}>
          <span>
            {callbackNotice.text}
            {callbackResult === 'error' && callbackReason ? ` (${callbackReason})` : ''}
          </span>
          <button type="button" className="social-page__notice-close" onClick={dismissCallbackResult} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {status.loading && !status.data ? (
        <p className="social-page__empty">Checking Instagram connection…</p>
      ) : status.error ? (
        <p className="social-page__empty">Could not load the Instagram connection. {errorText(status.error)}</p>
      ) : connected ? (
        <>
          {actionError && <p className="field__error">{actionError}</p>}
          <InstagramAccountCard account={status.data.account} onSync={sync} onDisconnect={disconnect} syncing={syncing} />
          <Outlet />
        </>
      ) : (
        <ConnectCard onConnect={connect} connecting={connecting} error={actionError} />
      )}
    </div>
  )
}

export default SocialMediaLayout
