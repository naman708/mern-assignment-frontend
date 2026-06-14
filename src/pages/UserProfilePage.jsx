import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Spinner from '../components/Spinner'
import { getUserById } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { pick, errorMessage } from '../utils/apiData'

export default function UserProfilePage() {
  const { id } = useParams()
  const { user: me } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getUserById(id)
      .then((resp) => {
        if (active) setUser(pick(resp, 'user'))
      })
      .catch((err) => {
        if (active) setError(errorMessage(err, 'Could not load this profile'))
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <Spinner label="Loading profile…" />

  if (error || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-sm text-red-600">{error || 'User not found.'}</p>
        <Link to="/users" className="btn-secondary mt-4">Back to users</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/users" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-700">
        ← Back to users
      </Link>
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-700" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <Avatar user={user} size={88} className="ring-4 ring-white" />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</dt>
              <dd className="mt-0.5 text-sm capitalize text-slate-700">{user.role || 'user'}</dd>
            </div>
            {user.isEmailVerified != null && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Email verified</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{user.isEmailVerified ? 'Yes' : 'No'}</dd>
              </div>
            )}
          </dl>

          {me?.id === user.id && (
            <Link to="/profile" className="btn-primary mt-6">Edit my profile</Link>
          )}
        </div>
      </div>
    </div>
  )
}
