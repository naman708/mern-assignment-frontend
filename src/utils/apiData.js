// The backend may wrap payloads as { success, data: ... } or return them flat.
// These helpers tolerate both shapes so the UI doesn't break on minor variations.

// Pull a named entity (e.g. "user") out of a response, falling back to data/root.
export function pick(resp, key) {
  if (!resp) return null
  if (key && resp[key] != null) return resp[key]
  if (resp.data) {
    if (key && resp.data[key] != null) return resp.data[key]
    return resp.data
  }
  return resp
}

// Normalize a paginated list response into { items, page, limit, total, totalPages }.
// The backend envelope is { success, message, data: [...], meta: {...} } — note that
// `meta` is a sibling of `data`, not nested inside it.
export function pickList(resp) {
  const root = resp ?? {}
  const data = root.data ?? root
  const items = Array.isArray(data)
    ? data
    : data.users ?? data.items ?? data.results ?? []
  const meta = root.meta ?? root.pagination ?? data.meta ?? data.pagination ?? {}
  const page = Number(meta.page ?? 1)
  const limit = Number(meta.limit ?? items.length ?? 10)
  const total = Number(meta.total ?? meta.totalItems ?? items.length ?? 0)
  const totalPages = Number(meta.totalPages ?? Math.max(1, Math.ceil(total / (limit || 1))))
  return { items, page, limit, total, totalPages }
}

// Extract a human-readable error message from an axios error.
export function errorMessage(err, fallback = 'Something went wrong') {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  )
}
