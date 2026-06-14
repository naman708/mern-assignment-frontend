import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import ImageUpload from '../components/ImageUpload'
import { register as registerApi } from '../api/auth'
import { emailRules, passwordRules, nameRules, confirmPasswordRules } from '../utils/validation'
import { errorMessage } from '../utils/apiData'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values) => {
    try {
      await registerApi({ ...values, profileImage })
      setDone(true)
      toast.success('Account created! Check your email to verify.')
    } catch (err) {
      toast.error(errorMessage(err, 'Registration failed'))
    }
  }

  if (done) {
    return (
      <AuthShell title="Check your email" subtitle="One more step to activate your account">
        <p className="text-center text-sm text-slate-600">
          We&apos;ve sent a verification link to your email address. Click the link to verify, then
          sign in.
        </p>
        <Link to="/login" className="btn-primary mt-6 w-full">
          Go to sign in
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Join in a few seconds"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <div className="-mt-3 mb-5 rounded-lg bg-brand-50 px-3 py-2 text-center text-sm text-slate-600">
        Need an administrator account?{' '}
        <Link to="/create-admin" className="font-medium text-brand-700 hover:text-brand-600">
          Register as an admin
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <ImageUpload onChange={setProfileImage} onError={setImageError} />
        {imageError && <p className="field-error">{imageError}</p>}

        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name"
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="Jane Doe"
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
            placeholder="you@example.com"
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

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
