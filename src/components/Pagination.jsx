// Pagination control driven by list metadata. Renders a windowed set of page
// numbers plus prev/next. Calls onPageChange(nextPage).
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Build a compact window of pages around the current one.
  const pages = []
  const window = 1
  const start = Math.max(1, page - window)
  const end = Math.min(totalPages, page + window)
  if (start > 1) pages.push(1)
  if (start > 2) pages.push('...')
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < totalPages - 1) pages.push('...')
  if (end < totalPages) pages.push(totalPages)

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn-secondary px-3 py-1.5"
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`gap-${i}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={
              p === page
                ? 'btn-primary px-3.5 py-1.5'
                : 'btn-secondary px-3.5 py-1.5'
            }
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn-secondary px-3 py-1.5"
      >
        Next
      </button>
    </nav>
  )
}
