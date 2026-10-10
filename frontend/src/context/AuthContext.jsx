import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { TOKEN_KEY } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) return
    let active = true
    api
      .get('/auth/me')
      .then(({ data }) => active && setUser(data.user))
      .catch(() => active && logout())
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [token, logout])

  const saveSession = useCallback(({ token: newToken, user: newUser }) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setUser(newUser)
    setToken(newToken)
    return newUser
  }, [])

  const login = useCallback(
    async (credentials) => saveSession((await api.post('/auth/login', credentials)).data),
    [saveSession]
  )
  const adminLogin = useCallback(
    async (credentials) => saveSession((await api.post('/auth/admin/login', credentials)).data),
    [saveSession]
  )
  const register = useCallback(
    async (payload) => saveSession((await api.post('/auth/register', payload)).data),
    [saveSession]
  )

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAdmin: user?.role === 'admin',
      isCandidate: user?.role === 'candidate',
      login,
      adminLogin,
      register,
      logout,
      setUser,
    }),
    [token, user, loading, login, adminLogin, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
