import client from './client'

// GET /api/users?page&limit&search -> paginated list with metadata
export async function listUsers({ page = 1, limit = 10, search = '' } = {}) {
  const params = { page, limit }
  if (search) params.search = search
  const { data } = await client.get('/users', { params })
  return data
}

// GET /api/users/me -> current user's profile
export async function getMe() {
  const { data } = await client.get('/users/me')
  return data
}

// PUT /api/users/me — multipart (optional name and/or profileImage)
export async function updateMe({ name, profileImage }) {
  const form = new FormData()
  if (name != null) form.append('name', name)
  if (profileImage) form.append('profileImage', profileImage)
  const { data } = await client.put('/users/me', form)
  return data
}

// GET /api/users/:id -> public profile
export async function getUserById(id) {
  const { data } = await client.get(`/users/${id}`)
  return data
}

// DELETE /api/users/:id — admin only
export async function deleteUser(id) {
  const { data } = await client.delete(`/users/${id}`)
  return data
}
