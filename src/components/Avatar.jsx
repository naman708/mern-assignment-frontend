import { useState } from 'react'
import { resolveImageUrl, initialsAvatar } from '../utils/image'

// Renders a user's avatar, falling back to an initials placeholder if the image
// is missing or fails to load.
export default function Avatar({ user, size = 48, className = '' }) {
  const [failed, setFailed] = useState(false)
  const url = resolveImageUrl(user?.profileImage)
  const src = !url || failed ? initialsAvatar(user?.name) : url

  return (
    <img
      src={src}
      alt={user?.name ? `${user.name}'s avatar` : 'avatar'}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      className={`rounded-full object-cover ring-1 ring-slate-200 ${className}`}
    />
  )
}
