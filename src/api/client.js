import axios from 'axios'
import { tokenStore } from './tokenStore'

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`

const client = axios.create({
  baseURL: BASE_URL,
})

// Attach the access token to every request.
client.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Refresh-token rotation handling ---
// A single in-flight refresh promise prevents multiple concurrent 401s from
// firing several /auth/refresh calls at once.
let refreshPromise = null

// Callback set by the auth context so a hard refresh failure can clear app state
// and redirect to login.
let onAuthFailure = () => {}
export const setAuthFailureHandler = (fn) => {
  onAuthFailure = fn
}

async function refreshTokens() {
  const refreshToken = tokenStore.getRefresh()
  if (!refreshToken) throw new Error('No refresh token')

  // Use a bare axios call (not `client`) to avoid recursive interceptor logic.
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
  const tokens = {
    accessToken: data.accessToken ?? data.data?.accessToken,
    refreshToken: data.refreshToken ?? data.data?.refreshToken,
  }
  if (!tokens.accessToken) throw new Error('Refresh response missing access token')
  tokenStore.set(tokens)
  return tokens.accessToken
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // Only attempt a refresh on 401, once per request, and never for the
    // refresh endpoint itself.
    const isRefreshCall = original?.url?.includes('/auth/refresh')
    if (status === 401 && !original?._retry && !isRefreshCall && tokenStore.getRefresh()) {
      original._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = refreshTokens().finally(() => {
            refreshPromise = null
          })
        }
        const newAccess = await refreshPromise
        original.headers.Authorization = `Bearer ${newAccess}`
        return client(original)
      } catch (refreshErr) {
        tokenStore.clear()
        onAuthFailure()
        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(error)
  }
)

export default client
