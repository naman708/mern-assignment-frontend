import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from './Spinner'

// Route guard requiring the admin role. Mirrors ProtectedRoute, but additionally
// redirects authenticated non-admins away from admin-only routes.
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Checking permissions..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return <Navigate to="/users" replace />
  }

  return children
}
