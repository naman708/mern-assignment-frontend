import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { tokenStore } from '../api/tokenStore'
import { setAuthFailureHandler } from '../api/client'
import * as authApi from '../api/auth'
import { getMe } from '../api/users'
import { pick } from '../utils/apiData'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // `loading` is true while we bootstrap the session on first load.
  const [loading, setLoading] = useState(Boolean(tokenStore.getAccess()))

  const clearSession = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  // Wire the axios client so a failed token refresh clears app state.
  useEffect(() => {
    setAuthFailureHandler(() => {
      setUser(null)
    })
  }, [])

  // On mount, if we have a token, fetch the current user to restore the session.
  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!tokenStore.getAccess()) {
        setLoading(false)
        return
      }
      try {
        const resp = await getMe()
        if (active) setUser(pick(resp, 'user'))
      } catch {
        if (active) clearSession()
      } finally {
        if (active) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [clearSession])

  const login = useCallback(async (credentials) => {
    const resp = await authApi.login(credentials)
    const accessToken = resp.accessToken ?? resp.data?.accessToken
    const refreshToken = resp.refreshToken ?? resp.data?.refreshToken
    tokenStore.set({ accessToken, refreshToken })
    const loggedInUser = pick(resp, 'user')
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefresh()
    try {
      if (refreshToken) await authApi.logout(refreshToken)
    } catch {
      // Even if the revoke call fails, clear local session.
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: Boolean(user) || Boolean(tokenStore.getAccess()),
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user, loading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
