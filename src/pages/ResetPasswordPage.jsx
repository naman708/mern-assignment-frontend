import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import { resetPassword } from '../api/auth'
import { passwordRules, confirmPasswordRules } from '../utils/validation'
import { errorMessage } from '../utils/apiData'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ password }) => {
    try {
      await resetPassword({ token, password })
      setDone(true)
      toast.success('Password updated. Please sign in.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      toast.error(errorMessage(err, 'Could not reset password. The link may have expired.'))
    }
  }

  if (!token) {
    return (
      <AuthShell title="Invalid link">
        <p className="text-center text-sm text-slate-600">
          This password-reset link is missing its token. Please request a new one.
        </p>
        <Link to="/forgot-password" className="btn-primary mt-6 w-full">Request new link</Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Reset password" subtitle="Choose a new password">
      {done ? (
        <p className="text-center text-sm text-slate-600">
          Your password has been reset. Redirecting you to sign in…
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="label" htmlFor="password">New password</label>
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
            <label className="label" htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Re-enter your new password"
              {...register('confirmPassword', confirmPasswordRules(() => watch('password')))}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
