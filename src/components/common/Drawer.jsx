import { CloseIcon } from '../icons/Icons.jsx'
import './Drawer.css'

function Drawer({ open, onClose, title, children, footer, width }) {
  return (
    <>
      <div className={`drawer-backdrop${open ? ' is-open' : ''}`} onClick={onClose} />
      <aside
        className={`drawer${open ? ' is-open' : ''}`}
        style={width ? { width } : undefined}
        role="dialog"
        aria-hidden={!open}
      >
        <header className="drawer__head">
          <h3>{title}</h3>
          <button className="drawer__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer && <footer className="drawer__foot">{footer}</footer>}
      </aside>
    </>
  )
}

export default Drawer
