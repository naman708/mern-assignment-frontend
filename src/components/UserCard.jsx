import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import RoleGate from './RoleGate'

// A single user tile in the users grid. The Delete action is gated to admins via
// RoleGate and hidden on the viewer's own card (`isOwnProfile`), since the backend
// forbids self-delete.
export default function UserCard({ user, isOwnProfile = false, onDelete, deleting = false }) {
  return (
    <div className="card flex flex-col p-5 transition hover:shadow-md">
      <Link to={`/users/${user.id}`} className="flex items-center gap-4">
        <Avatar user={user} size={56} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-800">{user.name}</p>
            {user.role === 'admin' && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                admin
              </span>
            )}
          </div>
          <p className="truncate text-sm text-slate-500">{user.email}</p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <Link to={`/users/${user.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View profile →
        </Link>
        {!isOwnProfile && (
          <RoleGate roles={['admin']}>
            <button
              type="button"
              onClick={() => onDelete?.(user)}
              disabled={deleting}
              className="btn-danger px-3 py-1.5 text-xs"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </RoleGate>
        )}
      </div>
    </div>
  )
}
