import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar'
import ImageUpload from '../components/ImageUpload'
import Spinner from '../components/Spinner'
import { getMe, updateMe } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { nameRules } from '../utils/validation'
import { pick, errorMessage } from '../utils/apiData'
import { resolveImageUrl } from '../utils/image'

export default function MyProfilePage() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(!user)
  const [editing, setEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imageError, setImageError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  // Always fetch the freshest profile on mount.
  useEffect(() => {
    let active = true
    getMe()
      .then((resp) => {
        if (!active) return
        const u = pick(resp, 'user')
        setProfile(u)
        setUser(u)
      })
      .catch((err) => toast.error(errorMessage(err, 'Could not load your profile')))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startEdit = () => {
    reset({ name: profile?.name || '' })
    setProfileImage(null)
    setImageError('')
    setEditing(true)
  }

  const onSubmit = async ({ name }) => {
    try {
      const resp = await updateMe({ name, profileImage })
      const updated = pick(resp, 'user')
      setProfile(updated)
      setUser(updated)
      setEditing(false)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update profile'))
    }
  }

  if (loading) return <Spinner label="Loading your profile…" />
  if (!profile) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">My Profile</h1>

      <div className="card p-6">
        {!editing ? (
          <>
            <div className="flex items-center gap-4">
              <Avatar user={profile} size={88} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-800">{profile.name}</h2>
                  {profile.role === 'admin' && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{profile.email}</p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</dt>
                <dd className="mt-0.5 text-sm capitalize text-slate-700">{profile.role || 'user'}</dd>
              </div>
              {profile.isEmailVerified != null && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Email verified</dt>
                  <dd className="mt-0.5 text-sm text-slate-700">{profile.isEmailVerified ? 'Yes' : 'No'}</dd>
                </div>
              )}
            </dl>

            <button onClick={startEdit} className="btn-primary mt-6">Edit profile</button>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <ImageUpload
              label="Profile image"
              initialPreview={resolveImageUrl(profile.profileImage)}
              onChange={setProfileImage}
              onError={setImageError}
            />
            {imageError && <p className="field-error">{imageError}</p>}

            <div>
              <label className="label" htmlFor="name">Name</label>
              <input
                id="name"
                className={`input ${errors.name ? 'input-error' : ''}`}
                {...register('name', nameRules)}
              />
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <input className="input bg-slate-50 text-slate-500" value={profile.email} disabled />
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
