import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircleIcon, TrashIcon } from '../icons/Icons.jsx'
import './ConfirmProvider.css'

const ConfirmContext = createContext(null)

/**
 * Styled replacement for window.confirm.
 *   const confirm = useConfirm()
 *   if (!(await confirm({ title, message, confirmLabel, tone: 'danger' }))) return
 */
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)

  const confirm = useCallback(
    (options) => new Promise((resolve) => setRequest({ ...options, resolve })),
    []
  )

  function settle(result) {
    request?.resolve(result)
    setRequest(null)
  }

  useEffect(() => {
    if (!request) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        request.resolve(false)
        setRequest(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [request])

  const danger = request?.tone === 'danger'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request && (
        <div className="confirm-backdrop" onClick={() => settle(false)}>
          <div
            className="confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            onClick={(e) => e.stopPropagation()}
          >
            <span className={`confirm__icon${danger ? ' confirm__icon--danger' : ''}`}>
              {danger ? <TrashIcon /> : <CheckCircleIcon />}
            </span>
            <h3 id="confirm-title" className="confirm__title">{request.title ?? 'Are you sure?'}</h3>
            {request.message && <p id="confirm-message" className="confirm__message">{request.message}</p>}
            <div className="confirm__actions">
              <button type="button" autoFocus className="confirm__btn confirm__btn--ghost" onClick={() => settle(false)}>
                {request.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                className={`confirm__btn ${danger ? 'confirm__btn--danger' : 'confirm__btn--primary'}`}
                onClick={() => settle(true)}
              >
                {request.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error('useConfirm must be used inside ConfirmProvider')
  return confirm
}
