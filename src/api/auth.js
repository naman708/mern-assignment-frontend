import client from './client'

// POST /api/auth/register — multipart (name, email, password, optional profileImage)
export async function register({ name, email, password, profileImage }) {
  const form = new FormData()
  form.append('name', name)
  form.append('email', email)
  form.append('password', password)
  if (profileImage) form.append('profileImage', profileImage)
  // Let the browser set the multipart boundary; do not hardcode Content-Type.
  const { data } = await client.post('/auth/register', form)
  return data
}

// POST /api/auth/create-admin — creates a pre-verified admin; gated by a shared secret.
export async function createAdmin({ name, email, password, secret }) {
  const { data } = await client.post('/auth/create-admin', { name, email, password, secret })
  return data
}

// GET /api/auth/verify-email?token=...
export async function verifyEmail(token) {
  const { data } = await client.get('/auth/verify-email', { params: { token } })
  return data
}

// POST /api/auth/login -> { user, accessToken, refreshToken }
export async function login({ email, password }) {
  const { data } = await client.post('/auth/login', { email, password })
  return data
}

// POST /api/auth/logout — revoke the refresh token
export async function logout(refreshToken) {
  const { data } = await client.post('/auth/logout', { refreshToken })
  return data
}

// POST /api/auth/forgot-password
export async function forgotPassword(email) {
  const { data } = await client.post('/auth/forgot-password', { email })
  return data
}

// POST /api/auth/reset-password
export async function resetPassword({ token, password }) {
  const { data } = await client.post('/auth/reset-password', { token, password })
  return data
}
