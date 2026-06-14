import { useAuth } from '../hooks/useAuth'

// Declarative role gate. Renders `children` only when the current user's role is
// in `roles`; otherwise renders `fallback`. Keeps RBAC checks in one place.
export default function RoleGate({ roles = ['admin'], fallback = null, children }) {
  const { user } = useAuth()
  return user && roles.includes(user.role) ? children : fallback
}
