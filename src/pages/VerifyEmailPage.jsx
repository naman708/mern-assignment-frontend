import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import Spinner from '../components/Spinner'
import { verifyEmail } from '../api/auth'
import { errorMessage } from '../utils/apiData'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('')
  const ranRef = useRef(false)

  useEffect(() => {
    // Guard against double-invoke in React StrictMode.
    if (ranRef.current) return
    ranRef.current = true

    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the link.')
      return
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setMessage(errorMessage(err, 'This verification link is invalid or has expired.'))
      })
  }, [token])

  return (
    <AuthShell title="Email verification">
      {status === 'verifying' && <Spinner label="Verifying your email…" />}

      {status === 'success' && (
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-slate-600">Your email has been verified. You can now sign in.</p>
          <Link to="/login" className="btn-primary mt-6 w-full">Go to sign in</Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm text-slate-600">{message}</p>
          <Link to="/register" className="btn-secondary mt-6 w-full">Back to register</Link>
        </div>
      )}
    </AuthShell>
  )
}
