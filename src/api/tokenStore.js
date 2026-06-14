// Centralized localStorage access for auth tokens so the axios client and the
// auth context read/write through one place.
const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}
