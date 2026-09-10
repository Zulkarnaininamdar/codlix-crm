import { CloseIcon } from '../icons/Icons.jsx'
import './Modal.css'

function Modal({ open, onClose, title, children, footer, width }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={width ? { maxWidth: width } : undefined}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  )
}

export default Modal
