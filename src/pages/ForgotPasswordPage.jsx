import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import { forgotPassword } from '../api/auth'
import { emailRules } from '../utils/validation'
import { errorMessage } from '../utils/apiData'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword(email)
      // Backend returns a generic message regardless of whether the email exists.
      setSent(true)
    } catch (err) {
      toast.error(errorMessage(err, 'Could not send reset link'))
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll email you a reset link"
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="text-center text-sm text-slate-600">
          If an account exists for that email, a password-reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              {...register('email', emailRules)}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
