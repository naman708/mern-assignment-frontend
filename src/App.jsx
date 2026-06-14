import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateAdminPage from './pages/CreateAdminPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UsersListPage from './pages/UsersListPage'
import UserProfilePage from './pages/UserProfilePage'
import MyProfilePage from './pages/MyProfilePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-admin" element={<CreateAdminPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Defaults */}
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
