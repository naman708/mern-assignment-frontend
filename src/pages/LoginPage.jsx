import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { emailRules } from '../utils/validation'
import { errorMessage } from '../utils/apiData'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/users'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(errorMessage(err, 'Invalid email or password'))
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back — enter your credentials"
      footer={
        <div className="space-y-1">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>
          <p>
            <Link to="/create-admin" className="text-xs font-medium text-slate-500 hover:text-brand-700">
              Create an admin account
            </Link>
          </p>
        </div>
      }
    >
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

        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
