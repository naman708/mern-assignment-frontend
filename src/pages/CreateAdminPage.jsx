import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import { createAdmin } from '../api/auth'
import { emailRules, passwordRules, nameRules, confirmPasswordRules } from '../utils/validation'
import { errorMessage } from '../utils/apiData'

export default function CreateAdminPage() {
  const navigate = useNavigate()
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ name, email, password, secret }) => {
    try {
      await createAdmin({ name, email, password, secret })
      setDone(true)
      toast.success('Admin account created! You can now sign in.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      // 403 = wrong secret, 409 = email already exists, etc.
      toast.error(errorMessage(err, 'Could not create admin. Check the admin secret.'))
    }
  }

  if (done) {
    return (
      <AuthShell title="Admin created" subtitle="The admin account is ready">
        <p className="text-center text-sm text-slate-600">
          The admin account was created and is already verified. Redirecting you to sign in…
        </p>
        <Link to="/login" className="btn-primary mt-6 w-full">Go to sign in</Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create admin"
      subtitle="Provide the admin secret to create an administrator account"
      footer={
        <>
          Not an admin?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Create a regular account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name"
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="Jane Admin"
            {...register('name', nameRules)}
          />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="admin@example.com"
            {...register('email', emailRules)}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            placeholder="At least 8 chars, a letter and a number"
            {...register('password', passwordRules)}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Re-enter your password"
            {...register('confirmPassword', confirmPasswordRules(() => watch('password')))}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="secret">Admin secret</label>
          <input
            id="secret"
            type="password"
            className={`input ${errors.secret ? 'input-error' : ''}`}
            placeholder="Shared admin secret"
            {...register('secret', { required: 'Admin secret is required' })}
          />
          {errors.secret && <p className="field-error">{errors.secret.message}</p>}
          <p className="mt-1 text-xs text-slate-400">
            Required to authorize admin creation. Ask your system owner if you don&apos;t have it.
          </p>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating admin…' : 'Create admin'}
        </button>
      </form>
    </AuthShell>
  )
}
