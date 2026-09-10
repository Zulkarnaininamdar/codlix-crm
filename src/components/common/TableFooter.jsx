import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons.jsx'

function TableFooter({ page = 1, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  return (
    <div className="data-table__foot">
      <span>
        Showing <strong>{start}–{end}</strong> of <strong>{total}</strong>
      </span>
      <div className="data-table__pager">
        <button
          className="data-table__pager-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>
        <span className="data-table__pager-page">Page {page} of {totalPages}</span>
        <button
          className="data-table__pager-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  )
}

export default TableFooter
