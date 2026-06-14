const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Resolve a user's profile image into a usable <img> src.
// Accepts absolute URLs, server-relative paths (e.g. /uploads/x.png), or null.
export function resolveImageUrl(profileImage) {
  if (!profileImage) return null
  if (/^https?:\/\//i.test(profileImage)) return profileImage
  const path = profileImage.startsWith('/') ? profileImage : `/${profileImage}`
  return `${API_ORIGIN}${path}`
}

// Build a neutral placeholder avatar from initials (data URI, no network call).
export function initialsAvatar(name = '?') {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="#dbeafe"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" fill="#2563eb">${initials || '?'}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
